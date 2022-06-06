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
}