data "aws_route53_zone" "main" {
  name = "fitnesstrackapp.click"
}

resource "aws_route53_record" "keycloak" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "auth"  # subdomain for Keycloak
  type    = "A"

  alias {
    name                   = aws_lb.alb.dns_name  # your Keycloak ALB DNS
    zone_id                = aws_lb.alb.zone_id
    evaluate_target_health = true
  }
}
resource "aws_route53_record" "frontend" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "fitnesstrackapp.click"
  type    = "A"

  alias {
    name                   = aws_lb.alb.dns_name
    zone_id                = aws_lb.alb.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "api" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "api"  # api.fitnesstrackapp.click
  type    = "A"

  alias {
    name                   = aws_lb.alb.dns_name
    zone_id                = aws_lb.alb.zone_id
    evaluate_target_health = true
  }
}
