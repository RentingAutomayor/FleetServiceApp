
import { Branch } from './Branch';
import { Person } from './Person';

export interface Contact extends Person{
    branch: Branch;
}

export interface CreateContactDTO extends Omit<Contact, 'id'>{
  Client_id?: number;
  Dealer_id?: number;
}

export interface UpdateContactDTO extends Partial<Contact>{
  Client_id: number;
  Dealer_id: number;
}
