resource "aws_acm_certificate" "ssl_cert" {
  domain_name       = "fitnesstrackapp.click"
  validation_method = "DNS"

  subject_alternative_names = [
    "*.fitnesstrackapp.click"
  ]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "ssl_cert_dns" {
  allow_overwrite = true
  name            = tolist(aws_acm_certificate.ssl_cert.domain_validation_options)[0].resource_record_name
  records         = [tolist(aws_acm_certificate.ssl_cert.domain_validation_options)[0].resource_record_value]
  type            = tolist(aws_acm_certificate.ssl_cert.domain_validation_options)[0].resource_record_type
  zone_id         = data.aws_route53_zone.main.zone_id
  ttl             = 60
}

resource "aws_acm_certificate_validation" "ssl_cert_validation" {
  certificate_arn         = aws_acm_certificate.ssl_cert.arn
  validation_record_fqdns = [aws_route53_record.ssl_cert_dns.fqdn]
}


