import { getFromLocalStorage } from "../helpers/functions/encrypted-storage";

export const getAuthHeader = () => {
  const token = getFromLocalStorage("token");

  let header = {};
  if(token){
    header={
        Authorization: `${token}`
      }
      // console.log("getAuthHeader => ")
      // console.log(header.Authorization);
      // console.log(header);
    
    return header;
  }
};
