output "alb_dns_name" {
  value = aws_lb.alb.dns_name
}
output "frontend_url" {
  description = "The URL for accessing the frontend over HTTPS"
  value       = "https://${data.aws_route53_zone.main.name}"
}
output "keycloak_url" {
  description = "The URL for accessing Keycloak over HTTPS"
  value       = "https://auth.${data.aws_route53_zone.main.name}"
}



