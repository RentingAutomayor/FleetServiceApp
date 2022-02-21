
import { Branch } from './Branch';
import { Contact } from './Contact';
import { Person } from './Person';

export interface Dealer extends Omit<Person, 'lastname' | 'jobTitle'>{
  contacts?: Contact[];
  branches?: Branch[];
}


export interface DealerDTO extends Partial<Dealer>{
  contacts: Contact[];
  branches: Branch[];
}
