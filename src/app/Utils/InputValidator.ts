export class InputValidator {
  static validateTyping(event: any, type: string) {
    if (type == 'numbers') {
      const inputValue = event.key
      const pattern = /^\d+$/
      if (!pattern.test(inputValue)) {
        event.preventDefault()
        return false
      }
    }
  }
}
