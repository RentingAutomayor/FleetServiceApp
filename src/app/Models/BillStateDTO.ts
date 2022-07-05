export class BillStateDto{

  constructor(
    id: number,
  ){this.id = id}

  public id: Number
  public name?: string
  public description?: string
  public state?: Boolean
  public registrationDate?: Date
}
