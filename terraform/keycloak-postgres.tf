#  Subnet group for RDS Postgres
//resource "aws_db_subnet_group" "keycloak" {
//  name       = "${var.project_name}-keycloak-subnet-group"
//  subnet_ids = aws_subnet.private[*].id
//
//  tags = {
//    Name = "${var.project_name}-keycloak-subnet-group"
//  }
//}
//
//#  Security group for RDS Postgres
//resource "aws_security_group" "keycloak_rds_sg" {
//  name   = "${var.project_name}-keycloak-rds-sg"
//  vpc_id = aws_vpc.main.id
//
//  ingress {
//    from_port       = 5432
//    to_port         = 5432
//    protocol        = "tcp"
//    security_groups = [aws_security_group.ecs_tasks_sg.id]
//  }
//
//  egress {
//    from_port   = 0
//    to_port     = 0
//    protocol    = "-1"
//    cidr_blocks = ["0.0.0.0/0"]
//  }
//}
//
//#  Read Keycloak DB password from SSM
//data "aws_ssm_parameter" "keycloak_db_password" {
//  name = "/fittrack/keycloak/db_password"
//}
//
//#  RDS PostgreSQL instance for Keycloak
//resource "aws_db_instance" "keycloak" {
//  identifier           = "${var.project_name}-keycloak-db"
//  engine               = "postgres"
//  instance_class       = "db.t3.micro"
//  allocated_storage    = 20
//
//  db_name              = "keycloak"
//  username             = "keycloak"
//  password             = data.aws_ssm_parameter.keycloak_db_password.value
//
//  skip_final_snapshot  = true
//  publicly_accessible  = false
//
//  vpc_security_group_ids = [aws_security_group.keycloak_rds_sg.id]
//  db_subnet_group_name   = aws_db_subnet_group.keycloak.name
//
//  deletion_protection = false
//
////  lifecycle {
////    prevent_destroy = true
////  }
//
//  tags = {
//    Name = "${var.project_name}-keycloak-db"
//  }
//}

data "aws_db_instance" "keycloak-db" {
  db_instance_identifier = "keycloak-db"
}
data "aws_security_group" "keycloak_rds_sg" {
  id = "sg-06263c12679c88917"
}

