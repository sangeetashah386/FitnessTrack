data "aws_vpc" "main"{
  id = "vpc-0b66bf78a4de4cef8"
}
data "aws_internet_gateway" "igw" {
  filter {
    name   = "internet-gateway-id"
    values = ["igw-01236e8e39999797c"]
  }
}


//data "aws_internet_gateway" "igw" {
//  id = "igw-01236e8e39999797c"
//}

data "aws_subnet" "public_1" {
  id = "subnet-0c573f53a6ed82431"
}

data "aws_subnet" "public_2" {
  id = "subnet-0709273464b82b93f"
}

data "aws_subnet" "private_1" {
  id = "subnet-02eb115cd1dc79692"
}

data "aws_subnet" "private_2" {
  id = "subnet-0419fdffd31959abd"
}

data "aws_route_table" "public" {
  filter {
    name   = "route-table-id"
    values = ["rtb-0cc568216752ff2d5"]
  }
}

data "aws_route_table" "private" {
  filter {
    name   = "route-table-id"
    values = ["rtb-0838c91227325e40c"]
  }
}

resource "aws_eip" "nat" {
  domain = "vpc"
  tags   = { Name = "${var.project_name}-nat-eip" }
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = data.aws_subnet.public_1.id
  depends_on    = [data.aws_internet_gateway.igw]
  tags          = { Name = "${var.project_name}-nat" }
}

resource "aws_route" "private_nat_route" {
  route_table_id         = data.aws_route_table.private.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.nat.id
}

