import { OrderWorkState } from "./orderWorkState";

export class OrderWork{
    public trx_id: number;
    public trx_code : string;
    public cli_name : string;
    public veh_licensePlate : string;
    public deal_name : string;
    public trx_registrationDate: Date;
    public trx_value : number;
    public trxst_id : number;
    public trxst_name : string;
    public bill_id : number;
    public trx_updateDate : Date;
    public order_state : OrderWorkState;
    public trx_bill_status : boolean;
    public iva : number;
    public beforeiva : number;
    public isChecked: boolean = false;
}
