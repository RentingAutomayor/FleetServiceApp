export interface Settings {
  domain?: string
  rows: Rows[]
  brandId?: number
  typeId?: number
}

export interface Rows {
  code: string
  name: string
  categoryId?: number
  unitId?: number
  typeId?: number
  price?: number
}
