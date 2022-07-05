import { BillStateDto } from "./BillStateDTO";
import { OrderWork } from "./OrderWork";

export class Bill{
  public bill_id :	number;
  public bill_consecutive	:number;
  public bill_code:  string;
  public bill_value:	number;
  public billst_id:	number;
  public bill_status: boolean;
  public bill_registrationDate: Date	;
  public bill_updateDate: Date;
  public bill_deleteDate : Date;
  public name_client? : string;
  public BillStateDto : BillStateDto;
  public isChecked : boolean = false;
  public orderWordk : OrderWork;
}

