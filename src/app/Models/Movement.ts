import { MovementType } from './MovementType';

export class Movement{
    public id: number;
    public name: string;
    public description: string; 
    public type: MovementType;
    public state: boolean;
    public registrationDate: Date;
}


export enum Movements{
    CREACION_DE_CUPO = 1,
    ADICION_DE_CUPO = 2,
    CANCELACION_DE_CUPO = 3,
    ORDEN_DE_TRABAJO = 4,
    APROBACION_DE_ORDEN_DE_TRABAJO = 5,
    CANCELACION_DE_ORDEN_DE_TRABAJO = 6,
    LIBERACION_DE_CUPO = 7
}