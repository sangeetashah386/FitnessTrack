# CONFIG-SERVER
resource "aws_ecs_service" "config_server" {
  name            = "config-server"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.config_server.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs_tasks_sg.id]
    assign_public_ip = false
  }
  service_registries {
    registry_arn = aws_service_discovery_service.config_server.arn
  }
}

#EUREKA SERVER
resource "aws_ecs_service" "eureka_server" {
  name            = "eureka-server"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.eureka_server.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs_tasks_sg.id]
    assign_public_ip = false
  }
  service_registries {
    registry_arn = aws_service_discovery_service.eureka_server.arn
  }
  depends_on = [
    aws_ecs_service.config_server
  ]
}

#API-GATEWAY
resource "aws_ecs_service" "api_gateway" {
  name            = "api-gateway"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api_gateway.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  load_balancer {
    target_group_arn = aws_lb_target_group.api_gateway_tg.arn
    container_name   = "api-gateway"
    container_port   = 8080
  }

  network_configuration {
    subnets          = aws_subnet.public[*].id
    security_groups  = [aws_security_group.ecs_tasks_sg.id]
    assign_public_ip = true
  }

  service_registries {
    registry_arn = aws_service_discovery_service.api_gateway.arn
  }

  depends_on = [
    aws_lb_listener.http,
    aws_ecs_service.eureka_server,
    aws_ecs_service.keycloak
  ]
}

#USER-SERVICE
resource "aws_ecs_service" "user_service" {
  name            = "user-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.user_service.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs_tasks_sg.id]
    assign_public_ip = false
  }
  service_registries {
    registry_arn = aws_service_discovery_service.user_service.arn
  }

  depends_on = [
    aws_ecs_service.eureka_server,
    aws_ecs_service.mysql,
    aws_ecs_service.rabbitmq
  ]
}

#ACTIVITY-SERVICE
resource "aws_ecs_service" "activity_service" {
  name            = "activity-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.activity_service.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs_tasks_sg.id]
    assign_public_ip = false
  }
  service_registries {
    registry_arn = aws_service_discovery_service.activity_service.arn
  }

  depends_on = [
    aws_ecs_service.eureka_server,
    aws_ecs_service.mysql,
    aws_ecs_service.rabbitmq
  ]
}

#NUTRITION SERVICE
resource "aws_ecs_service" "nutrition_service" {
  name            = "nutrition-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.nutrition_service.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs_tasks_sg.id]
    assign_public_ip = false
  }

  service_registries {
    registry_arn = aws_service_discovery_service.nutrition_service.arn
  }

  depends_on = [
    aws_ecs_service.eureka_server,
    aws_ecs_service.mongodb,
    aws_ecs_service.rabbitmq
  ]
}

#RECOMMENDATION SERVICE
resource "aws_ecs_service" "recommendation_service" {
  name            = "recommendation-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.recommendation_service.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs_tasks_sg.id]
    assign_public_ip = false
  }

  service_registries {
    registry_arn = aws_service_discovery_service.recommendation_service.arn
  }

  depends_on = [
    aws_ecs_service.eureka_server,
    aws_ecs_service.mongodb,
    aws_ecs_service.rabbitmq
  ]
}

#FRONTEND
resource "aws_ecs_service" "frontend" {
  name            = "frontend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.public[*].id
    security_groups  = [aws_security_group.ecs_tasks_sg.id]
    assign_public_ip = true
  }
  service_registries {
    registry_arn = aws_service_discovery_service.frontend.arn
  }
}

#MYSQL
resource "aws_ecs_service" "mysql" {
  name            = "mysql"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.mysql.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs_tasks_sg.id]
    assign_public_ip = false
  }
  service_registries {
    registry_arn = aws_service_discovery_service.mysql.arn
  }
}

#MONGODB
resource "aws_ecs_service" "mongodb" {
  name            = "mongodb"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.mongodb.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs_tasks_sg.id]
    assign_public_ip = false
  }
  service_registries {
    registry_arn = aws_service_discovery_service.mongodb.arn
  }
}

#RABBITMQ
resource "aws_ecs_service" "rabbitmq" {
  name            = "rabbitmq"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.rabbitmq.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs_tasks_sg.id]
    assign_public_ip = false
  }
  service_registries {
    registry_arn = aws_service_discovery_service.rabbitmq.arn
  }
}

#KEYCLOAK-POSTGRES
resource "aws_ecs_service" "keycloak_postgres" {
  name            = "keycloak-postgres"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.keycloak_postgres.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs_tasks_sg.id]
    assign_public_ip = false
  }
  service_registries {
    registry_arn = aws_service_discovery_service.keycloak_postgres.arn
  }
}

#KEYCLOAK
resource "aws_ecs_service" "keycloak" {
  name            = "keycloak"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.keycloak.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs_tasks_sg.id]
    assign_public_ip = false
  }
  service_registries {
    registry_arn = aws_service_discovery_service.keycloak.arn
  }

  depends_on = [
    aws_ecs_service.keycloak_postgres
  ]
}
