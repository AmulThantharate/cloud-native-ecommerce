module "vpc" {
  source = "./modules/vpc"

  project_name = var.project_name
  environment  = var.environment
  vpc_cidr     = var.vpc_cidr
}

module "iam" {
  source = "./modules/iam"

  project_name = var.project_name
  environment  = var.environment
}

module "eks" {
  source = "./modules/eks"

  project_name        = var.project_name
  environment         = var.environment
  cluster_version     = var.eks_cluster_version
  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  node_role_arn       = module.iam.eks_node_role_arn
  cluster_role_arn    = module.iam.eks_cluster_role_arn
}

module "rds" {
  source = "./modules/rds"

  project_name        = var.project_name
  environment         = var.environment
  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  db_password         = var.db_password
  allowed_cidr_blocks = [var.vpc_cidr]
}

module "redis" {
  source = "./modules/redis"

  project_name        = var.project_name
  environment         = var.environment
  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  allowed_cidr_blocks = [var.vpc_cidr]
}

module "s3" {
  source = "./modules/s3"

  project_name = var.project_name
  environment  = var.environment
}
