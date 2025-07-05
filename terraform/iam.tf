// terraform/iam.tf (FIXED - only IAM resources)

# --- IAM Role for ECS Tasks ---
# This role allows our ECS tasks to be managed by AWS and pull images from ECR.
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.app_name}-ecs-task-execution-role"

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

# --- New IAM Policy for SSM Parameter Access ---
resource "aws_iam_policy" "ssm_policy" {
  name        = "${var.app_name}-ssm-read-policy"
  description = "Allows ECS tasks to read from SSM Parameter Store"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = [
          "ssm:GetParameters"
        ],
        Resource = [
          aws_ssm_parameter.mongo_uri.arn
        ]
      }
    ]
  })
}

# --- Attach the new policy to our existing role ---
resource "aws_iam_role_policy_attachment" "ecs_ssm_policy_attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ssm_policy.arn
}