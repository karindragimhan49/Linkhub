# --- Application Load Balancer (ALB) ---
resource "aws_lb" "main" {
  name               = "${var.app_name}-alb"
  internal           = false # This makes it internet-facing
  load_balancer_type = "application"
  security_groups    = [aws_security_group.ecs_sg.id] # Use the firewall we created
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id] # Place it in our public subnets

  tags = {
    Name = "${var.app_name}-alb"
  }
}

# --- Target Group for the Frontend ---
# This group will contain our client container
resource "aws_lb_target_group" "client" {
  name        = "${var.app_name}-client-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip" # Required for Fargate

  health_check {
    path                = "/"
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

# --- Listener for the ALB ---
# Listens for traffic on port 80 (HTTP) and forwards it
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  # Default action: forward traffic to our client's target group
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.client.arn
  }
}