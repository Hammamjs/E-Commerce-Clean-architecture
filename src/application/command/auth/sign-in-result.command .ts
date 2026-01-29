import { User } from "src/domain/entities/user.entity";

export type SignInResult = {
 user: User;
 accessToken: string;
};