import { Injectable } from '@angular/core'
import Swal from 'sweetalert2'

@Injectable({ providedIn: 'root' })
export class AlertService {
  error(text: string) {
    Swal.fire({
      title: 'Error',
      text,
      icon: 'error',
      confirmButtonText: 'Aceptar',
    })
  }

  succes(text: string) {
    Swal.fire({
      title: 'Éxito',
      text,
      icon: 'success',
      confirmButtonText: 'Aceptar',
    })
  }

  confirmDelete() {
    return Swal.fire({
      title: 'Aviso',
      text: '¿Esta seguro de realizar esta acción?',
      icon: 'info',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    })
  }

  confirm(text: string, callback: () => void) {
    Swal.fire({
      title: 'Confirmar Accion?',
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Continuar',
      cancelButtonText: 'No, Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        callback()
        this.succes('Accion realizada con exito')
      }
    })
  }
}
