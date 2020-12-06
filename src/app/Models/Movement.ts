import { MovementType } from './MovementType';

export class Movement{
    public id: number;
    public name: string;
    public description: string; 
    public type: MovementType;
    public state: boolean;
    public registrationDate: Date;
}