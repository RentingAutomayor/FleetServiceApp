import { callbackify } from "util";

export class ConfigPersonComponent{
    public kindOfDocumentIsVisible:boolean;
    public documentIsVisible:boolean;
    public nameIsVisible:boolean;
    public lastNameIsVisible:boolean;
    public phoneIsVisible:boolean;
    public cellphoneIsVisible:boolean;
    public emailIsVisible:boolean;
    public websiteIsVisible:boolean;
    public addressIsVisible:boolean;
    public jobTitleIsVisible:boolean;
    public cityIsVisible:boolean;

    constructor(){
        this.kindOfDocumentIsVisible = false;
        this.documentIsVisible = false;
        this.nameIsVisible = false;
        this.lastNameIsVisible = false;
        this.phoneIsVisible = false;
        this.cellphoneIsVisible = false;
        this.emailIsVisible = false;
        this.websiteIsVisible = false;
        this.addressIsVisible = false;
        this.jobTitleIsVisible = false;
        this.cityIsVisible = false;
    }
    
    
}