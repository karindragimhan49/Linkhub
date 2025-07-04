# --- IAM Role for ECS Tasks ---
# This role allows our ECS tasks to be managed by AWS and pull images from ECR.
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.app_name}-ecs-task-execution-role"

  # This policy allows ECS to assume this role.
  assume_role_policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [
      {
        Action    = "sts:AssumeRole",
        Effect    = "Allow",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.app_name}-ecs-task-execution-role"
  }
}

# --- Attach the AWS managed policy to our role ---
# This policy gives the necessary permissions for ECS tasks (like logging, pulling images).
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# --- ECS Service ---
# This service is responsible for running and maintaining our Task Definition.
resource "aws_ecs_service" "main" {
  name            = "${var.app_name}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.main.arn
  desired_count   = 1 # We want one copy of our application running
  launch_type     = "FARGATE"

  # Network configuration for our service
  network_configuration {
    subnets         = [aws_subnet.public_a.id, aws_subnet.public_b.id]
    security_groups = [aws_security_group.ecs_sg.id]
    assign_public_ip = true # Assign a public IP to our Fargate task
  }

  # Connect our service to the Application Load Balancer
  load_balancer {
    target_group_arn = aws_lb_target_group.client.arn
    container_name   = "${var.app_name}-client"
    container_port   = 3000 # The port our frontend container exposes
  }

  # This helps prevent issues during deployments
  depends_on = [aws_lb_listener.http]

  tags = {
    Name = "${var.app_name}-service"
  }
}