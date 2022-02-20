import { QuotaType } from './QuotaType';
import { bussinesObject } from './BussinesObject';

export interface ContractualInformation extends bussinesObject {
   id: number;
   contractCode: string;
   serviceInitDate: Date;
   serviceEndDate: Date;
   quotaApprovalDate: Date;
   quotaEndingDate: Date;
   quotaType: QuotaType;
   paymentAgreement: number;
   adminPercentage: number;
}

export interface CreateContractualInformationDTO extends Omit<ContractualInformation, 'id'| 'QuotaType'> {
  quotaTypeId: number;
}

export interface ContractualInformationDTO extends Partial<CreateContractualInformationDTO>{}
