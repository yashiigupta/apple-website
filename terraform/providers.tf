terraform {
  required_version = ">= 1.3"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "apple-website-520899053888-tfstate"
    key    = "terraform/state.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}
