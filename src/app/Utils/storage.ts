export function saveInStorage(key: string, value: any){
  window.sessionStorage.setItem(key, value);
}

export function getFromStorage(key: string){
  return window.sessionStorage.getItem(key);
}
