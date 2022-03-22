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
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
  groups: Groups
  @Input('groups')

  blockFieldGroups: boolean
  @Input('blockFieldGroup')
  set setBlockFieldGroup(value: boolean) {
    this.blockFieldGroups = value
    console.log(value)
    if (this.blockFieldGroups) {
      this.frmGroups.disable()
    } else {
      this.frmGroups.enable()
    }
  }
  frmGroups: FormGroup
  lsGroups: Groups[]
  lsGroupsFiltered: Groups[] = []

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onGroupWasSetted = new EventEmitter<Groups>()

  constructor(private groupService: GroupsService) {
    this.frmGroups = new FormGroup({
      cmbGroup: new FormControl('Seleccione ...'),
    })

    this.blockFieldGroups = false
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

  setSelectedGroups(obj: any) {
    const selectedGroup = this.lsGroups.find((grp) => grp.id == obj.value)
    this.onGroupWasSetted.emit(selectedGroup)
  }

  async setDataInForm(pGroup: Groups) {
    if (pGroup) {
      this.frmGroups.controls.cmbGroup.setValue(pGroup.id)
    }
  }

  clearDateForm(): void {
    this.frmGroups.controls.cmbGroup.setValue(0)
  }
}
