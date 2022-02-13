import { User } from './User';
import { QuotaType } from './QuotaType';

export interface ContractualInformation {
   id: number;
   contractCode: string;
   serviceInitDate: Date;
   serviceEndDate: Date;
   quotaApprovalDate: Date;
   quotaEndingDate: Date;
   QuotaTypeViewModel: QuotaType;
   paymentAgreement: number;
   adminPercentage: number;
   user: User;
   state: boolean;
   registrationDate: Date;
   updateDate: Date;
   deleteDate: Date;
}
