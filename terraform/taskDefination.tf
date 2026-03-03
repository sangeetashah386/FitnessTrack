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
      portMappings = [{
        containerPort = 8080
        hostPort = 8080
      }]
      environment = concat(local.common_environment, [
        { name = "KEYCLOAK_AUTH_SERVER_URL", value = local.keycloak_realm_url },
        { name  = "EUREKA_CLIENT_SERVICEURL_DEFAULTZONE", value = "http://eureka-server.fittrack.local:8761/eureka/" }
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
      portMappings = [{
        containerPort = 8081
        hostPort = 8081
      }]
      environment = concat(local.common_environment, [
        //{ name = "SPRING_DATASOURCE_URL",      value =  "jdbc:mysql://${aws_db_instance.mysql.address}:3306/fittrack"},
        { name  = "SPRING_DATASOURCE_URL", value = "jdbc:mysql://${local.mysql_endpoint}:${local.mysql_port}/fittrack" },
        { name = "SPRING_DATASOURCE_USERNAME", value = "user_service" },
        { name = "SPRING_RABBITMQ_HOST",       value = var.rabbitmq_host },
        { name = "KEYCLOAK_AUTH_SERVER_URL", value = local.keycloak_realm_url },
        { name  = "EUREKA_CLIENT_SERVICEURL_DEFAULTZONE", value = "http://eureka-server.fittrack.local:8761/eureka/" }

      ])
      secrets = [
        {
          name      = "SPRING_DATASOURCE_PASSWORD"
          valueFrom = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/fittrack/mysql/user_service/password"
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
      portMappings = [{
        containerPort = 8082
        hostPort = 8082
      }]
      environment = concat(local.common_environment, [
       // { name = "SPRING_DATASOURCE_URL",      value = "jdbc:mysql://${aws_db_instance.mysql.address}:3306/fittrack"  },
        { name  = "SPRING_DATASOURCE_URL", value = "jdbc:mysql://${local.mysql_endpoint}:${local.mysql_port}/fittrack" },
        { name = "SPRING_DATASOURCE_USERNAME", value = "activity_service"},
        { name = "SPRING_RABBITMQ_HOST",       value = var.rabbitmq_host },
        { name = "SPRING_PROFILES_ACTIVE", value = "default" },
        { name  = "EUREKA_CLIENT_SERVICEURL_DEFAULTZONE", value = "http://eureka-server.fittrack.local:8761/eureka/" }
      ])
      secrets = [
        {
          name      = "SPRING_DATASOURCE_PASSWORD"
          valueFrom = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/fittrack/mysql/activity_service/password"
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
      portMappings = [{
        containerPort = 8083
        hostPort = 8083
      }]
      environment = concat(local.common_environment, [
        { name = "SPRING_DATA_MONGODB_URI", value = var.mongo_nutrition_uri },
        { name = "SPRING_RABBITMQ_HOST",    value = var.rabbitmq_host },
        { name = "GEMINI_API_URL",          value = var.gemini_api_url },
        { name  = "EUREKA_CLIENT_SERVICEURL_DEFAULTZONE", value = "http://eureka-server.fittrack.local:8761/eureka/" }
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
      portMappings = [{
        containerPort = 8084
        hostPort = 8084
      }]
      environment = concat(local.common_environment, [
        { name = "SPRING_DATA_MONGODB_URI", value = var.mongo_recommendation_uri },
        { name = "SPRING_RABBITMQ_HOST",    value = var.rabbitmq_host },
        { name = "GEMINI_API_URL",          value = var.gemini_api_url },
        { name  = "EUREKA_CLIENT_SERVICEURL_DEFAULTZONE", value = "http://eureka-server.fittrack.local:8761/eureka/" }
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
      portMappings = [
        { containerPort = 80
          hostPort = 80
          protocol = "tcp"
        }]
      environment = [
        {
          name  = "API_BASE_URL"
          value = "https://${aws_ssm_parameter.alb_dns.value}/api"
        }
      ]
      command = [
        "sh",
        "-c",
        "echo \"window.API_BASE_URL='$API_BASE_URL'\" > /usr/share/nginx/html/runtime-env.js && nginx -g 'daemon off;'"
      ]

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



#MongoDb
resource "aws_ecs_task_definition" "mongodb" {
  family                   = "mongodb"
  cpu                      = 512
  memory                   = 1024
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn = aws_iam_role.ecs_task_role.arn


  container_definitions = jsonencode([
    {
      name      = "mongodb"
      image     = "${local.ecr}/${var.images.mongodb}"
      essential = true
      command = [
        "mongod",
        "--bind_ip",
        "0.0.0.0",
        "--dbpath",
        "/data/db"

      ]
      mountPoints = [{
        sourceVolume  = "mongodb-data"
        containerPath = "/data/db"
        readOnly      = false
      }]
      portMappings = [{
        containerPort = 27017
        hostPort = 27017
      }]

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
  volume {
    name = "mongodb-data"

    efs_volume_configuration {
      file_system_id     = aws_efs_file_system.mongodb.id
      transit_encryption = "ENABLED"

      authorization_config {
        access_point_id = aws_efs_access_point.mongodb.id
        iam             = "ENABLED"
      }
    }
  }

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



#KEYCLOAK
resource "aws_ecs_task_definition" "keycloak" {
  family                   = "keycloak"
  cpu                      = 1024
  memory                   = 2048
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn = aws_iam_role.ecs_task_role.arn
  runtime_platform {
    cpu_architecture        = "X86_64"
    operating_system_family = "LINUX"
  }

  container_definitions = jsonencode([
    {
      name      = "keycloak"
      //image     = "quay.io/keycloak/keycloak:21.1.1"
      image     = "${local.ecr}/${var.images.keycloak}"
      essential = true
      portMappings = [
        {
          containerPort = 8080
          //containerPort = 8443
          protocol= "tcp"
        }
      ]

//      command = [
//        "start",
//        "--features=preview",
//        "--hostname-strict=false",
//        "--hostname-strict-https=false",
//        "--hostname=keycloak",
//        "--http-port=8080"
//      ]
      command = [
        "start",
        "--http-enabled=true",
       // "--https-port=8443",
        "--http-port=8080",
        "--proxy=edge",
        "--features=declarative-user-profile,account3"
      ]

      environment = [
        { name = "KC_DB",                   value = "postgres" },
        { name = "KC_DB_URL",               value = "jdbc:postgresql://${data.aws_db_instance.keycloak-db.address}:5432/postgres" },
        { name = "KC_DB_USERNAME",          value = "keycloak" },
       // { name = "KC_HTTP_ENABLED",   value = "false" },

//        { name = "KEYCLOAK_FRONTEND_URL",   value = "http://${aws_lb.alb.dns_name}" },
        { name = "KC_PROXY",                value = "edge" },
        { name = "KC_HOSTNAME",             value = "auth.fitnesstrackapp.click"},
//        {
//          name  = "KC_HOSTNAME_URL"
//          value = "https://${aws_cloudfront_distribution.cf.domain_name}"
//        },

        { name = "KC_HOSTNAME_STRICT",      value = "false" },
        { name = "KC_HOSTNAME_STRICT_HTTPS",value = "true" },
        { name = "KC_HEALTH_ENABLED",       value = "true" },
        { name = "KC_FEATURES", value = "user-profile" }

      ]
      secrets = [
        {
          name      = "KEYCLOAK_ADMIN"
          valueFrom = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter${var.keycloak_admin_user_ssm_param}"
        },
        {
          name      = "KEYCLOAK_ADMIN_PASSWORD"
          valueFrom = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter${var.keycloak_admin_password_ssm_param}"
        },
        {
          name      = "KC_DB_PASSWORD"
          valueFrom = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/fittrack/keycloak/db_password"
        }
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









