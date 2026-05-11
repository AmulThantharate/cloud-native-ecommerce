output "eks_cluster_role_arn" {
  value = aws_iam_role.eks_cluster.arn
  depends_on = [aws_iam_role_policy_attachment.eks_cluster_policy]
}

output "eks_node_role_arn" {
  value = aws_iam_role.eks_nodes.arn
  depends_on = [
    aws_iam_role_policy_attachment.worker_node_policy,
    aws_iam_role_policy_attachment.cni_policy,
    aws_iam_role_policy_attachment.registry_policy
  ]
}
