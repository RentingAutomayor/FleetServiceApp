import { Client } from './Client';
import { ContractState } from './ContractState';
import { Dealer } from './Dealer';
import { DiscountType } from './DiscountType';
import { Vehicle } from './Vehicle';
import { VehicleModel } from './VehicleModel';

export class Contract{
    public  id:number;
    public  consecutive:number;
    public  code:string;
    public  name:string;
    public  observation:string;
    public  dealer: Dealer;
    public  client: Client;
    public  contractState: ContractState;
    public  discountType: DiscountType;
    public  discountValue:number;
    public  amountOfMaintenances:number;
    public  amountVehicles: number;
    public  startingDate: Date;
    public  endingDate: Date;
    public  duration:number;
    public  state: boolean;
    public  lsVehicleModels: VehicleModel[];
    public  lsVehicles: Vehicle[];
    public  registrationDate: Date;
}