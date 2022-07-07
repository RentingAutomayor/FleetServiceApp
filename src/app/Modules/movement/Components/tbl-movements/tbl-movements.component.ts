import { Component, OnInit } from '@angular/core'
import { Movement } from 'src/app/Models/Movement'
import { MovementService } from '../../Services/Movement/movement.service'
import { Router } from '@angular/router'
import Swal from 'sweetalert2'
import { Excel } from 'src/app/Utils/excel'

@Component({
  selector: 'app-tbl-movements',
  templateUrl: './tbl-movements.component.html',
  styleUrls: ['./tbl-movements.component.scss'],
})
export class TblMovementsComponent implements OnInit {
  lsMovements: Movement[]
  isAwaiting: boolean
  countChanges: number
  constructor(
    private movementService: MovementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initComponents()
  }

  initComponents() {
    this.countChanges = 0
    this.isAwaiting = false
    this.getMovementList()
  }

  async getMovementList() {
    try {
      this.isAwaiting = true
      this.movementService
        .getMovements()
        .then((data) => (this.lsMovements = data))
      this.isAwaiting = false
    } catch (error) {
      console.warn(error)
    }
  }

  insertMovement() {
    this.movementService.setMovementToUpdate(null)
    this.countChanges += 1
    this.router.navigate(['/MasterMovements/Movement'])
  }

  async updateMovement(movement_id: number) {
    try {
      const oMovement = await this.movementService.getMovementById(movement_id)

      this.movementService.setMovementToUpdate(oMovement)
      this.router.navigate(['/MasterMovements/Movement'])
    } catch (error) {
      console.warn(error)
    }
  }

  async deleteMovement(pMovement: Movement) {
    try {
      if (confirm('¿Está seguro que desea eliminar este movimiento?')) {
        this.isAwaiting = true
        const rta = await this.movementService.delete(pMovement)
        this.isAwaiting = false
        if (rta.response) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: rta.message,
            showConfirmButton: true,
          })
          this.getMovementList()
        }
      }
    } catch (error) {
      console.warn(error)
    }
  }

  downloadExcel(): void {
    const data = this.lsMovements.map((movement) => {
      return {
        Nombre: movement.name,
        Descripcion: movement.description,
        Tipo: movement.type?.name,
      }
    })
    Excel.convertArrayToFile(data, 'Movimientos')
  }
}
