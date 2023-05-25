terraform {
  backend "s3" {
    region  = "us-east-2"
    bucket  = "tlo-terraform-state"
    key     = "s3-theliveoffice-dev.terraformstate"
    profile = "nongdan.dev-tlo"
  }
}

provider "aws" {
  region                   = "us-east-2"
  profile                  = "nongdan.dev-tlo"
  shared_credentials_files = ["~/.aws/credentials"]
}

resource "aws_s3_bucket" "aws_s3_bucket" {
  bucket = "theliveoffice-dev"

  tags = {
    Terraform   = "true"
    Environment = "dev"
    Creator     = "nongdan.dev"
    Name        = "theliveoffice-dev"
  }
}

resource "aws_s3_bucket_public_access_block" "aws_s3_bucket" {
  bucket = aws_s3_bucket.aws_s3_bucket.id

  block_public_acls       = false
  block_public_policy     = false
#  ignore_public_acls      = false
#  restrict_public_buckets = false
}