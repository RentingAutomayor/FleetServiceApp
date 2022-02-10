import { City } from './City';
import { JobTitle } from './JobTitle';
import { Person } from './Person';

export class Dealer implements Person{
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

}
