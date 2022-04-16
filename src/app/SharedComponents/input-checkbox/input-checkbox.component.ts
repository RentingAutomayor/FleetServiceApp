import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-input-checkbox',
  templateUrl: './input-checkbox.component.html',
  styleUrls: ['./input-checkbox.component.scss'],
})
export class InputCheckboxComponent {
  @Input()
  option: any = ''

  isActive: boolean = false

  @Input('isActive')
  set setIsActive(value: boolean) {
    this.isActive = value
  }

  @Input() disable: boolean = false

  @Output()
  onCheckItem = new EventEmitter<boolean>()

  toogleCheck() {
    this.isActive = !this.isActive
    this.onCheckItem.emit(this.isActive)
  }
}
