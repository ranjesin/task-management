import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersRepository } from "./users.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { JwtPayLoad } from "./jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
    ) {
        super({
            secretOrKey: 'topSecret51',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload: JwtPayLoad): Promise<User> {
        const { username } = payload;
        const user: User = await this.usersRepository.findOne({ where: { username } });

        if(!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}