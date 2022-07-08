import { buffer } from 'rxjs/operators'
import * as xlsx from 'xlsx'

export class Excel {
  public static convertExcelToArray(file: any, callback) {
    let workBook = null
    let jsonData = null
    const reader = new FileReader()
    reader.onload = () => {
      const data = reader.result
      workBook = xlsx.read(data, { type: 'binary' })
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name]
        initial[name] = xlsx.utils.sheet_to_json(sheet)
        return initial
      }, {})
      const rows = jsonData[Object.keys(jsonData)[0]].map((row) => {
        return {
          code: row.code,
          name: row.name,
          price: row?.price,
        }
      })
      callback(rows)
    }
    reader.readAsBinaryString(file)
  }

  public static convertArrayToFile(data: any[], fileName: string) {
    let reader = new FileReader()
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const EXCEL_EXTENSION = '.xlsx'
    const worksheet: xlsx.WorkSheet = xlsx.utils.json_to_sheet(data)
    const workBook: xlsx.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    }
    const excelBuffer: any = xlsx.write(workBook, {
      bookType: 'xlsx',
      type: 'array',
    })
    const file: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE })
    const a = document.createElement('a')
    a.style.display = 'none'
    reader.readAsDataURL(file)
    reader.onload = (response) => {
      a.href = response.target.result.toString()
      a.download = `${fileName}${EXCEL_EXTENSION}`
      a.click()
      a.remove()
    }
  }
}
