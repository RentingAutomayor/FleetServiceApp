import { formatNumber } from "@angular/common";

export class SharedFunction {

    formatNumberToString(oData:Number){



        let sData = oData.toString();

        let intPart = '';
        let decimalPart = '';

        let decimalSeparator = '.';
        let thousandSeparator = ',';

        let indexDecimalSeparator = sData.indexOf(decimalSeparator);

        if(indexDecimalSeparator > 0){
            intPart = sData.substr(0,indexDecimalSeparator);
            decimalPart = sData.substr(indexDecimalSeparator,sData.length);
        }else{
            intPart = sData.substr(0,sData.length);
        }


        let aNumber = intPart.split('');
        let aReverse = aNumber.reverse();
        let amountDigit = aReverse.length;
        let amountCommas = Math.floor(amountDigit / 3);

        for(let i = 0; i < amountCommas; i ++){
            let lastIndex = 0;
            let indexComma = aReverse.lastIndexOf(thousandSeparator);

            if(indexComma > 0){
                //this is for because we count the comma position 000.
                lastIndex = indexComma + 4;
            }else{
                lastIndex = 3;
            }
            aReverse.splice(lastIndex,0,thousandSeparator);

        }

        let formattedNumber =  aReverse.reverse().join('');

        if(formattedNumber.split('')[0] == thousandSeparator){
            formattedNumber = formattedNumber.substr(1,formattedNumber.length);
        }

        if(decimalPart != ''){
            decimalPart = decimalPart.replace(/\,/g,'.')
            formattedNumber = formattedNumber + decimalPart;
        }
        return formattedNumber;
    }

}
