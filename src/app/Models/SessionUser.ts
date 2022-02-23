export interface SessionUser {
  id_user: number
  name: string
  lastName: string
  company: Company
}

export interface Company {
  id: number
  type: number
}
