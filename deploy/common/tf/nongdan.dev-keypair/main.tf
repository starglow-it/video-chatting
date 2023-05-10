terraform {
  backend "s3" {
    region  = "ap-southeast-1"
    bucket  = "dcu9375-terraform-state"
    key     = "nongdan.dev-keypair.terraformstate"
    profile = "dcu9375"
  }
}

provider "aws" {
  region                  = "us-east-2"
  profile                 = "dcu9375"
  shared_credentials_files = ["~/.aws/credentials"]
}


resource "aws_key_pair" "deployer" {
  key_name   = "nongdan.dev-keypair"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDBWWt3dhChoiaABCMQeV8QtKCtDsSyRGEl4NN1V8otpLwcxLCOen1MKLIAAgpmf/mVjF1ZN4Jjj5H2P0NWXbc/UyTQOzbZOoOt6Tm6mQreW6Sbg1tbiEWYK29oCCWC+hvVSNuRC2oo3P3k/Z9yyqfaznGsjQ4B5jmAfXo0HFU5h4cWnlPPU3WMPU9c3C/mg+KuD4DEOCK9xkou5EWfpYdR7qMNB+m8hIJyaiayPPJH2ZFFMn/qoCe1bwbwLThbHCsVQwYzicCaLDWbV4tu6sdqD1v15kZJb3x3QWiGmtxjif3RUqdyuwBMeUqFh6KGxisTKSVEHPr1nhWATedFrXdB nongdan.dev"
  tags = {
    Terraform = "true"
    Environment = "all"
    Creator = "nongdan.dev"
    Project = "tlo"
  }
}