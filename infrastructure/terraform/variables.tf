variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "devpulse"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["ap-south-1a", "ap-south-1b"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "eks_cluster_version" {
  description = "Kubernetes version for EKS"
  type        = string
  default     = "1.32"
}

variable "eks_node_instance_type" {
  description = "Instance type for EKS worker nodes"
  type        = string
  default     = "t3.small"
}

variable "eks_node_min_size" {
  description = "Minimum size of the node group"
  type        = number
  default     = 1
}

variable "eks_node_max_size" {
  description = "Maximum size of the node group"
  type        = number
  default     = 2
}

variable "eks_node_desired_size" {
  description = "Desired size of the node group"
  type        = number
  default     = 1
}
