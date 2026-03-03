# CONFIG-SERVER
resource "aws_service_discovery_service" "config_server" {
  name = "config-server"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.fittrack.id
    dns_records {
      type = "A"
      ttl = 10
    }
  }

  health_check_custom_config { failure_threshold = 1 }
}

# EUREKA-SERVER
resource "aws_service_discovery_service" "eureka_server" {
  name = "eureka-server"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.fittrack.id
    dns_records {
      type = "A"
      ttl = 10
    }
  }

  health_check_custom_config { failure_threshold = 1 }
}

# API-GATEWAY
resource "aws_service_discovery_service" "api_gateway" {
  name = "api-gateway"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.fittrack.id
    dns_records {
      type = "A"
      ttl = 10
    }
  }

  health_check_custom_config { failure_threshold = 1 }
}

# USER-SERVICE
resource "aws_service_discovery_service" "user_service" {
  name = "user-service"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.fittrack.id
    dns_records {
      type = "A"
      ttl = 10
    }
  }

  health_check_custom_config { failure_threshold = 1 }
}

# ACTIVITY-SERVICE
resource "aws_service_discovery_service" "activity_service" {
  name = "activity-service"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.fittrack.id
    dns_records {
      type = "A"
      ttl = 10
    }
  }

  health_check_custom_config { failure_threshold = 1 }
}

# NUTRITION-SERVICE
resource "aws_service_discovery_service" "nutrition_service" {
  name = "nutrition-service"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.fittrack.id
    dns_records {
      type = "A"
      ttl = 10
    }
  }

  health_check_custom_config { failure_threshold = 1 }
}

# RECOMMENDATION-SERVICE
resource "aws_service_discovery_service" "recommendation_service" {
  name = "recommendation-service"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.fittrack.id
    dns_records {
      type = "A"
      ttl = 10
    }
  }

  health_check_custom_config { failure_threshold = 1 }
}

# FRONTEND
resource "aws_service_discovery_service" "frontend" {
  name = "frontend"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.fittrack.id
    dns_records {
      type = "A"
      ttl = 10
    }
  }

  health_check_custom_config { failure_threshold = 1 }
}


# MONGODB
resource "aws_service_discovery_service" "mongodb" {
  name = "mongodb"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.fittrack.id
    dns_records {
      type = "A"
      ttl = 10
    }
  }

  health_check_custom_config { failure_threshold = 1 }
}

# RABBITMQ
resource "aws_service_discovery_service" "rabbitmq" {
  name = "rabbitmq"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.fittrack.id
    dns_records {
      type = "A"
      ttl = 10
    }
  }

  health_check_custom_config { failure_threshold = 1 }
}


# KEYCLOAK
resource "aws_service_discovery_service" "keycloak" {
  name = "keycloak"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.fittrack.id
    dns_records {
      type = "A"
      ttl = 10
    }
  }

  health_check_custom_config { failure_threshold = 1 }
}
