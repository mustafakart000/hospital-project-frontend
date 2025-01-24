import { loginFailure, loginStart, loginSuccess, setLoginSuccess } from "./auth-slice";
import { userLogin } from "../../services/auth-service";
import { setToLocalStorage } from "../../helpers/functions/encrypted-storage";

export const loginThunk = (payload) => async (dispatch) => {
    dispatch(loginStart());
    try {
        const response = await userLogin(payload);
       

        // Veri yapısını standardize et
        const userData = {
            role: response.data.role,
            username: response.data.username,
            token: response.data.token,
            id: response.data.id,
            ad: response.data.ad || response.data.name || '',
            soyad: response.data.soyad || '',
            email: response.data.email || ''
        };

     

        dispatch(loginSuccess(userData));
        
        // LocalStorage'a kaydet
        setToLocalStorage('token', userData.token);
        setToLocalStorage('userData', userData);

        return response;
    } catch (error) {
        if (error) {
            const errorMessage = error.response?.data?.message || 'Giriş başarısız';
            dispatch(loginFailure({ message: errorMessage }));
            dispatch(setLoginSuccess(false));
            return Promise.reject(error); // error objesini direkt olarak gönderiyoruz
        } else {
            // Sunucu bir yanıt döndürmediyse (örneğin, ağ hatası)
            dispatch(loginFailure('Sunucuya ulaşılamadı veya bilinmeyen bir hata oluştu.'));
            dispatch(setLoginSuccess(false));
            return Promise.reject(error); // ağ hatası durumunda error objesini gönder
        }
    }
}
