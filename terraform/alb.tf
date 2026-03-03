

resource "aws_lb" "alb" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = local.public_subnets
  security_groups    = [aws_security_group.alb_sg.id]
}

resource "aws_lb_target_group" "frontend_tg" {
  name        = "${var.project_name}-frontend-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.main.id
  target_type = "ip"

  health_check {
    path    = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher = "200-399"
  }
}

resource "aws_lb_listener_rule" "frontend_rule" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 20

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend_tg.arn
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}



resource "aws_lb_target_group" "api_gateway_tg" {
  name     = "${var.project_name}-api-gw-tg"
  port     = 8080
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.main.id
  target_type = "ip"

  health_check {
    path               = "/actuator/health"
    port               = "8080"
    interval           = 30
    healthy_threshold  = 2
    unhealthy_threshold = 3
    timeout            = 5
    matcher            = "200-399"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }

//  default_action {
//    type             = "forward"
//    target_group_arn = aws_lb_target_group.frontend_tg.arn
//  }


}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = aws_acm_certificate_validation.ssl_cert_validation.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend_tg.arn
  }
}


resource "aws_lb_listener_rule" "api_rule" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 10

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api_gateway_tg.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}

resource "aws_lb_target_group" "keycloak_tg" {
  name        = "${var.project_name}-keycloak-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.main.id
  target_type = "ip"

  health_check {
    path                = "/health/ready"
    port                = "8080"
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    matcher             = "200-399"
//    protocol = "HTTP"
  }
}

resource "aws_lb_listener_rule" "keycloak_rule" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 5

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.keycloak_tg.arn
  }

  condition {
    path_pattern {
      values = [
        "/auth/*",
        "/admin/*",
        "/realms/*",
        "/resources/*",
        "/health*"
      ]
    }
  }
}




