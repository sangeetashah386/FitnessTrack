data "aws_ecr_repository" "config_server" {
  name = "config-server"
}
data "aws_ecr_repository" "eureka_server" {
  name = "eureka-server"
}
data "aws_ecr_repository" "api_gateway" {
  name = "api-gateway"
}
data "aws_ecr_repository" "user_service" {
  name = "user-service"
}
data "aws_ecr_repository" "activity_service" {
  name = "activity-service"
}
data "aws_ecr_repository" "nutrition_service" {
  name = "nutrition-service"
}
data "aws_ecr_repository" "recommendation_service" {
  name = "recommendation-service"
}
data "aws_ecr_repository" "frontend" {
  name = "frontend"
}


data "aws_ecr_repository" "mongodb" {
  name = "mongodb"
}

data "aws_ecr_repository" "rabbitmq" {
  name = "rabbitmq"
}



data "aws_ecr_repository" "keycloak" {
  name = "keycloak"
}
