variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "cluster_version" {
  description = "Kubernetes version for EKS"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "private_subnet_ids" {
  description = "IDs of the private subnets"
  type        = list(string)
}

variable "node_instance_type" {
  description = "Instance type for EKS worker nodes"
  type        = string
}

variable "node_min_size" {
  description = "Minimum size of the node group"
  type        = number
}

variable "node_max_size" {
  description = "Maximum size of the node group"
  type        = number
}

variable "node_desired_size" {
  description = "Desired size of the node group"
  type        = number
}

variable "tags" {
  description = "Common tags to apply to resources"
  type        = map(string)
}
