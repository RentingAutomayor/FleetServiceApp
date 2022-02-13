import { User } from './User';

export class TransactionObservation{
    public id: Number;
    public description: string;
    // TODO: change this by the model of users
    public usu_id: Number;
    public user: User;
    public state: boolean;
    public registrationDate: Date;
}
