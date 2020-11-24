import { Brand } from './Brand';
import { VehicleType } from './VehicleType';

export class VehicleModel{
    public id: number;
    public shortName:string;
    public longName:string;
    public state: boolean;
    public registrationDate: Date;
    public brand: Brand;
    public type: VehicleType;
}