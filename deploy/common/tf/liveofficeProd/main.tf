terraform {
  backend "s3" {
    region  = "ap-southeast-1"
    bucket  = "dcu9375-terraform-state"
    key     = "nongdan.dev-liveofficeProd.terraformstate"
    profile = "dcu9375"
  }
}

provider "aws" {
  region                  = "us-east-2"
  profile                 = "dcu9375"
  shared_credentials_files = ["~/.aws/credentials"]
}


data "aws_vpc" "vpc" {
  filter {
    name = "tag:Name"
    values = [
      "tlo-vpc"]
  }
}

data "aws_subnet" "subnet" {
  filter {
    name = "tag:Name"
    values = [
      "tlo-vpc-public-us-east-2b"]
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

// ========================================================================

resource "aws_security_group" "sg" {
  name = "liveofficeProd-sg"
  description = "sg for liveofficeProd ec2"
  vpc_id = "${data.aws_vpc.vpc.id}"

  tags = {
    Name = "liveofficeProd-sg"
  }
}

resource "aws_security_group_rule" "egress-sgr" {
  type = "egress"
  to_port = 0
  protocol = "-1"
  cidr_blocks = [
    "0.0.0.0/0"]
  from_port = 0
  security_group_id = "${aws_security_group.sg.id}"
}

resource "aws_security_group_rule" "ingress-01-sgr" {
  description = "allow ssh"
  type = "ingress"
  from_port = 22
  to_port = 22
  protocol = "tcp"
  cidr_blocks = [
    "0.0.0.0/0"]
  security_group_id = "${aws_security_group.sg.id}"
}

resource "aws_security_group_rule" "ingress-02-sgr" {
  description = "allow http"
  type = "ingress"
  from_port = 80
  to_port = 80
  protocol = "tcp"
  cidr_blocks = [
    "0.0.0.0/0"]
  security_group_id = "${aws_security_group.sg.id}"
}

resource "aws_security_group_rule" "ingress-03-sgr" {
  description = "allow http"
  type = "ingress"
  from_port = 443
  to_port = 443
  protocol = "tcp"
  cidr_blocks = [
    "0.0.0.0/0"]
  security_group_id = "${aws_security_group.sg.id}"
}

resource "aws_security_group_rule" "ingress-04-sgr" {
  description = "allow services-livekit-service"
  type = "ingress"
  from_port = 7880
  to_port = 7880
  protocol = "tcp"
  cidr_blocks = [
    "0.0.0.0/0"]
  security_group_id = "${aws_security_group.sg.id}"
}

resource "aws_security_group_rule" "ingress-05-sgr" {
  description = "allow services-livekit-service"
  type = "ingress"
  from_port = 7880
  to_port = 7882
  protocol = "all"
  cidr_blocks = [
    "0.0.0.0/0"]
  security_group_id = "${aws_security_group.sg.id}"
}

resource "aws_security_group_rule" "ingress-06-sgr" {
  description = "allow portainer port"
  type = "ingress"
  from_port = 9443
  to_port = 9443
  protocol = "all"
  cidr_blocks = [
    "0.0.0.0/0"]
  security_group_id = "${aws_security_group.sg.id}"
}



// ========================================================================


resource "aws_instance" "instance" {
  // ubuntu
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3a.large"
  security_groups = [
    "${aws_security_group.sg.id}"]
  subnet_id = "${data.aws_subnet.subnet.id}"
  private_ip = "10.0.253.21"
  key_name = "nongdan.dev-keypair"
  root_block_device {
    delete_on_termination = true
    volume_size = "50"
    volume_type = "gp2"
  }

  volume_tags ={
    Terraform = "true"
    Environment = "production"
    Creator = "nongdan.dev"
  }

  tags = {
    Terraform = "true"
    Environment = "production"
    Creator = "nongdan.dev"
    Name = "liveofficeProd"
  }
}
// ========================================================================

resource "aws_eip" "aws_eip" {
  instance = "${aws_instance.instance.id}"
  vpc = true
}
