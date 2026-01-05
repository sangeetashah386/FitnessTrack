locals{
  ecr = "${var.aws_account_id}.dkr.ecr.${var.aws_region}.amazonaws.com"
  common_environment = [
    { name = "SPRING_PROFILES_ACTIVE", value = "docker" },
    { name = "EUREKA_CLIENT_SERVICEURL_DEFAULTZONE", value = "http://eureka-server:8761/eureka" },
    { name = "SPRING_CLOUD_CONFIG_URI", value = "http://config-server:8071" }
  ]
  keycloak_realm_url = "http://keycloak:8080/realms/${var.keycloak_realm}"

}