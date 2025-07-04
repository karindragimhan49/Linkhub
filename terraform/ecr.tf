# --- ECR Repository for the Backend (Server) Image ---
resource "aws_ecr_repository" "server" {
  name = "${var.app_name}-server" # Will create a repo named 'linkhub-server'
  
  image_tag_mutability = "MUTABLE" # Allows us to overwrite the 'latest' tag

  image_scanning_configuration {
    scan_on_push = true
  }
}

# --- ECR Repository for the Frontend (Client) Image ---
resource "aws_ecr_repository" "client" {
  name = "${var.app_name}-client" # Will create a repo named 'linkhub-client'

  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}