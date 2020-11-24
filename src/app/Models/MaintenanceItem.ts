import { Category } from './Category';
import { PresentationUnit } from './PresentationUnit';
import { TypeOfMaintenanceItem } from './TypeOfMaintenanceItem';
import { VehicleModel } from './VehicleModel';
import { VehicleType } from './VehicleType';

export class MaintenanceItem {
    public id: number;
    public code: string;
    public name: string;
    public description: string;
    public type: TypeOfMaintenanceItem;
    public presentationUnit: PresentationUnit;
    public category: Category;
    public lsVehicleType: VehicleType[];
    public lsVehicleModel: VehicleModel[];
    public referencePrice: number;
    public amount:number;
    public state: boolean;
    public registrationDate: Date;
}