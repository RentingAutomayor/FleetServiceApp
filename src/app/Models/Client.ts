import { Person } from './Person';
import { ContractualInformation } from './ContractualInformation';
import { Contact } from './Contact';
import { Branch } from './Branch';

export interface Client extends Person, ClientComplement{

}

export interface ClientComplement {
  contacts: Contact[];
  branchs: Branch[];
  contractualInformation?: ContractualInformation;
}
