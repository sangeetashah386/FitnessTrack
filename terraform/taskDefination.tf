# CONFIG-SERVER
resource "aws_ecs_task_definition" "config_server" {
  family                   = "config-server"
  cpu                      = var.ecs_task_cpu
  memory                   = var.ecs_task_memory
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "config-server"
      image     = "${local.ecr}/${var.images.config_server}"
      essential = true
      portMappings = [{ containerPort = 8071 }]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "config-server"
        }
      }
    }
  ])
}

#EUREKA-SERVER
resource "aws_ecs_task_definition" "eureka_server" {
  family                   = "eureka-server"
  cpu                      = var.ecs_task_cpu
  memory                   = var.ecs_task_memory
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "eureka-server"
      image     = "${local.ecr}/${var.images.eureka_server}"
      essential = true
      portMappings = [{ containerPort = 8761 }]
      environment = local.common_environment
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "eureka-server"
        }
      }
    }
  ])
}

#API-GATEWAY
resource "aws_ecs_task_definition" "api_gateway" {
  family                   = "api-gateway"
  cpu                      = var.ecs_task_cpu
  memory                   = var.ecs_task_memory
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "api-gateway"
      image     = "${local.ecr}/${var.images.api_gateway}"
      essential = true
      portMappings = [{ containerPort = 8080 }]
      environment = concat(local.common_environment, [
        { name = "KEYCLOAK_AUTH_SERVER_URL", value = local.keycloak_realm_url }
      ])

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "api-gateway"
        }
      }
    }
  ])
}

#USER-SERVICE
resource "aws_ecs_task_definition" "user_service" {
  family                   = "user-service"
  cpu                      = var.ecs_task_cpu
  memory                   = var.ecs_task_memory
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "user-service"
      image     = "${local.ecr}/${var.images.user_service}"
      essential = true
      portMappings = [{ containerPort = 8081 }]
      environment = concat(local.common_environment, [
        { name = "SPRING_DATASOURCE_URL",      value = var.mysql_url },
        { name = "SPRING_DATASOURCE_USERNAME", value = var.mysql_username },
        { name = "SPRING_RABBITMQ_HOST",       value = var.rabbitmq_host },
        { name = "KEYCLOAK_AUTH_SERVER_URL", value = local.keycloak_realm_url }
      ])
      secrets = [
        {
          name      = "SPRING_DATASOURCE_PASSWORD"
          valueFrom = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter${var.mysql_password_ssm_param}"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "user-service"
        }
      }
    }
  ])
}

#ACTIVITY-SERVICE
resource "aws_ecs_task_definition" "activity_service" {
  family                   = "activity-service"
  cpu                      = var.ecs_task_cpu
  memory                   = var.ecs_task_memory
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "activity-service"
      image     = "${local.ecr}/${var.images.activity_service}"
      essential = true
      portMappings = [{ containerPort = 8082 }]
      environment = concat(local.common_environment, [
        { name = "SPRING_DATASOURCE_URL",      value = var.mysql_url },
        { name = "SPRING_DATASOURCE_USERNAME", value = var.mysql_username },
        { name = "SPRING_RABBITMQ_HOST",       value = var.rabbitmq_host }
      ])
      secrets = [
        {
          name      = "SPRING_DATASOURCE_PASSWORD"
          valueFrom = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter${var.mysql_password_ssm_param}"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "activity-service"
        }
      }
    }
  ])
}

#NUTRITION-SERVICE
resource "aws_ecs_task_definition" "nutrition_service" {
  family                   = "nutrition-service"
  cpu                      = var.ecs_task_cpu
  memory                   = var.ecs_task_memory
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "nutrition-service"
      image     = "${local.ecr}/${var.images.nutrition_service}"
      essential = true
      portMappings = [{ containerPort = 8083 }]
      environment = concat(local.common_environment, [
        { name = "SPRING_DATA_MONGODB_URI", value = var.mongo_nutrition_uri },
        { name = "SPRING_RABBITMQ_HOST",    value = var.rabbitmq_host },
        { name = "GEMINI_API_URL",          value = var.gemini_api_url }
      ])
      secrets = [
        {
          name      = "GEMINI_API_KEY"
          valueFrom = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter${var.gemini_api_key_ssm_param}"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "nutrition-service"
        }
      }
    }
  ])
}

# RECOMMENDATION-SERVICE
resource "aws_ecs_task_definition" "recommendation_service" {
  family                   = "recommendation-service"
  cpu                      = var.ecs_task_cpu
  memory                   = var.ecs_task_memory
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "recommendation-service"
      image     = "${local.ecr}/${var.images.recommendation_service}"
      essential = true
      portMappings = [{ containerPort = 8084 }]
      environment = concat(local.common_environment, [
        { name = "SPRING_DATA_MONGODB_URI", value = var.mongo_recommendation_uri },
        { name = "SPRING_RABBITMQ_HOST",    value = var.rabbitmq_host },
        { name = "GEMINI_API_URL",          value = var.gemini_api_url }
      ])
      secrets = [
        {
          name      = "GEMINI_API_KEY"
          valueFrom = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter${var.gemini_api_key_ssm_param}"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "recommendation-service"
        }
      }
    }
  ])
}

#FRONTEND
resource "aws_ecs_task_definition" "frontend" {
  family                   = "frontend"
  cpu                      = var.ecs_task_cpu
  memory                   = var.ecs_task_memory
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "frontend"
      image     = "${local.ecr}/${var.images.frontend}"
      essential = true
      portMappings = [{ containerPort = 80 }]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "frontend"
        }
      }
    }
  ])
}

#MYSQL
resource "aws_ecs_task_definition" "mysql" {
  family                   = "mysql"
  cpu                      = var.ecs_task_cpu
  memory                   = var.ecs_task_memory
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "mysql"
      image     = "${local.ecr}/${var.images.mysql}"
      essential = true
      portMappings = [{ containerPort = 3306 }]
      secrets = [
        { name = "MYSQL_ROOT_PASSWORD"
          valueFrom = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/fittrack/mysql/password"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "mysql"
        }
      }
    }
  ])
}

#MongoDb
resource "aws_ecs_task_definition" "mongodb" {
  family                   = "mongodb"
  cpu                      = 256
  memory                   = 512
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "mongodb"
      image     = "${local.ecr}/${var.images.mongodb}"
      essential = true
      portMappings = [{ containerPort = 27017 }]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "mongodb"
        }
      }
    }
  ])
}

#RabbitMQ
resource "aws_ecs_task_definition" "rabbitmq" {
  family                   = "rabbitmq"
  cpu                      = var.ecs_task_cpu
  memory                   = var.ecs_task_memory
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "rabbitmq"
      image     = "${local.ecr}/${var.images.rabbitmq}"
      essential = true
      portMappings = [
        { containerPort = 5672 },
        { containerPort = 15672 }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "rabbitmq"
        }
      }
    }
  ])
}

#KEYCLOAK-POSTGRES
resource "aws_ecs_task_definition" "keycloak_postgres" {
  family                   = "keycloak-postgres"
  cpu                      = var.ecs_task_cpu
  memory                   = var.ecs_task_memory
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "keycloak-postgres"
      image     = "${local.ecr}/${var.images.keycloak_postgres}"
      essential = true
      portMappings = [{ containerPort = 5432 }]
      environment = [
        { name = "POSTGRES_DB",       value = "keycloak" },
        { name = "POSTGRES_USER",     value = "keycloak" },
        { name = "POSTGRES_PASSWORD", value = "keycloak" }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "keycloak-postgres"
        }
      }
    }
  ])
}

#KEYCLOAK
resource "aws_ecs_task_definition" "keycloak" {
  family                   = "keycloak"
  cpu                      = 1024
  memory                   = 2048
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "keycloak"
      image     = "${local.ecr}/${var.images.keycloak}"
      essential = true
      portMappings = [
        { containerPort = 8080 }
      ]

      command = [
        "start-dev",
        "--features=preview",
        "--hostname-strict=false",
        "--hostname-strict-https=false",
        "--hostname=keycloak",
        "--http-port=8080"
      ]

      environment = [
        { name = "KEYCLOAK_ADMIN",          value = "admin" },
        { name = "KEYCLOAK_ADMIN_PASSWORD", value = "admin" },
        { name = "KC_DB",                   value = "postgres" },
        { name = "KC_DB_USERNAME",          value = "keycloak" },
        { name = "KC_DB_PASSWORD",          value = "keycloak" },
        { name = "KC_DB_URL",               value = "jdbc:postgresql://keycloak-postgres:5432/keycloak" }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "keycloak"
        }
      }
    }
  ])
}









