export  class InputValidator {
    static validateTyping(event: any, type: string) {
        if (type == "numbers") {
            let inputValue = event.key;
            let pattern = /^\d+$/;
            if (!pattern.test(inputValue)) {
                event.preventDefault();
                return false;
            }
        }
    }
}