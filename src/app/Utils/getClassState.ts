export function getClassState(nameState: string) : string {
      switch (nameState) {
        case 'FINALIZADA':
          return 'tag-ending' //color verde span

        case 'PAGADA':
          return 'tag-ending'

        case 'POR RECAUDAR':
          return 'tag-pending'

        default:
          return 'tag-pending'
      }
    }

