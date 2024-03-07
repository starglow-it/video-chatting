terraform {
  backend "s3" {
    region  = "us-east-2"
    bucket  = "tlo-terraform-state"
    key     = "route53-chatruume-com.terraformstate"
    profile = "nongdan.dev-tlo"
  }
}

provider "aws" {
  region                   = "us-east-2"
  profile                  = "nongdan.dev-tlo"
  shared_credentials_files = ["~/.aws/credentials"]
}

data "aws_route53_zone" "main" {
  name         = "chatruume.com"
}

resource "aws_route53_record" "prod" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "prod.chatruume.com"
  type    = "A"
  ttl     = 86400
  records = ["18.118.59.1"]
}

resource "aws_route53_record" "my" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "my.chatruume.com"
  type    = "A"

  alias {
    name                   = aws_route53_record.prod.name
    zone_id                = data.aws_route53_zone.main.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "tf" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "tf.chatruume.com"
  type    = "A"

  alias {
    name                   = aws_route53_record.prod.name
    zone_id                = data.aws_route53_zone.main.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "admin" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "admin.chatruume.com"
  type    = "A"

  alias {
    name                   = aws_route53_record.prod.name
    zone_id                = data.aws_route53_zone.main.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "socket" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "socket.chatruume.com"
  type    = "A"

  alias {
    name                   = aws_route53_record.prod.name
    zone_id                = data.aws_route53_zone.main.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "livekit" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "livekit.chatruume.com"
  type    = "A"

  alias {
    name                   = aws_route53_record.prod.name
    zone_id                = data.aws_route53_zone.main.zone_id
    evaluate_target_health = true
  }
}

# ========================= STAGING =====================================
resource "aws_route53_record" "stg" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "stg.chatruume.com"
  type    = "A"
  ttl     = 86400
  records = ["3.129.50.243"]
}

resource "aws_route53_record" "stg-my" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "stg-my.chatruume.com"
  type    = "A"

  alias {
    name                   = aws_route53_record.stg.name
    zone_id                = data.aws_route53_zone.main.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "stg-admin" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "stg-admin.chatruume.com"
  type    = "A"

  alias {
    name                   = aws_route53_record.stg.name
    zone_id                = data.aws_route53_zone.main.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "stg-socket" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "stg-socket.chatruume.com"
  type    = "A"

  alias {
    name                   = aws_route53_record.stg.name
    zone_id                = data.aws_route53_zone.main.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "stg-livekit" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "stg-livekit.chatruume.com"
  type    = "A"

  alias {
    name                   = aws_route53_record.stg.name
    zone_id                = data.aws_route53_zone.main.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "txt-record" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "chatruume.com"
  type    = "TXT"
  ttl     = 86400
  records = ["v=spf1 include:spf.mandrillapp.com ?all"]
}

resource "aws_route53_record" "mandrill" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "mandrill._domainkey.chatruume.com"
  type    = "TXT"
  ttl     = 86400
  records = ["v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCrLHiExVd55zd/IQ/J/mRwSRMAocV/hMB3jXwaHH36d9NaVynQFYV8NaWi69c1veUtRzGt7yAioXqLj7Z4TeEUoOLgrKsn8YnckGs9i3B3tVFB+Ch/4mPhXWiNfNdynHWBcPcbJ8kjEQ2U8y78dHZj1YeRXXVvWob2OaKynO8/lQIDAQAB;"]
}

resource "aws_route53_record" "turn" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "turn.chatruume.com"
  type    = "A"
  ttl     = 86400
  records = ["3.139.207.115"]
}

resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "www.chatruume.com"
  type    = "A"
  ttl     = 300
  records = ["5.181.161.73"]
}

resource "aws_route53_record" "star-stg" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "*.stg.chatruume.com"
  type    = "A"
  alias {
    name                   = aws_route53_record.stg.name
    zone_id                = data.aws_route53_zone.main.zone_id
    evaluate_target_health = true
  }
}


resource "aws_route53_record" "star" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "*.chatruume.com"
  type    = "A"
  alias {
    name                   = aws_route53_record.prod.name
    zone_id                = data.aws_route53_zone.main.zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "stg-traefik" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "stg-traefik.chatruume.com"
  type    = "A"
  alias {
    name                   = aws_route53_record.stg.name
    zone_id                = data.aws_route53_zone.main.zone_id
    evaluate_target_health = true
  }
}
