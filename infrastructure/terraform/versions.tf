terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }

  backend "s3" {
    bucket  = "devpulse-terraform-state-pranavmc"
    key     = "devpulse/terraform.tfstate"
    region  = "ap-south-1"
    encrypt = true
  }
}
