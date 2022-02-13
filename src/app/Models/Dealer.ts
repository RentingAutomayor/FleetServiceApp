import { City } from './City';
import { JobTitle } from './JobTitle';
import { Person } from './Person';

export interface Dealer extends Omit<Person,'lastname' | 'jobTitle'>{
}
