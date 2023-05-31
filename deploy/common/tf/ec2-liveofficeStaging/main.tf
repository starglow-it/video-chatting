terraform {
  backend "s3" {
    region  = "us-east-2"
    bucket  = "tlo-terraform-state"
    key     = "ec2-liveofficeStaging.terraformstate"
    profile = "nongdan.dev-tlo"
  }
}

provider "aws" {
  region                  = "us-east-2"
  profile                 = "nongdan.dev-tlo"
  shared_credentials_files = ["~/.aws/credentials"]
}


data "aws_vpc" "vpc" {
  filter {
    name = "tag:Name"
    values = [
      "tlo"]
  }
}

data "aws_subnet" "subnet" {
  filter {
    name = "tag:Name"
    values = [
      "tlo-public-us-east-2b"]
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
  name = "liveofficeStaging-sg"
  description = "sg for liveofficeStaging ec2"
  vpc_id = "${data.aws_vpc.vpc.id}"

  tags = {
    Name = "liveofficeStaging-sg"
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
  to_port = 7882
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
  protocol = "udp"
  cidr_blocks = [
    "0.0.0.0/0"]
  security_group_id = "${aws_security_group.sg.id}"
}

resource "aws_security_group_rule" "ingress-06-sgr" {
  description = "allow portainer port"
  type = "ingress"
  from_port = 9443
  to_port = 9443
  protocol = "tcp"
  cidr_blocks = [
    "0.0.0.0/0"]
  security_group_id = "${aws_security_group.sg.id}"
}

resource "aws_security_group_rule" "ingress-07-sgr" {
  description = "allow icmp"
  type = "ingress"
  from_port = -1
  to_port = -1
  protocol = "icmp"
  cidr_blocks = [
    "0.0.0.0/0"]
  security_group_id = "${aws_security_group.sg.id}"
}

resource "aws_security_group_rule" "ingress-08-sgr" {
  description = "allow all from internal"
  type = "ingress"
  from_port = 0
  to_port = 0
  protocol = "-1"
  cidr_blocks = [
    "10.0.0.0/8"]
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
  private_ip = "10.0.253.23"
  key_name = "nongdan.dev"
  root_block_device {
    delete_on_termination = true
    volume_size = "100"
    volume_type = "gp2"
  }

  user_data_replace_on_change = true
  lifecycle {
    ignore_changes = [security_groups, ami]
  }
  credit_specification {
    cpu_credits = "standard"
  }

  user_data = <<EOF
#!/bin/bash
echo "Changing Hostname"
hostname "liveofficeStaging"
echo "liveofficeStaging" > /etc/hostname
EOF

  volume_tags ={
    Terraform = "true"
    Environment = "staging"
    Creator = "nongdan.dev"
  }

  tags = {
    Terraform = "true"
    Environment = "staging"
    Creator = "nongdan.dev"
    Name = "liveofficeStaging"
  }
}
// ========================================================================

resource "aws_eip" "aws_eip" {
  instance = "${aws_instance.instance.id}"
  vpc = true
}
