# --- ECS Cluster ---
resource "aws_ecs_cluster" "main" {
  name = "${var.app_name}-cluster"
  tags = { Name = "${var.app_name}-cluster" }
}

# --- CloudWatch Log Group for our containers ---
resource "aws_cloudwatch_log_group" "main" {
  name = "/ecs/${var.app_name}"
  tags = { Name = "${var.app_name}-log-group" }
}

# --- ECS Task Definition ---
resource "aws_ecs_task_definition" "main" {
  family                   = "${var.app_name}-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256" # 0.25 vCPU
  memory                   = "512" # 512MB RAM
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    # --- The Frontend Container Definition ---
    {
      name      = "${var.app_name}-client"
      image     = aws_ecr_repository.client.repository_url
      essential = true
      portMappings = [
        { containerPort = 3000, hostPort = 3000 }
      ]
      environment = [
        {
          name  = "NEXT_PUBLIC_API_URL",
          value = "http://localhost:5000/api"
        }
      ]
      # --- THE FIX IS HERE: Complete Log Configuration ---
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.main.name,
          "awslogs-region"        = var.aws_region,
          "awslogs-stream-prefix" = "client" # To separate client logs
        }
      }
    },

    # --- The Backend Container Definition ---
    {
      name      = "${var.app_name}-server"
      image     = aws_ecr_repository.server.repository_url
      essential = true
      portMappings = [
        { containerPort = 5000, hostPort = 5000 }
      ]
      environment = [
        {
          name  = "MONGO_URI",
          value = aws_ssm_parameter.mongo_uri.value
        }
      ]
      # --- THE FIX IS HERE: Complete Log Configuration ---
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.main.name,
          "awslogs-region"        = var.aws_region,
          "awslogs-stream-prefix" = "server" # To separate server logs
        }
      }
    }
  ])

  tags = {
    Name = "${var.app_name}-task-definition"
  }
}

# --- SSM Parameter for MongoDB URI ---
resource "aws_ssm_parameter" "mongo_uri" {
  name  = "/${var.app_name}/mongo_uri"
  type  = "SecureString"
  value = "mongodb+srv://karindragimhanpro:Acer%401234@snippets.z2egfte.mongodb.net/linkhub?retryWrites=true&w=majority&appName=snippets"
}


# --- ECS Service ---
resource "aws_ecs_service" "main" {
  name            = "${var.app_name}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.main.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = [aws_subnet.public_a.id, aws_subnet.public_b.id]
    security_groups = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.client.arn
    container_name   = "${var.app_name}-client"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.http]

  tags = {
    Name = "${var.app_name}-service"
  }
}