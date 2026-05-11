# 🏗️ NexStore Infrastructure (Terraform)

This directory contains the Terraform configuration to provision the production-grade infrastructure for NexStore on AWS.

## 📂 Structure

```
terraform/
├── main.tf              # Root configuration (orchestrates modules)
├── variables.tf         # Global variables
├── outputs.tf           # Global outputs
├── providers.tf         # AWS & Kubernetes providers
└── modules/             # Reusable infrastructure modules
    ├── vpc/             # Networking (Subnets, NAT, IGW)
    ├── eks/             # Managed Kubernetes Cluster
    ├── iam/             # Roles & Policies
    ├── rds/             # PostgreSQL Database
    └── redis/           # ElastiCache Redis
```

## 🛠️ Prerequisites

- [Terraform](https://www.terraform.io/downloads.html) >= 1.5.0
- [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate permissions
- An AWS Account

## 🚀 Deployment

### 1. Initialize

```bash
terraform init
```

### 2. Configure Variables

Create a `terraform.tfvars` file:

```hcl
aws_region  = "us-east-1"
project_name = "nexstore"
environment  = "dev"
db_password  = "your-secure-password"
```

### 3. Plan

```bash
terraform plan
```

### 4. Apply

```bash
terraform apply
```

## 🔐 Security Best Practices

- **Private Subnets**: All sensitive resources (EKS nodes, RDS, Redis) are placed in private subnets.
- **NAT Gateway**: Outbound internet access for private resources is handled via NAT Gateway.
- **Security Groups**: Strict ingress/egress rules are defined for each component.
- **Sensitive Data**: Database passwords and other secrets are marked as sensitive.

## 🧹 Cleanup

To tear down the infrastructure:

```bash
terraform destroy
```
