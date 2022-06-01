import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {
  regexStr = /[0-9]/;
  constructor() { }

  @HostListener('keypress', ['$event']) onKeyPress(event){
    return new RegExp(this.regexStr).test(event.key);
  }

}
