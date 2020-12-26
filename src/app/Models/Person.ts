import { City } from './City';
import { JobTitle } from './JobTitle';

export class Person{
    public id:number;
    public document:string;
    public name:string;
    public lastname:string;
    public phone:string;
    public cellphone:string;
    public address:string;
    public email:string;
    public website:string;
    public city:City;
    public jobTitle:JobTitle;
    public state:boolean;
    public registrationDate:Date;

}