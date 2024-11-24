import { EncryptStorage } from "encrypt-storage";

const encryptedLocalStorage = new EncryptStorage(
  import.meta.env.VITE_STORAGE_ENCRYPTION_KEY || 'default-key'
);

export const setToLocalStorage = (key, value) => {
  encryptedLocalStorage.setItem(key, value);
}

export const getFromLocalStorage = (key) => {
  return encryptedLocalStorage.getItem(key);
}

export const removeFromLocalStorage = (key) => {
  encryptedLocalStorage.removeItem(key);
}
 
