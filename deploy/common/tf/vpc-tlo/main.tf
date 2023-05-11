terraform {
  backend "s3" {
    region  = "us-east-2"
    bucket  = "tlo-terraform-state"
    key     = "vpc-tlo.terraformstate"
    profile = "nongdan.dev-tlo"
  }
}

provider "aws" {
  region                  = "us-east-2"
  profile                 = "nongdan.dev-tlo"
  shared_credentials_files = ["~/.aws/credentials"]
}


module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "tlo"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-2a", "us-east-2b", "us-east-2c"]
  private_subnets = ["10.0.0.0/20", "10.0.16.0/20", "10.0.32.0/20"]
  public_subnets  = ["10.0.252.0/24", "10.0.253.0/24", "10.0.254.0/24"]

  enable_dns_hostnames = true
  enable_dns_support   = true
  enable_nat_gateway = false
  enable_vpn_gateway = false

  tags = {
    Terraform = "true"
    Environment = "all"
    Creator = "nongdan.dev"
  }
}
