import { Company } from "./company";

export interface User{
    id?: number,
    name?: string,
    lastName?: string,
    password?: string,
    email?: string,
    company?: Company
    roleId?: number,
    status: string
}