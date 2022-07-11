export function getClassState(nameState: string) : string {
      switch (nameState) {
        case 'FINALIZADA':
          return 'tag-ending' //color verde span

        case 'PAGADA':
          return 'tag-ending'

        case 'POR RECAUDAR':
          return 'tag-pending'

        case 'ACTIVO':
          return 'tag-ending'

        case 'EN NEGOCIACIÓN':
          return 'tag-waiting'

        case 'CANCELADO':
          return 'tag-canceled'

        default:
          return 'tag-pending'
      }
    }

