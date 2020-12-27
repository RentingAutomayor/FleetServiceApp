import { Branch } from './Branch';
import { Contract } from './Contract';
import { Dealer } from './Dealer';
import { MaintenanceRoutine } from './MaintenanceRoutine';
import { Transaction } from './Transaction';
import { Vehicle } from './Vehicle';

export class TransactionDetail {
    public id: Number;
    public vehicle: Vehicle;
    public dealer: Dealer;
    public branch: Branch;
    //This transaction rela
    public relatedTransaction: Transaction;
    public maintenanceRoutine: MaintenanceRoutine;
    public contract: Contract;
    //TODO: Change this for model of users
    //Maybe this can change because this informations is for transaction
    public userApprobation: Number;
    public userReject: Number;
    public userAnulation: Number;
    public approbationDate: Date;
    public rejectDate: Date;
    public anulationDate: Date;
}