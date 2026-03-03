#ALB SecurityGroup
resource "aws_security_group" "alb_sg" {
  name        = "${var.project_name}-alb-sg"
  description = "Allow HTTP"
  vpc_id      = data.aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-alb-sg"
  }
}

# Security group for ECS tasks (allow from ALB)
resource "aws_security_group" "ecs_tasks_sg" {
  name   = "${var.project_name}-ecs-tasks-sg"
  vpc_id = data.aws_vpc.main.id

//  ingress {
//    from_port       = 8080
//    to_port         = 8084
//    protocol        = "tcp"
//    security_groups = [aws_security_group.alb_sg.id]
//  }

  # Frontend (Nginx / React)
  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  # API Gateway + Keycloak
  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }
  ingress {
    from_port       = 8082
    to_port         = 8082
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }
  ingress {
    from_port       = 8081
    to_port         = 8081
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }
  ingress {
    from_port       = 8083
    to_port         = 8083
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }


  # Config Server (internal)
  ingress {
    from_port = 8071
    to_port   = 8071
    protocol  = "tcp"
    self      = true
  }

  ingress {
    from_port       = 8761
    to_port         = 8761
    protocol        = "tcp"
    security_groups = [data.aws_security_group.bastion_sg.id]
  }


  //  ingress {
//    from_port       = 8084
//    to_port         = 8084
//    protocol        = "tcp"
//    security_groups = [aws_security_group.alb_sg.id]
//  }

  ingress {
    from_port = 0
    to_port   = 65535
    protocol  = "tcp"
    self      = true
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-ecs-tasks-sg"
  }
}
resource "aws_security_group" "vpce_sg" {
  vpc_id = data.aws_vpc.main.id

  ingress {
    from_port = 443
    to_port   = 443
    protocol  = "tcp"
    security_groups = [aws_security_group.ecs_tasks_sg.id]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group_rule" "allow_ecs_to_keycloak_db" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = data.aws_security_group.keycloak_rds_sg.id
  source_security_group_id = aws_security_group.ecs_tasks_sg.id
}
resource "aws_security_group_rule" "allow_bastion_to_mongodb" {
  type                     = "ingress"
  from_port                = 27017
  to_port                  = 27017
  protocol                 = "tcp"
  security_group_id        = aws_security_group.ecs_tasks_sg.id
  source_security_group_id = data.aws_security_group.bastion_sg.id
}


//resource "aws_security_group_rule" "allow_ecs_to_config_server" {
//  type                     = "ingress"
//  from_port                = 8071
//  to_port                  = 8071
//  protocol                 = "tcp"
//  security_group_id        = aws_security_group.ecs_tasks_sg.id
//  source_security_group_id = aws_security_group.ecs_tasks_sg.id
//}

