output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "eks_cluster_name" {
  description = "Name of the EKS cluster"
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  description = "Endpoint for the EKS cluster"
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_version" {
  description = "Kubernetes version of the EKS cluster"
  value       = module.eks.cluster_version
}

output "ecr_auth_service_url" {
  description = "Repository URL for the auth service"
  value       = module.ecr.auth_service_url
}

output "ecr_url_service_url" {
  description = "Repository URL for the URL service"
  value       = module.ecr.url_service_url
}

output "ecr_analytics_service_url" {
  description = "Repository URL for the analytics service"
  value       = module.ecr.analytics_service_url
}

output "configure_kubectl" {
  description = "Command to configure kubectl for the EKS cluster"
  value       = "aws eks update-kubeconfig --region ap-south-1 --name ${module.eks.cluster_name}"
}
