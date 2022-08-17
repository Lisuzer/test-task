import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true,
            secretOrKey: process.env.RT_SECRET,
        });
    }

    async validate(req: Request, payload: any) {
        const refreshToken = req.get('authorization').replace('Bearer', '').trim();
        return { id: payload.id, id_type: payload.id_type, refreshToken };
    }
}