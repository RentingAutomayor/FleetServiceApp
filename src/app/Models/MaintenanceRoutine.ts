import { Frequency } from './Frequency';
import { MaintenanceItem } from './MaintenanceItem';
import { VehicleModel } from './VehicleModel';

export class MaintenanceRoutine{
    public id:number;
    public name:string;
    public descriptionstring;
    public vehicleModel: VehicleModel;
    public frequency: Frequency;
    public state:boolean;
    public referencePrice:number;
    public lsItems:  MaintenanceItem[];
    public registrationDate:Date;

}