terraform {
  backend "s3" {
    region  = "us-east-2"
    bucket  = "tlo-terraform-state"
    key     = "iam-user-s3-service.terraformstate"
    profile = "nongdan.dev-tlo"
  }
}

provider "aws" {
  region                   = "us-east-2"
  profile                  = "nongdan.dev-tlo"
  shared_credentials_files = ["~/.aws/credentials"]
}

resource "aws_iam_user" "aws_iam_user" {
  name = "s3-service"
#  path = "/system/"

  tags = {
    Terraform = "true"
    Environment = "all"
    Creator = "nongdan.dev"
    Name = "s3-service"
  }
}




resource "aws_iam_user_policy" "aws_iam_user_ro" {
  name   = "s3-service"
  user   = aws_iam_user.aws_iam_user.name
  policy = file("policy.json")
}

resource "aws_iam_access_key" "aws_iam_access_key" {
  user = aws_iam_user.aws_iam_user.name
}

output "secret" {
  value = aws_iam_access_key.aws_iam_access_key.secret
  sensitive   = true
}