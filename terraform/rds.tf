

data "aws_ssm_parameter" "mysql_password" {
  name = var.mysql_password_ssm_param
}


data "aws_security_group" "rds_sg" {
  filter {
    name   = "group-name"
    values = ["${var.project_name}-rds-sg"]
  }

  vpc_id = data.aws_vpc.main.id
}
resource "aws_security_group_rule" "rds_allow_ecs" {
  type                     = "ingress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  security_group_id        = data.aws_security_group.rds_sg.id
  source_security_group_id = aws_security_group.ecs_tasks_sg.id
}



data "aws_security_group" "bastion_sg" {
  id = "sg-0eb08ee6bc4640e6d"
}





