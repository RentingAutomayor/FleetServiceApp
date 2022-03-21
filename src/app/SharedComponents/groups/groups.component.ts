import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  EventEmitter,
} from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { Groups } from 'src/app/Models/Groups'
import { GroupsService } from '../Services/Groups/groups.service'

@Component({
  selector: 'app-group',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
  group: Groups
  @Input('group')

  blockFieldGroup: boolean
  @Input('blockFieldGroup')
  set setBlockFieldGroup(value: boolean) {
    this.blockFieldGroup = value
    console.log(value)
    if (this.blockFieldGroup) {
      this.frmGroup.disable()
    } else {
      this.frmGroup.enable()
    }
  }
  frmGroup: FormGroup
  lsGroups: Groups[]
  lsGroupsFiltered: Groups[] = []

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onGroupWasSetted = new EventEmitter<Groups>()

  constructor(private groupService: GroupsService) {
    this.frmGroup = new FormGroup({
      cmbGroup: new FormControl('Seleccione ...'),
    })

    this.blockFieldGroup = false
    this.lsGroups = []
  }

  ngOnInit(): void {
    this.initComponents()
  }

  initComponents() {
    this.getGroups()
  }

  getGroups() {
    this.groupService.getGroups().subscribe((groups) => {
      console.log(groups)
      this.lsGroups = groups
      this.lsGroupsFiltered = this.lsGroups
    })
  }

  setSelectedGroup(obj: any) {
    const selectedGroup = this.lsGroups.find((grp) => grp.id == obj.value)
    this.onGroupWasSetted.emit(selectedGroup)
  }

  async setDataInForm(pGroup: Groups) {
    if (pGroup) {
      this.frmGroup.controls.cmbGroup.setValue(pGroup.id)
    }
  }

  clearDateForm(): void {
    this.frmGroup.controls.cmbGroup.setValue(0)
  }
}
