import { inherits } from 'util';
import { Branch } from './Branch';
import { Person } from './Person';

export class Contact extends Person{
    public branch: Branch;
    public Client_id:number;
    public Dealer_id:number;
}