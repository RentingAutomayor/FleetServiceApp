import { BillStateDto } from "./BillStateDTO";

export class BillDTO {
  STATE: BillStateDto;
  CODE: string;
  trx_id : number;
  value : number
  BILL_ID: number[];

}
