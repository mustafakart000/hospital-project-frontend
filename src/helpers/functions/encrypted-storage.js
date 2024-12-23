import { EncryptStorage } from "encrypt-storage";

const encryptedLocalStorage = new EncryptStorage(
  import.meta.env.VITE_STORAGE_ENCRYPTION_KEY || 'default-key'
);

////console.log("encryptedLocalStorage => ",encryptedLocalStorage)
////console.log("Encryption Key:", import.meta.env.VITE_STORAGE_ENCRYPTION_KEY);

export const setToLocalStorage = (key, value) => {
  ////console.log("setToLocalStorage => ",encryptedLocalStorage)
  encryptedLocalStorage.setItem(key, value);
}

export const getFromLocalStorage = (key) => {
  ////console.log("getFromLocalStorage => ")
  ////console.log(encryptedLocalStorage.getItem(key))
  return encryptedLocalStorage.getItem(key);
}

export const removeFromLocalStorage = (key) => {
  encryptedLocalStorage.removeItem(key);
}
 
