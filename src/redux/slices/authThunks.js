import { loginFailure, loginStart, loginSuccess } from "./auth-slice";
import { userLogin } from "../../services/auth-service";
import { setToLocalStorage } from "../../helpers/functions/encrypted-storage";

export const loginThunk = (payload) => async (dispatch) => {
    dispatch(loginStart());
    try {
        //console.log("payload: ", payload)
        const response = await userLogin(payload);//burada hata verirse catch'e gider
        //console.log('response:', response);
        //console.log(response.data.role, response.data.username, response.data.token)
        dispatch(loginSuccess({
            role: response.data.role,        // data içinden alıyoruz
            username: response.data.username, // data içinden alıyoruz
            token: response.data.token,       // data içinden alıyoruz
            id: response.data.id
        }));
        setToLocalStorage('token', response.data.token);
        //console.log("Login success dispatched"); // Bu log'u görebilmeliyiz

         // Bir mikrosaniye bekletelim
         await new Promise(resolve => setTimeout(resolve, 0));

        return response;
    } catch (error) {

        if (error) {
            const errorMessage = error.response?.data?.message || 'Giriş başarısız1234';
            dispatch(loginFailure({ message: errorMessage }));
            return Promise.reject(error); // error objesini direkt olarak gönderiyoruz
        } else {
            // Sunucu bir yanıt döndürmediyse (örneğin, ağ hatası)
            dispatch(loginFailure('Sunucuya ulaşılamadı veya bilinmeyen bir hata oluştu.'));
            return Promise.reject(error); // ağ hatası durumunda error objesini gönder
        }
    }
}
