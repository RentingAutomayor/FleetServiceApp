import { Contract } from './Contract';
import { MaintenanceItem } from './MaintenanceItem';

export class PricesByContract{
    public contract: Contract;
    public lsMaintenanceItems: MaintenanceItem[];
}
