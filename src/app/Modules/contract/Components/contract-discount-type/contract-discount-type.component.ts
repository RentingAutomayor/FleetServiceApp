import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { DiscountType } from 'src/app/Models/DiscountType'
import { ContractService } from '../../Services/Contract/contract.service'

@Component({
  selector: 'app-contract-discount-type',
  templateUrl: './contract-discount-type.component.html',
  styleUrls: ['./contract-discount-type.component.scss'],
})
export class ContractDiscountTypeComponent implements OnInit, OnChanges {
  frmDiscountType: FormGroup
  lsDiscount: DiscountType[]
  discountSelected: DiscountType
  @Input() countChanges: number
  @Output() discountWasSelected = new EventEmitter<DiscountType>()
  @Input() disableField: boolean

  @Input('discountType')
  set setDiscountSelected(discount: DiscountType) {
    this.discountSelected = discount
    if (this.discountSelected) {
      this.setDataInForm(this.discountSelected)
    } else {
      this.frmDiscountType.reset()
    }
  }

  constructor(private contractService: ContractService) {
    this.frmDiscountType = new FormGroup({
      cmbDiscount: new FormControl('Seleccione ...'),
    })
    this.disableField = false
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const change in changes) {
      if (change == 'countChanges') {
        this.discountSelected = this.contractService.getDiscountTypeSelected()
        if (
          this.discountSelected != null &&
          this.discountSelected != undefined
        ) {
          this.setDataInForm(this.discountSelected)
          this.discountWasSelected.emit(this.discountSelected)
        }
      } else if (change == 'disableField') {
        this.toggleDisableDiscountFiled()
      }
    }
  }

  ngOnInit(): void {
    this.initComponents()
  }

  async initComponents() {
    try {
      this.countChanges = 0
      this.lsDiscount = await this.contractService.getDiscountTypes()
    } catch (error) {
      console.error(error)
    }
  }

  setDiscountType(event: any) {
    const oDiscountTmp = this.lsDiscount.find((ds) => ds.id == event.value)
    this.discountSelected = oDiscountTmp
    this.contractService.setDiscountTypeSelected(oDiscountTmp)
    this.discountWasSelected.emit(this.discountSelected)
  }

  setDataInForm(pDiscount: DiscountType) {
    const { cmbDiscount } = this.frmDiscountType.controls
    cmbDiscount.setValue(pDiscount.id)
  }

  lostFocus() {
    this.discountWasSelected.emit(this.discountSelected)
  }

  toggleDisableDiscountFiled() {
    const { cmbDiscount } = this.frmDiscountType.controls
    if (this.disableField) {
      cmbDiscount.disable()
    } else {
      cmbDiscount.enable()
    }
  }
}
