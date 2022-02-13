import { Person } from './Person';
import { ContractualInformation } from './ContractualInformation';
import { City } from './City';
import { JobTitle } from './JobTitle';
import { Contact } from './Contact';

export interface Client extends Person, ClientComplement{

}

export interface ClientComplement {
  contacts: Contact[];
  contractualInformation?: ContractualInformation
}
