output "s3_bucket_name" {
  description = "Name of the S3 artifacts bucket"
  value       = aws_s3_bucket.app_bucket.id
}

output "s3_bucket_arn" {
  description = "ARN of the S3 artifacts bucket"
  value       = aws_s3_bucket.app_bucket.arn
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.main.name
}

output "ecs_cluster_arn" {
  description = "ECS cluster ARN"
  value       = aws_ecs_cluster.main.arn
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = aws_ecs_service.app.name
}

output "task_definition_arn" {
  description = "ARN of the ECS task definition"
  value       = aws_ecs_task_definition.app.arn
}

output "security_group_id" {
  description = "Security group ID attached to ECS tasks"
  value       = aws_security_group.ecs_sg.id
}

output "cloudwatch_log_group" {
  description = "CloudWatch log group for ECS task logs"
  value       = aws_cloudwatch_log_group.ecs_logs.name
}

output "ecr_image_uri" {
  description = "ECR image URI deployed to ECS"
  value       = var.ecr_image_uri
}

output "how_to_get_public_ip" {
  description = "Command to retrieve the running task's public IP"
  value       = <<-EOT
    Run this after apply to get the public IP:
    
    TASK_ARN=$(aws ecs list-tasks --cluster ${aws_ecs_cluster.main.name} --service-name ${aws_ecs_service.app.name} --query 'taskArns[0]' --output text)
    ENI_ID=$(aws ecs describe-tasks --cluster ${aws_ecs_cluster.main.name} --tasks $TASK_ARN --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' --output text)
    aws ec2 describe-network-interfaces --network-interface-ids $ENI_ID --query 'NetworkInterfaces[0].Association.PublicIp' --output text
  EOT
}
