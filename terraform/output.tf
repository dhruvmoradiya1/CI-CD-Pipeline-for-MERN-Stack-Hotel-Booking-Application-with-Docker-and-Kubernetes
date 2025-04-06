output "jenkins_public_ip" {
  description = "Public IP address of the Jenkins server"
  value       = aws_instance.jenkins_server.public_ip
}

output "sonarqube_public_ip" {
  description = "Public IP address of the SonarQube server"
  value       = aws_instance.sonarqube_server.public_ip
}