# ──────────────────────────────────────────────────────────────────────────────
# Data sources — use existing default VPC & subnets
# ──────────────────────────────────────────────────────────────────────────────
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "public" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
  filter {
    name   = "default-for-az"
    values = ["true"]
  }
}

# ──────────────────────────────────────────────────────────────────────────────
# S3 Bucket — versioning, encryption, public access blocked
# Unique name = project-name + account-id to avoid global collisions
# ──────────────────────────────────────────────────────────────────────────────
resource "aws_s3_bucket" "app_bucket" {
  bucket        = "${var.project_name}-${var.account_id}-artifacts"
  force_destroy = true

  tags = {
    Name    = "${var.project_name}-artifacts"
    Project = var.project_name
  }
}

resource "aws_s3_bucket_versioning" "app_bucket" {
  bucket = aws_s3_bucket.app_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "app_bucket" {
  bucket = aws_s3_bucket.app_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "app_bucket" {
  bucket = aws_s3_bucket.app_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ──────────────────────────────────────────────────────────────────────────────
# Security Group — allow inbound HTTP on port 80, all outbound
# ──────────────────────────────────────────────────────────────────────────────
resource "aws_security_group" "ecs_sg" {
  name        = "${var.project_name}-ecs-sg"
  description = "Allow HTTP inbound to ECS Fargate tasks"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "HTTP from anywhere"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "All outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "${var.project_name}-ecs-sg"
    Project = var.project_name
  }
}

# ──────────────────────────────────────────────────────────────────────────────
# ECS Cluster
# ──────────────────────────────────────────────────────────────────────────────
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name    = "${var.project_name}-cluster"
    Project = var.project_name
  }
}

# ──────────────────────────────────────────────────────────────────────────────
# CloudWatch Log Group — for ECS task logs
# ──────────────────────────────────────────────────────────────────────────────
resource "aws_cloudwatch_log_group" "ecs_logs" {
  name              = "/ecs/${var.project_name}"
  retention_in_days = 7

  tags = {
    Project = var.project_name
  }
}

# ──────────────────────────────────────────────────────────────────────────────
# ECS Task Definition
# Uses LabRole for both execution and task role (AWS Academy constraint)
# ──────────────────────────────────────────────────────────────────────────────
resource "aws_ecs_task_definition" "app" {
  family                   = "${var.project_name}-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.task_cpu
  memory                   = var.task_memory

  # AWS Academy: cannot create IAM roles, so we reuse the pre-existing LabRole
  execution_role_arn = var.lab_role_arn
  task_role_arn      = var.lab_role_arn

  container_definitions = jsonencode([
    {
      name      = var.project_name
      image     = var.ecr_image_uri
      essential = true

      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = var.container_port
          protocol      = "tcp"
        }
      ]

      healthCheck = {
        command     = ["CMD-SHELL", "wget -qO- http://127.0.0.1:8080/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 10
      }

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs_logs.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  tags = {
    Name    = "${var.project_name}-task"
    Project = var.project_name
  }
}

# ──────────────────────────────────────────────────────────────────────────────
# ECS Service — Fargate, public IP enabled (no ALB to keep costs low)
# ──────────────────────────────────────────────────────────────────────────────
resource "aws_ecs_service" "app" {
  name            = "${var.project_name}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  # Force a new deployment every time Terraform runs (picks up new image tags)
  force_new_deployment = true

  network_configuration {
    subnets          = data.aws_subnets.public.ids
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }

  # Give the task time to pass its health check before Terraform declares success
  timeouts {
    create = "10m"
    update = "10m"
  }

  tags = {
    Name    = "${var.project_name}-service"
    Project = var.project_name
  }

  depends_on = [aws_cloudwatch_log_group.ecs_logs]
}
