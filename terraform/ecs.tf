# --- ECS Cluster ---
# A logical grouping for our services and tasks
resource "aws_ecs_cluster" "main" {
  name = "${var.app_name}-cluster"

  tags = {
    Name = "${var.app_name}-cluster"
  }
}
# --- ECS Task Definition ---
# The blueprint for our application's containers.
resource "aws_ecs_task_definition" "main" {
  family                   = "${var.app_name}-task"
  network_mode             = "awsvpc" # Required for Fargate
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"  # 0.25 vCPU
  memory                   = "512"  # 512 MB of RAM
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  # This is a JSON array that defines our containers
  container_definitions = jsonencode([
    # --- The Frontend Container Definition ---
    {
      name      = "${var.app_name}-client"
      image     = aws_ecr_repository.client.repository_url # Get the image URL from our ECR repo
      cpu       = 128
      memory    = 256
      essential = true # If this container fails, the whole task fails
      portMappings = [
        {
          containerPort = 3000,
          hostPort      = 3000
        }
      ]
      environment = [
        {
          name  = "NEXT_PUBLIC_API_URL",
          # IMPORTANT: Inside the VPC, containers talk to each other via localhost
          value = "http://localhost:5000/api"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          "awslogs-group"         = "/ecs/${var.app_name}",
          "awslogs-region"        = var.aws_region,
          "awslogs-stream-prefix" = "client"
        }
      }
    },
    # --- The Backend Container Definition ---
    {
      name      = "${var.app_name}-server"
      image     = aws_ecr_repository.server.repository_url
      cpu       = 128
      memory    = 256
      essential = true
      portMappings = [
        {
          containerPort = 5000,
          hostPort      = 5000
        }
      ]
      secrets = [ # We pass the MONGO_URI securely
        {
          name      = "MONGO_URI",
          valueFrom = aws_ssm_parameter.mongo_uri.arn
        }
      ]
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          "awslogs-group"         = "/ecs/${var.app_name}",
          "awslogs-region"        = var.aws_region,
          "awslogs-stream-prefix" = "server"
        }
      }
    }
  ])

  tags = {
    Name = "${var.app_name}-task-definition"
  }
}

# --- AWS Systems Manager (SSM) Parameter Store ---
# A secure place to store our MONGO_URI
resource "aws_ssm_parameter" "mongo_uri" {
  name  = "/${var.app_name}/mongo_uri"
  type  = "SecureString"
  value = "mongodb+srv://karindragimhanpro:Acer%401234@snippets.z2egfte.mongodb.net/?retryWrites=true&w=majority&appName=snippets" # <-- IMPORTANT: Paste your actual MongoDB connection string here
}

# --- CloudWatch Log Group ---
# A place to store logs from our containers
resource "aws_cloudwatch_log_group" "main" {
  name = "/ecs/${var.app_name}"

  tags = {
    Name = "${var.app_name}-log-group"
  }
}