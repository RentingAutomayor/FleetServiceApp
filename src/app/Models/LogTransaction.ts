import { FinancialInformation } from './FinancialInformation';
import { Transaction } from './Transaction';

export class LogTransaction{
    public id: number;
    public transaction: Transaction;
    public initValues: FinancialInformation;
    public endValues: FinancialInformation;
}
