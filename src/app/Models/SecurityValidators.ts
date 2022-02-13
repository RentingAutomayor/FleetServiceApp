import { CompanyType } from './CompanyType';
import { Company } from './Company';

export class SecurityValidators {
    /**
     *
     */
    constructor() {

    }

    public static validateUserAndCompany(): Company {
        try {
            const companyStorage = new Company;
            const userSession = JSON.parse(sessionStorage.getItem('sessionUser'));

            companyStorage.type = userSession.company.type;

            if (userSession.company.type == CompanyType.DEALER || userSession.company.type == CompanyType.CLIENT) {
                companyStorage.id = userSession.company.id;
            } else {
                companyStorage.id = 0;
            }
            companyStorage.usr_id = userSession.id_user;

            return companyStorage;
        } catch (error) {
            console.warn(error);
        }
    }

    public static validateUserLogged(): number {
        try {
            const userSession = JSON.parse(sessionStorage.getItem('sessionUser'));
            return userSession.id_user;
        }
        catch (error) {
            console.warn(error);
        }
    }
}
