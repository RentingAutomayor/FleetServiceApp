import { Injectable } from '@angular/core';
import { Person } from '../../../Models/Person';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private objPerson: Person;
  private personToUpdate: Person;
  constructor() { }

  setPerson(pPerson: Person){
    this.objPerson = pPerson;
  }

  getPerson(): Person{
    return this.objPerson;
  }

  setPersonToUpdate(pPerson: Person){
    this.personToUpdate = pPerson;
  }

  getPersonToUpdate(): Person{
    return this.personToUpdate;
  }
}
