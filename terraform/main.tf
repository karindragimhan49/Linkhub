# --- Terraform & Provider Configuration ---
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# --- AWS Provider Configuration ---
# We tell Terraform which region to build our resources in.
provider "aws" {
  region = var.aws_region
}