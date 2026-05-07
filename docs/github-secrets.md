# GitHub Repository Secrets

The following secrets must be configured in your GitHub repository for the CI/CD pipelines to work.

## Required Secrets

| Secret Name          | Description                                    |
|----------------------|------------------------------------------------|
| DOCKERHUB_USERNAME   | Your Docker Hub username                       |
| DOCKERHUB_TOKEN      | Docker Hub access token (not your password)    |

## How to Add Secrets

1. Go to your GitHub repo
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret above
    