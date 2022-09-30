variable "livekit_api_key" {
  type    = string
  default = "apikey"
}

variable "livekit_api_secret" {
  type    = string
  default = "apisecret"
}

variable "environment" {
  type    = string
  default = "instance"
}

variable "livekit_host" {
  type    = string
  default = "http://localhost:7880"
}

variable "default_server_ip" {
  type    = string
  default = ""
}

variable "rabbit_mq_core_port" {
  type    = string
  default = "5672"
}

variable "install_docker" {
    type    = list(string)
    default = [
        "apt-get update",
        "apt-get -y install apt-transport-https ca-certificates curl gnupg lsb-release",
        "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg",
        "echo  \"deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable\" | tee /etc/apt/sources.list.d/docker.list > /dev/null",
        "apt-get -y update",
        "apt-get install -y docker-ce docker-ce-cli containerd.io",
    ]
}

variable "install_docker_compose" {
    type    = list(string)
    default = [
        "curl -L \"https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)\" -o /usr/local/bin/docker-compose",
        "chmod +x /usr/local/bin/docker-compose",
        "ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose",
    ]
}

variable "vultr_api_key" {
  type      = string
  default   = "${env("VULTR_API_KEY")}"
  sensitive = true
}

packer {
  required_plugins {
    vultr = {
      version = ">=v2.3.2"
      source = "github.com/vultr/vultr"
    }
  }
}

source "vultr" "ubuntu-20" {
  api_key              = "${var.vultr_api_key}"
  os_id                = "387"
  plan_id              = "vhf-2c-4gb"
  region_id            = "yto"
  snapshot_description = "Instance for rooms"
  ssh_username         = "root"
  state_timeout        = "25m"
}

build {
  sources = ["source.vultr.ubuntu-20"]

  provisioner "shell" {
      inline = flatten([
          "echo Installing Docker;",
          var.install_docker,
          "echo Docker installed;",
          "echo Installing docker-compose;",
          var.install_docker_compose,
          "echo docker-compose installed;"
      ])
  }

  provisioner "file" {
    source      = "../../services"
    destination = "/tmp/services"
  }

  provisioner "file" {
    source      = "../../deploy"
    destination = "/tmp/deploy"
  }

  provisioner "shell" {
    inline = flatten([
      "sudo mv /tmp /app",
      "cd /app",
      "export RABBIT_MQ_CORE_PORT=${var.rabbit_mq_core_port}",
      "export ENVIRONMENT=${var.environment}",
      "export LIVEKIT_API_KEY=${var.livekit_api_key}",
      "export LIVEKIT_API_SECRET=${var.livekit_api_secret}",
      "export LIVEKIT_HOST=${var.livekit_host}",
      "export DEFAULT_SERVER_IP=${var.default_server_ip}",
      "printenv",
      "cd deploy/instance && sudo -E docker-compose -f docker-compose.yml -f docker-compose.instance.yml up -d --build"
    ])
  }

  post-processor "manifest" {
    output = "${path.root}/manifest.json"
  }
}
