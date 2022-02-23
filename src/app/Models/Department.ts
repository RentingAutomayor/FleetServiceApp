export class Department {
  id: number
  name: string
  state: boolean
  countryId: number

  constructor(id: number, name: string, countryId: number) {
    this.id = id
    this.name = name
    this.countryId = countryId
  }
}
