import { Basic } from '../../user/models/basic'

export interface Report extends Basic {
  method: string
  service: string
}
