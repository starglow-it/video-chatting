terraform {
  backend "s3" {
    region  = "us-east-2"
    bucket  = "tlo-terraform-state"
    key     = "s3-theliveoffice-demo.terraformstate"
    profile = "nongdan.dev-tlo"
  }
}

provider "aws" {
  region                   = "us-east-2"
  profile                  = "nongdan.dev-tlo"
  shared_credentials_files = ["~/.aws/credentials"]
}

resource "aws_s3_bucket" "aws_s3_bucket" {
  bucket = "theliveoffice-demo"

  tags = {
    Terraform   = "true"
    Environment = "demo"
    Creator     = "nongdan.dev"
    Name        = "theliveoffice-demo"
  }
}

resource "aws_s3_bucket_public_access_block" "aws_s3_bucket" {
  bucket = aws_s3_bucket.aws_s3_bucket.id

  block_public_acls       = false
  block_public_policy     = false
#  ignore_public_acls      = false
#  restrict_public_buckets = false
}

resource "aws_s3_bucket_ownership_controls" "aws_s3_bucket_ownership_controls" {
  bucket = aws_s3_bucket.aws_s3_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}