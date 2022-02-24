import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnChanges,
  SimpleChange,
  Input,
  SimpleChanges,
  OnDestroy,
} from '@angular/core'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { Brand } from 'src/app/Models/Brand'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { MaintenanceItemService } from '../../Services/MaintenanceItem/maintenance-item.service'
import { VehicleService } from '../../../client/Services/Vehicle/vehicle.service'
import { Tax } from 'src/app/Models/Tax'
import { CompanyType } from 'src/app/Models/CompanyType'
import { Dealer } from 'src/app/Models/Dealer'
import { SharedFunction } from 'src/app/Models/SharedFunctions'
import { ItemHandleTaxes } from 'src/app/Models/ItemHandleTaxes'
import { TypeOfMaintenanceItem } from 'src/app/Models/TypeOfMaintenanceItem'
import { PresentationUnit } from 'src/app/Models/PresentationUnit'
import { Category } from 'src/app/Models/Category'
import { TypeOfMaintenanceItems } from 'src/app/Models/enumPresentationUnit'
import { VehicleType } from 'src/app/Models/VehicleType'
import { VehicleModel } from 'src/app/Models/VehicleModel'

@Component({
  selector: 'app-maintenance-item',
  templateUrl: './maintenance-item.component.html',
  styleUrls: [
    './maintenance-item.component.scss',
    '../../../../../assets/styles/app.scss',
    '../../../../../assets/styles/checkbox.scss',
  ],
})
export class MaintenanceItemComponent implements OnInit, OnChanges, OnDestroy {
  frmMaintenanceItem: FormGroup = new FormGroup({})
  item: MaintenanceItem
  itemToUpdate: MaintenanceItem = new MaintenanceItem()
  lsTaxesSelected: Tax[] = []
  itemHandleTax: Boolean
  @Output() maintenanceItemWasSetted = new EventEmitter<boolean>()
  @Output() maintenanceItemWasCanceled = new EventEmitter<boolean>()
  @Input()
  countChanges!: number
  sharedFunction: SharedFunction = new SharedFunction()
  presentationUnitIsInvalid: boolean
  vehicleTypeIsValid: boolean
  typeIsInvalid: boolean
  brandChevrolet = 1
  taxesAreInvalid: boolean
  itemAndTaxes: ItemHandleTaxes = {} as ItemHandleTaxes
  typeOfItem: TypeOfMaintenanceItem
  presentationUnit: PresentationUnit = {} as PresentationUnit
  category: Category
  idType: Number

  // TODO: Refactor about maintenance Items
  // TODO: Refactor about maintenance Items
  maintenanceItem: MaintenanceItem = new MaintenanceItem()
  lsVehicleTypes: VehicleType[] = []
  lsVehicleModels: VehicleModel[] = []
  amountChangesVehicleType: number

  @Input('maintenanceItem')
  set setMaintenanceItem(item: MaintenanceItem) {
    this.maintenanceItem = item
    if (this.maintenanceItem.id > 0) {
      this.lsVehicleTypes = item.lsVehicleType
      this.lsVehicleModels = item.lsVehicleModel
      this.setDataInForm(this.maintenanceItem)
    }
  }

  disableControls: boolean = false
  @Input('disableControls')
  set setDisableControls(value: boolean) {
    this.disableControls = value
    if (this.disableControls) {
      this.frmMaintenanceItem.disable()
    } else {
      this.frmMaintenanceItem.enable()
    }
  }

  brandSelected: Brand | null | undefined = null

  constructor(
    private maintenanceItemService: MaintenanceItemService,
    private vehicleService: VehicleService,
    private formBuilder: FormBuilder
  ) {
    this.buildFormMaintenanceItem()
    this.item = new MaintenanceItem()
    this.itemHandleTax = false
    this.lsTaxesSelected = []
    this.presentationUnitIsInvalid = false
    this.typeIsInvalid = false
    this.vehicleTypeIsValid = false
    this.taxesAreInvalid = false
    this.typeOfItem = {} as TypeOfMaintenanceItem
    this.presentationUnit = {} as PresentationUnit
    this.category = {} as Category
    this.idType = 0
    this.amountChangesVehicleType = 0
  }

  ngOnDestroy(): void {
    this.clearDataForm()
  }

  buildFormMaintenanceItem() {
    this.sharedFunction = new SharedFunction()
    this.frmMaintenanceItem = this.formBuilder.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
      referencePrice: [1, [Validators.required, Validators.min(1)]],
    })
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    this.clearDataForm()
    this.initComponents()
  }

  async initComponents() {
    // this.itemToUpdate = this.maintenanceItemService.getItemToUpdate();
    this.itemHandleTax = false
  }

  setDataMaintenanceItem(event: any) {
    event.preventDefault()
    this.item = this.setDataToItem()
    this.maintenanceItemService.setItem(this.item)
    this.maintenanceItemWasSetted.emit(true)
  }

  setDataToItem() {
    try {
      let oItem = new MaintenanceItem()
      oItem = this.frmMaintenanceItem.value

      if (this.maintenanceItem != null) {
        oItem.id = this.maintenanceItem.id
      }

      if (this.lsTaxesSelected.length > 0) {
        oItem.handleTax = true
        oItem.lsTaxes = this.lsTaxesSelected
      } else {
        oItem.handleTax = false
        oItem.lsTaxes = []
      }

      oItem.presentationUnit = this.presentationUnit
      oItem.type = this.typeOfItem
      oItem.category = this.category
      oItem.lsVehicleType =
        this.vehicleService.getListVehicleTypeSelected() != null
          ? this.vehicleService.getListVehicleTypeSelected()
          : []
      oItem.lsVehicleModel =
        this.vehicleService.getListVehicleModelsSelected() != null
          ? this.vehicleService.getListVehicleModelsSelected()
          : []

      oItem = this.setDealerToItem(oItem)
      return oItem
    } catch (error) {
      console.warn(error)
    }
  }

  setDealerToItem(oItem: MaintenanceItem) {
    const session = JSON.parse(sessionStorage.getItem('sessionUser'))
    if (session.company.type == CompanyType.DEALER) {
      oItem.dealer.id = session.company.id
    }
    return oItem
  }

  setDataInForm(pItem: MaintenanceItem) {
    this.frmMaintenanceItem.patchValue(pItem)
    this.typeOfItem = pItem.type
    this.category = pItem.category
    let oBrandTmp = new Brand()
    this.idType = pItem.type.id
    this.presentationUnit = pItem.presentationUnit

    if (pItem.lsVehicleModel.length > 0) {
      if (
        pItem.lsVehicleModel[0].brand != null &&
        pItem.lsVehicleModel[0].brand != undefined
      ) {
        oBrandTmp = pItem.lsVehicleModel[0].brand
      } else {
        oBrandTmp.id = 1
        oBrandTmp.name = 'CHEVROLET'
      }
    } else {
      oBrandTmp.id = 1
      oBrandTmp.name = 'CHEVROLET'
    }

    this.brandSelected = oBrandTmp

    if (pItem.handleTax) {
      this.itemHandleTax = true
      this.lsTaxesSelected = pItem.lsTaxes
      this.itemAndTaxes = {
        handleTaxes: this.itemHandleTax,
        lsTaxes: this.lsTaxesSelected,
      } as ItemHandleTaxes
      this.calculateTaxesByItem(this.itemAndTaxes)
    } else {
      this.itemHandleTax = false
      this.lsTaxesSelected = []
      this.itemAndTaxes = {
        handleTaxes: this.itemHandleTax,
        lsTaxes: this.lsTaxesSelected,
      } as ItemHandleTaxes
      this.calculateTaxesByItem(this.itemAndTaxes)
    }

    this.vehicleService.setListVehicleTypeSelected(pItem.lsVehicleType)
    this.vehicleService.setListVehicleModelsSelected(pItem.lsVehicleModel)
  }

  clearDataForm() {
    this.frmMaintenanceItem.reset()
    this.lsTaxesSelected = []
    this.presentationUnit = {} as PresentationUnit
    this.typeOfItem = {} as TypeOfMaintenanceItem
    this.category = {} as Category
    this.idType = TypeOfMaintenanceItems.REPUESTO
    // this.vehicleService.setVehicleModelSelected(null)
    // this.vehicleService.setBrandSelected(null)
    // this.vehicleService.setListVehicleTypeSelected(null)
    // this.vehicleService.setListVehicleModelsSelected(null)
    this.itemHandleTax = false
    this.lsTaxesSelected = []
    const txtTaxesValue: HTMLInputElement =
      document.querySelector('#taxesValue')
    const txtTotalValue: HTMLInputElement =
      document.querySelector('#totalValue')
    txtTaxesValue.value = ''
    txtTotalValue.value = ''
    this.maintenanceItem = {} as MaintenanceItem
    this.lsVehicleTypes = []
    this.lsVehicleModels = []
  }

  comeBack() {
    this.clearDataForm()
    this.maintenanceItemWasCanceled.emit(true)
  }

  setBrand(brand: Brand) {
    this.brandSelected = brand
  }

  setVehiclType() {
    this.countChanges += 1
  }

  setListVehicleTypes(lsVehicleTypeSelected: VehicleType[]) {
    this.lsVehicleTypes = lsVehicleTypeSelected
    const vehicleSelectedLength =
      this.lsVehicleTypes != null ? this.lsVehicleTypes.length : 0

    if (vehicleSelectedLength == 0) {
      this.vehicleTypeIsValid = true
    } else {
      this.vehicleTypeIsValid = false
    }

    this.amountChangesVehicleType++
  }

  setLisVehicleModels(lsVehicleModels: VehicleModel[]) {
    this.lsVehicleModels = lsVehicleModels
  }

  calculateTaxesByItem(itemAndTaxes: ItemHandleTaxes) {
    let totalTaxes = 0
    if (itemAndTaxes.handleTaxes) {
      const txtTaxesValue: HTMLInputElement =
        document.querySelector('#taxesValue')
      const txtTotalValue: HTMLInputElement =
        document.querySelector('#totalValue')
      this.lsTaxesSelected = itemAndTaxes.lsTaxes
      const { referencePrice } = this.frmMaintenanceItem.controls
      this.taxesAreInvalid = this.lsTaxesSelected.length > 0 ? false : true
      const value = referencePrice.value != null ? referencePrice.value : 0

      totalTaxes = this.maintenanceItemService.calculateTaxes(
        value,
        this.lsTaxesSelected
      )

      txtTaxesValue.value = totalTaxes.toString()
      const totalByItem = this.maintenanceItemService.calculateTotalByItem(
        value,
        0,
        totalTaxes
      )
      txtTotalValue.value = totalByItem.toString()
    } else {
      this.taxesAreInvalid = false
    }
    return totalTaxes
  }

  validatePresentationUnit(presentation: PresentationUnit) {
    if (presentation == null || presentation == undefined) {
      this.presentationUnitIsInvalid = true
    } else {
      this.presentationUnitIsInvalid = false
      this.presentationUnit = presentation
    }
  }

  validateTypeOfMaintenanceItem(typeOfMaintenanceItem: TypeOfMaintenanceItem) {
    try {
      if (typeOfMaintenanceItem == null || typeOfMaintenanceItem == undefined) {
        this.typeIsInvalid = true
      } else {
        this.typeIsInvalid = false
        this.typeOfItem = typeOfMaintenanceItem
      }
    } catch (error) {
      console.warn(error)
    }
  }

  get fieldCode() {
    return this.frmMaintenanceItem.get('code')
  }

  get fieldName() {
    return this.frmMaintenanceItem.get('name')
  }

  get fieldReferencePrice() {
    return this.frmMaintenanceItem.get('referencePrice')
  }

  setTypeOfItem(type: TypeOfMaintenanceItem) {
    try {
      if (type) {
        this.typeOfItem = type
        this.idType = this.typeOfItem.id
      }
    } catch (error) {
      console.warn(error)
    }
  }

  setPresentationUnit(presentation: PresentationUnit) {
    try {
      if (presentation) {
        this.presentationUnit = presentation
      }
    } catch (error) {
      console.warn(error)
    }
  }

  setCategory(category: Category) {
    try {
      this.category = category
    } catch (error) {
      console.warn(error)
    }
  }
}
