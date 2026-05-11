resource "aws_eks_cluster" "main" {
  name     = "${var.project_name}-cluster-${var.environment}"
  role_arn = var.cluster_role_arn
  version  = var.cluster_version

  vpc_config {
    subnet_ids = var.private_subnet_ids
  }
}

resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "${var.project_name}-node-group-${var.environment}"
  node_role_arn   = var.node_role_arn
  subnet_ids      = var.private_subnet_ids

  scaling_config {
    desired_size = 2
    max_size     = 4
    min_size     = 1
  }

  instance_types = ["t3.medium"]

  depends_on = [
    aws_eks_cluster.main
  ]
}

data "aws_eks_cluster_auth" "cluster" {
  name = aws_eks_cluster.main.name
}
