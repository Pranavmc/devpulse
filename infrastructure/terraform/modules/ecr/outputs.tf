output "auth_service_url" {
  description = "Repository URL for the auth service"
  value       = aws_ecr_repository.auth_service.repository_url
}

output "url_service_url" {
  description = "Repository URL for the URL service"
  value       = aws_ecr_repository.url_service.repository_url
}

output "analytics_service_url" {
  description = "Repository URL for the analytics service"
  value       = aws_ecr_repository.analytics_service.repository_url
}
