# This file defines values that will be easily accessible after `terraform apply`

output "aws_region" {
  description = "The AWS region where resources are deployed."
  value       = var.aws_region
}

output "ecs_cluster_name" {
  description = "The name of the ECS cluster."
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "The name of the ECS service."
  value       = aws_ecs_service.main.name
}

output "ecr_server_repository_url" {
  description = "The URL of the ECR repository for the server."
  value       = aws_ecr_repository.server.repository_url
}

output "ecr_client_repository_url" {
  description = "The URL of the ECR repository for the client."
  value       = aws_ecr_repository.client.repository_url
}

output "app_url" {
  description = "The public URL of the application."
  value       = "http://${aws_lb.main.dns_name}"
}