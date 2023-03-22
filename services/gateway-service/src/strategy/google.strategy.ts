import { Injectable, OnModuleInit } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { AUTH_SCOPE } from "shared-const";
import { IConfig } from "shared-types";
import { ConfigClientService } from '../services/config/config.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google'){

  constructor(private readonly configService: IConfig) {

    super({
      clientID: configService['googleClientId'],
      clientSecret: configService['googleSecret'],
      callbackURL: `http://localhost:3000/api/${AUTH_SCOPE}google-redirect`,
      scope: ['email', 'profile'],
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;
    console.log(profile);
    
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken
    }
    done(null, user);
  }
}