resource "aws_ssm_parameter" "alb_dns" {
  name  = "/fittrack/alb_dns"
  type  = "String"
  value = aws_lb.alb.dns_name
}
