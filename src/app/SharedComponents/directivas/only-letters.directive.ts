import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyLetters]'
})
export class OnlyLettersDirective {
  regexStr = /[a-zA-Z áéíóúÁÉÍÓÚñÑ@&._$-]/;
  constructor() { }

  @HostListener('keypress', ['$event']) onKeyPress(event){
    return new RegExp(this.regexStr).test(event.key);
  }
}
