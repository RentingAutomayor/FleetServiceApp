import { Client } from './Client';

export class FinancialInformation{
    public id: Number;
    public client: Client;
    public approvedQuota: Number;
    public consumedQuota: Number;
    public currentQuota: Number;
    public inTransitQuota: Number;
    public state: boolean;
    public registrationDate: Date;
    public updateDate: Date;
}
