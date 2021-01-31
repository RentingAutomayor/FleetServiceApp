import { Client } from './Client';
import { MaintenanceItem } from './MaintenanceItem';
import { Movement } from './Movement';
import { TransactionDetail } from './TransactionDetail';
import { TransactionObservation } from './TransactionObservation';
import { TransactionState } from './TransactionState';
import { User } from './User';

export class Transaction{
    public id: number;
    public consecutive: number;
    public code:string;
    public movement: Movement;
    public valueWithoutTaxes: number;
	public taxesValue: number;
    public value:number;
    public client: Client;
    public transactionState: TransactionState;
    public headerDetails: TransactionDetail;
    public lsItems: MaintenanceItem[];
    public lsObservations: TransactionObservation[];    
    //TODO change this for model of user
    public usu_id: number;
    public user: User;
    public state: boolean;
    public registrationDate: Date;
    public updateDate: Date;
}