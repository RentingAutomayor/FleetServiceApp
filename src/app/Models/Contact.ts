import { inherits } from 'util';
import { Branch } from './Branch';
import { City } from './City';
import { JobTitle } from './JobTitle';
import { Person } from './Person';

export class Contact implements Person{
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
    public branch: Branch;
    public Client_id:number;
    public Dealer_id:number;
}
