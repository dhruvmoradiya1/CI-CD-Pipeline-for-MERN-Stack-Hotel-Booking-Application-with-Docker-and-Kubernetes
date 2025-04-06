variable "aws_region" {
  description = "The AWS region to deploy the resources in"
  default     = "ap-south-1"
}

variable "instance_type" {
  description = "The type of instance to create"
  default     = "t2.large"
}

variable "aws_protocol" {
  description = "The protocol to use for the security group"
  default     = "tcp"
}

variable "aws_instance_count" {
  description = "The number of instances to create"
  default     = 1
}

variable "aws_block_size" {
  description = "The size of the root block device in GB"
  default     = 25
}

variable "aws_key_pair" {
  description = "The name of the AWS key pair"
  default     = "devops-key"
}

variable "aws_sonar_type" {
  description = "value of sonarqube instance type"
  default     = "t2.medium"
}