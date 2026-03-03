#Rds.tf
data "aws_db_instance" "mysql" {
  db_instance_identifier = "${var.project_name}"
}

locals{
  ecr = "${var.aws_account_id}.dkr.ecr.${var.aws_region}.amazonaws.com"
  common_environment = [
    { name = "SPRING_PROFILES_ACTIVE", value = "docker" },
    { name = "EUREKA_CLIENT_SERVICEURL_DEFAULTZONE", value = "http://eureka-server.fittrack.local:8761/eureka" },
    { name = "SPRING_CLOUD_CONFIG_URI", value = "http://config-server.fittrack.local:8071" }
  ]
  keycloak_realm_url = "http://keycloak.fittrack.local:8080/realms/${var.keycloak_realm}"
  keycloak_db_url = "jdbc:postgresql://${data.aws_db_instance.keycloak-db.address}:5432/postgres"
  //mysql_url = "jdbc:mysql://${aws_db_instance.mysql.address}:3306/fittrack"
  mysql_endpoint = data.aws_db_instance.mysql.address
  mysql_port     = data.aws_db_instance.mysql.port
}

locals {
  public_subnets = [
    data.aws_subnet.public_1.id,
    data.aws_subnet.public_2.id
  ]

  private_subnets = [
    data.aws_subnet.private_1.id,
    data.aws_subnet.private_2.id
  ]
}
