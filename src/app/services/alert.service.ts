import { Injectable } from "@angular/core";
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertService{
    error(text: string){
        Swal.fire({
            title: 'Error',
            text,
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }

    succes(text: string){
        Swal.fire({
            title: 'Exito',
            text,
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    }

    confirmDelete(){
        return Swal.fire({
            title: 'Aviso',
            text: '¿Esta seguro de realizar esta acción?',
            icon: 'info',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            showCancelButton: true
        });
    }
}