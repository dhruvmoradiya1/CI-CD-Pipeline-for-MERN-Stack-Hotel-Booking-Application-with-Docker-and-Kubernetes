data "aws_ami" "os_id" {
  most_recent = true
  owners = ["099720109477"]

  filter {
    name = "state"
    values = ["available"]
  }
  filter {
    name   = "name"
    values = ["ubuntu/images/*"]
  }
# to find specific version of ami
  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
} 

resource "aws_key_pair" "my-devops-key" {
    key_name = var.aws_key_pair
    public_key = file("devops-key.pub")
}

resource "aws_default_vpc" "default" {

}

resource "aws_security_group" "my_sg_s3" {
    name = "new_sg_plus_s3"
    description = "Allow inbound traffic on port 22, port 80 and port 443"
    vpc_id = aws_default_vpc.default.id # interpolation

    ingress {
        description = "allow access to ssh and port 22"
        from_port = 22
        to_port = 22
        protocol = var.aws_protocol
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        description = "allow access to http and port 80"
        from_port = 80
        to_port = 80
        protocol = var.aws_protocol
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        description = "allow access to https and port 443"
        from_port = 443
        to_port = 443
        protocol = var.aws_protocol
        cidr_blocks = ["0.0.0.0/0"]
    }      

    ingress {
        description = "allow access to jenkins and port 8080"
        from_port = 8080
        to_port = 8080
        protocol = var.aws_protocol
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        description = "allow access to sonarqube and port 9000"
        from_port = 9000
        to_port = 9000
        protocol = var.aws_protocol
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        description = "allow all traffic out"
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
      Name = "new_sg_plus"
    }
}


resource "aws_instance" "jenkins_server" {
    ami = data.aws_ami.os_id.id
    key_name = aws_key_pair.my-devops-key.key_name
    security_groups = [aws_security_group.my_sg_s3.name]
    instance_type = var.instance_type

    root_block_device {
        volume_size = var.aws_block_size
        volume_type = "gp3"
    }

    user_data = file("install.sh")

    tags = {
      Name = "jenkins-server"
    }
}

resource "aws_instance" "sonarqube_server" {
  ami                  = data.aws_ami.os_id.id
  instance_type        = var.aws_sonar_type
  key_name             = aws_key_pair.my-devops-key.key_name
  security_groups      = [aws_security_group.my_sg_s3.name]

  root_block_device {
    volume_size = var.aws_block_size
    volume_type = "gp3"
  }

  user_data = file("sonar.sh")

  tags = {
    Name = "sonarqube-server"
  }
}
