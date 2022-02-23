export class ContractState {
  public id: number
  public name: string
  public description: string
  public state: boolean
  public registrationDate: Date
}

export enum ConstractStates {
  ACTIVO = 1,
  EN_NEGOCIACION = 2,
  CANCELADO = 3,
  FINALIZADO = 4,
}
