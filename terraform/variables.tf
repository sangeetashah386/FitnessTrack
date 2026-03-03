variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "project_name" {
  type    = string
  default = "fittrack"
}

//variable "vpc_cidr" {
//  type    = string
//  default = "10.0.0.0/16"
//}
//
//variable "public_subnets" {
//  type    = list(string)
//  default = ["10.0.1.0/24", "10.0.2.0/24"]
//}
//
//variable "private_subnets" {
//  type    = list(string)
//  default = ["10.0.11.0/24", "10.0.12.0/24"]
//}

variable "ecs_task_cpu" {
  type    = number
  default = 512
}

variable "ecs_task_memory" {
  type    = number
  default = 1024
}


# RDS endpoint, Mongo URI, Keycloak URL, RabbitMQ host, etc.
//variable "mysql_url" {
 // type = string

//}

variable "mysql_username" {
  type = string
}

variable "mysql_password_ssm_param" {
  type        = string
  description = "SSM parameter name storing MySQL password"
  default     = "/fittrack/mysql/password"
}

variable "gemini_api_key_ssm_param" {
  type        = string
  description = "SSM parameter name storing Gemini API key"
  default     = "/fittrack/gemini/api_key"
}

variable "gemini_api_url" {
  type    = string
  default = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="
}


variable "rabbitmq_host" {
  type = string
}

variable "mongo_nutrition_uri" {
  type        = string

}

variable "mongo_recommendation_uri" {
  type        = string

}
variable "keycloak_realm" {
  type    = string
  default = "fitness-oauth2"
}


# Keycloak admin via SSM
variable "keycloak_admin_user_ssm_param" {
  type    = string
  default = "/fittrack/keycloak/admin_user"
}

variable "keycloak_admin_password_ssm_param" {
  type    = string
  default = "/fittrack/keycloak/admin_password"
}
variable "aws_account_id" {
  default = "049706517419"
}


# All images from ECR
variable "images" {
  type = map(string)
  default = {
    config_server         = "config-server:latest"
    eureka_server         = "eureka-server:latest"
    api_gateway           = "api-gateway:latest"
    user_service          = "user-service:latest"
    activity_service      = "activity-service:latest"
    nutrition_service     = "nutrition-service:latest"
    recommendation_service = "recommendation-service:latest"
    frontend              = "frontend:latest"

    mysql                 = "mysql:latest"
    mongodb               = "mongodb:latest"
    rabbitmq              = "rabbitmq:latest"
    keycloak_postgres     = "keycloak-postgres:latest"
    keycloak              = "keycloak:latest"
  }
}
