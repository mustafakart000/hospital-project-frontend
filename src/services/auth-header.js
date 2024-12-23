import { getFromLocalStorage } from "../helpers/functions/encrypted-storage";

export const getAuthHeader = () => {
  ////console.log("getAuthHeader => ")
  const token = getFromLocalStorage("token");
  ////console.log("token", token)

  let header = {};
  if(token){
    header={
        Authorization: `Bearer ${token}`
      }
      // ////console.log("getAuthHeader => ")
      // ////console.log(header.Authorization);
      // ////console.log(header);
    
    return header;
  }
};
