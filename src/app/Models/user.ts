import { Role } from "./role";

export interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    roles: string;
    image: string;
  }
  