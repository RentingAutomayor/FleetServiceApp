import { Company } from "./company";

export interface User{
    id?: number,
    name?: string,
    lastName?: string,
    userName?: string,
    password?: string,
    email?: string,
    company?: Company
    roleId?: number
}