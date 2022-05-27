
import { CreateContactDTO } from './Contact';
import { ContactType } from './ContactType';

export class ContactWithTypeDTO{
  contact : CreateContactDTO
  contactType : ContactType[]
}
