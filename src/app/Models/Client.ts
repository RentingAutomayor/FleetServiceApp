import { Person } from './Person';
import { ContractualInformation } from './ContractualInformation';
import { City } from './City';
import { JobTitle } from './JobTitle';

export class Client implements Person{
    id: number;
    document: string;
    name: string;
    lastname: string;
    phone: string;
    cellphone: string;
    address: string;
    email: string;
    website: string;
    city: City;
    jobTitle: JobTitle;
    state: boolean;
    registrationDate: Date;
    public contractualInformation?: ContractualInformation
}
