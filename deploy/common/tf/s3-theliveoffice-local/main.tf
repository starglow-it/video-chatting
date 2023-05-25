terraform {
  backend "s3" {
    region  = "us-east-2"
    bucket  = "tlo-terraform-state"
    key     = "s3-theliveoffice-local.terraformstate"
    profile = "nongdan.dev-tlo"
  }
}

provider "aws" {
  region                   = "us-east-2"
  profile                  = "nongdan.dev-tlo"
  shared_credentials_files = ["~/.aws/credentials"]
}

resource "aws_s3_bucket" "aws_s3_bucket" {
  bucket = "theliveoffice-local"

  tags = {
    Terraform   = "true"
    Environment = "local"
    Creator     = "nongdan.dev"
    Name        = "theliveoffice-local"
  }
}

resource "aws_s3_bucket_public_access_block" "aws_s3_bucket" {
  bucket = aws_s3_bucket.aws_s3_bucket.id

  block_public_acls       = false
  block_public_policy     = false
#  ignore_public_acls      = false
#  restrict_public_buckets = false
}