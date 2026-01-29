import { User } from "src/domain/entities/user.entity";

export type SignUpResult = {
 user: User;
 accessToken: string;
};