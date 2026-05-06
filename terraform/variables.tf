variable "aws_region" {
  description = "AWS region to deploy resources into"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used as prefix for all resource names"
  type        = string
  default     = "apple-website"
}

variable "ecr_image_uri" {
  description = "Full ECR image URI including tag"
  type        = string
  default     = "520899053888.dkr.ecr.us-east-1.amazonaws.com/apple-website:latest"
}

variable "container_port" {
  description = "Port the container exposes"
  type        = number
  default     = 8080
}

variable "task_cpu" {
  description = "Fargate task CPU units (256 = 0.25 vCPU)"
  type        = string
  default     = "256"
}

variable "task_memory" {
  description = "Fargate task memory in MiB"
  type        = string
  default     = "512"
}

variable "desired_count" {
  description = "Number of ECS tasks to run"
  type        = number
  default     = 1
}

variable "account_id" {
  description = "AWS account ID"
  type        = string
  default     = "520899053888"
}

variable "lab_role_arn" {
  description = "ARN of the AWS Academy LabRole (used as ECS task execution and task role)"
  type        = string
  default     = "arn:aws:iam::520899053888:role/LabRole"
}
