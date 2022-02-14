import { Person } from './Person';
import { ContractualInformation } from './ContractualInformation';
import { Contact } from './Contact';
import { Branch } from './Branch';
import { Vehicle } from './Vehicle';

export interface Client extends Person, ClientComplement{

}

export interface ClientComplement {
  contacts: Contact[];
  branchs: Branch[];
  vehicles: Vehicle[];
  contractualInformation?: ContractualInformation;
}
