import { Basic } from '../../user/models/basic'

export interface Table {
  columns: string[]
  rows?: Basic[]
}
