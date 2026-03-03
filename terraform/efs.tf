resource "aws_efs_file_system" "mongodb" {
  creation_token = "mongodb-efs"
  encrypted      = true

  lifecycle_policy {
    transition_to_ia = "AFTER_30_DAYS"
  }

  tags = {
    Name = "mongodb-efs"
  }
}

resource "aws_efs_mount_target" "mongodb" {
  for_each       = toset(local.private_subnets)
  file_system_id = aws_efs_file_system.mongodb.id
  subnet_id      = each.value
  security_groups = [aws_security_group.efs_sg.id]
}

resource "aws_security_group" "efs_sg" {
  name   = "efs-sg"
  vpc_id = data.aws_vpc.main.id

  ingress {
    from_port       = 2049
    to_port         = 2049
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_efs_access_point" "mongodb" {
  file_system_id = aws_efs_file_system.mongodb.id

  posix_user {
    uid = 999
    gid = 999
  }

  root_directory {
    path = "/mongodb"
    creation_info {
      owner_uid   = 999
      owner_gid   = 999
      permissions = "755"
    }
  }
}