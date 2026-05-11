# Jenkins Configuration for NexStore E-Commerce Platform

## Jenkins Pipeline Setup

### Prerequisites

1. Jenkins installed with Pipeline plugin
2. Git plugin configured
3. Docker available on Jenkins agent
4. Kubernetes CLI (kubectl) installed
5. Access to container registry (GHCR, Docker Hub, or private registry)
6. Access to Kubernetes cluster

### Credentials Setup

In Jenkins, add the following credentials:

1. **GitHub Registry Credentials** (Type: Username with password)
   - ID: `github-pat-credentials-id`
   - Username: Your GitHub username
   - Password: GitHub Personal Access Token (with `write:packages` scope)

2. **Kubernetes Config** (Type: Secret file)
   - ID: `kubeconfig-credentials-id`
   - File: Your kubeconfig file

3. **Slack Webhook** (Optional - Type: Secret text)
   - ID: `slack-webhook`
   - Secret: Your Slack webhook URL

### Pipeline Files

Two pipeline versions are provided:

1. **`jenkins-pipeline-declarative.groovy`** - Recommended for most use cases
   - Declarative syntax (cleaner, more structured)
   - Built-in error handling
   - Easier to maintain

2. **`jenkins-pipeline-scripted.groovy`** - Alternative for complex pipelines
   - Scripted syntax (more flexible)
   - Better for complex conditional logic

### Jenkins Pipeline Options

**Option 1: Use existing pipeline**

1. Create a new Jenkins Pipeline job
2. Point to your Git repository
3. Use `jenkins-pipeline-declarative.groovy` as the Pipeline script

**Option 2: Checkout pipeline from repo**

```groovy
pipeline {
    agent any
    pipeline {
        pipeline {
    steps {
            checkout([$class: 'GitSCM', branches: [[name: '*/main']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'your-creds', url: 'https://github.com/your-org/your-repo.git']]])
        }
    }
}
```

### Environment Variables

Update these in the pipeline file or as Jenkins parameters:

| Variable        | Default                           | Description             |
| --------------- | --------------------------------- | ----------------------- |
| `REGISTRY`      | `ghcr.io`                         | Container registry URL  |
| `IMAGE_NAME`    | `nexstore/cloud-native-ecommerce` | Image name prefix       |
| `K8S_CLUSTER`   | `your-cluster-name`               | Kubernetes cluster name |
| `K8S_NAMESPACE` | `ecommerce`                       | Target namespace        |

### Deployment Environments

The pipeline supports multiple environments:

- `dev` - Development environment
- `staging` - Pre-production testing
- `prod` - Production deployment

Update the `K8S_NAMESPACE` or use separate Jenkins jobs per environment.

### Kubernetes Manifests

The pipeline expects the following structure:

```
infra/kubernetes/
├── 00-namespaces.yaml
├── 01-configmaps.yaml
├── 02-secrets.yaml
├── 03-postgres.yaml
├── 04-redis.yaml
├── 05-rabbitmq.yaml
├── 10-user-service.yaml
├── 11-product-service.yaml
├── 12-cart-service.yaml
├── 13-order-service.yaml
├── 14-payment-service.yaml
├── 15-notification-service.yaml
├── 16-api-gateway.yaml
├── 20-frontend.yaml
└── 31-hpa.yaml
```

### Recommended Jenkins Settings

```groovy
// Disable concurrent builds for stability
options {
    disableConcurrentBuilds()
}

// Set timeout to prevent hanging builds
options {
    timeout(time: 60, unit: 'MINUTES')
}
```

### Troubleshooting

**Build fails with permission errors:**

- Ensure Jenkins agent has Docker permissions
- Check registry credentials are correct

**Kubernetes deployment fails:**

- Verify kubeconfig has correct cluster access
- Check namespace exists: `kubectl get ns ecommerce`

**Image push fails:**

- Verify GitHub token has `write:packages` scope
- Check registry URL is correct

### Advanced Configuration

**Parallel builds for faster pipelines:**

```groovy
// Use multiple agents for parallel builds
agent {
    label 'docker && kubernetes'
}
```

**Custom image tags:**

```groovy
// Use Git tags for versioning
def VERSION = sh(script: 'git describe --tags', returnStdout: true).trim()
```

**Canary deployments:**

```groovy
// Update service to canary version first
sh 'kubectl apply -f infra/kubernetes/16-api-gateway-canary.yaml'
```
