[CmdletBinding()]
param(
    [switch]$CommitAndPush,
    [string]$CommitMessage = "Add screenshot placeholders"
)

$ErrorActionPreference = "Stop"

$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$ScreenshotsDir = Join-Path $RepoRoot "screenshots"

New-Item -ItemType Directory -Path $ScreenshotsDir -Force | Out-Null
$GitkeepPath = Join-Path $ScreenshotsDir ".gitkeep"
if (-not (Test-Path $GitkeepPath)) {
    New-Item -ItemType File -Path $GitkeepPath | Out-Null
}

$Screenshots = @(
    "eks-cluster.png",
    "eks-nodes.png",
    "ecr-repos.png",
    "kubectl-nodes.png",
    "kubectl-pods.png",
    "kubectl-svc.png",
    "helm-releases.png",
    "github-actions.png",
    "grafana-dashboard.png",
    "grafana-node.png",
    "prometheus-targets.png",
    "prometheus-query.png",
    "terraform-output.png",
    "docker-images.png",
    "project-structure.png",
    "docker-compose.png"
)

foreach ($Screenshot in $Screenshots) {
    $ScreenshotPath = Join-Path $ScreenshotsDir $Screenshot
    if (-not (Test-Path $ScreenshotPath)) {
        New-Item -ItemType File -Path $ScreenshotPath | Out-Null
    }
}

$Readme = @'
# Screenshots

This folder contains placeholder files for the project screenshots. Replace each empty `.png` file with a real screenshot using the exact same filename so README links and documentation stay stable.

| Filename | What it should show | Replacement instructions |
| --- | --- | --- |
| `eks-cluster.png` | AWS Console EKS cluster overview page | Capture the requested screen, export it as PNG, and replace `screenshots/eks-cluster.png` without changing the filename. |
| `eks-nodes.png` | AWS Console EKS nodes tab showing 2 running nodes | Capture the requested screen, export it as PNG, and replace `screenshots/eks-nodes.png` without changing the filename. |
| `ecr-repos.png` | AWS Console ECR showing all 3 repositories: auth, url, analytics | Capture the requested screen, export it as PNG, and replace `screenshots/ecr-repos.png` without changing the filename. |
| `kubectl-nodes.png` | Terminal output of `kubectl get nodes` showing 2 Ready nodes | Capture the requested terminal output, export it as PNG, and replace `screenshots/kubectl-nodes.png` without changing the filename. |
| `kubectl-pods.png` | Terminal output of `kubectl get pods -n devpulse` showing all services | Capture the requested terminal output, export it as PNG, and replace `screenshots/kubectl-pods.png` without changing the filename. |
| `kubectl-svc.png` | Terminal output of `kubectl get svc -n devpulse` | Capture the requested terminal output, export it as PNG, and replace `screenshots/kubectl-svc.png` without changing the filename. |
| `helm-releases.png` | Terminal output of `helm list -A` showing all releases | Capture the requested terminal output, export it as PNG, and replace `screenshots/helm-releases.png` without changing the filename. |
| `github-actions.png` | GitHub Actions tab showing successful CI/CD pipeline runs | Capture the requested screen, export it as PNG, and replace `screenshots/github-actions.png` without changing the filename. |
| `grafana-dashboard.png` | Grafana Kubernetes Compute Resources cluster dashboard | Capture the requested dashboard, export it as PNG, and replace `screenshots/grafana-dashboard.png` without changing the filename. |
| `grafana-node.png` | Grafana Node Exporter Full dashboard with CPU/memory graphs | Capture the requested dashboard, export it as PNG, and replace `screenshots/grafana-node.png` without changing the filename. |
| `prometheus-targets.png` | Prometheus Status > Targets page showing all scrape targets | Capture the requested page, export it as PNG, and replace `screenshots/prometheus-targets.png` without changing the filename. |
| `prometheus-query.png` | Prometheus Graph tab with a query result | Capture the requested page, export it as PNG, and replace `screenshots/prometheus-query.png` without changing the filename. |
| `terraform-output.png` | Terminal output of `terraform output` showing all values | Capture the requested terminal output, export it as PNG, and replace `screenshots/terraform-output.png` without changing the filename. |
| `docker-images.png` | Terminal output of `docker images` showing all 3 built images | Capture the requested terminal output, export it as PNG, and replace `screenshots/docker-images.png` without changing the filename. |
| `project-structure.png` | VS Code showing the full devpulse folder structure | Capture the requested VS Code view, export it as PNG, and replace `screenshots/project-structure.png` without changing the filename. |
| `docker-compose.png` | Terminal showing `docker-compose up` with all services running | Capture the requested terminal output, export it as PNG, and replace `screenshots/docker-compose.png` without changing the filename. |

## Windows PowerShell Commands

Run these commands from the repository root to create the screenshot folder, placeholder files, `.gitkeep`, and then commit and push the changes:

```powershell
.\scripts\create-screenshots.ps1 -CommitAndPush
```

To create or refresh only the local screenshot placeholders without committing:

```powershell
.\scripts\create-screenshots.ps1
```
'@

Set-Content -Path (Join-Path $ScreenshotsDir "README.md") -Value $Readme -Encoding utf8

Write-Host "Created screenshot placeholders in $ScreenshotsDir"

if ($CommitAndPush) {
    Push-Location $RepoRoot
    try {
        git add screenshots scripts/create-screenshots.ps1 scripts/create-screenshots.sh
        git commit -m $CommitMessage
        git push
    }
    finally {
        Pop-Location
    }
}
else {
    Write-Host ""
    Write-Host "To commit and push these files, run:"
    Write-Host "git add screenshots scripts/create-screenshots.ps1 scripts/create-screenshots.sh"
    Write-Host "git commit -m `"$CommitMessage`""
    Write-Host "git push"
}
