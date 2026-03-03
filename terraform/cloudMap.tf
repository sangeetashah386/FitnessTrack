resource "aws_service_discovery_private_dns_namespace" "fittrack" {
  name        = "fittrack.local"
  description = "Service discovery namespace for FitTrack microservices"
  vpc         = data.aws_vpc.main.id
}

