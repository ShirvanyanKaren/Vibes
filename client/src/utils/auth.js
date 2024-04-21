import { jwtDecode } from 'jwt-decode';
import { SIGN_IN, SIGN_OUT } from './redux/actions';

class AuthService {
    constructor(dispatch) {
        this.dispatch = dispatch;
    }

    getProfile = () => {
        const token = this.getToken();
        if (token) {
            return jwtDecode(token);
        }
        return null;
    }

    loggedIn = () => {
        const token = this.getToken();
        return token && !this.isTokenExpired(token);
    }

    isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.exp < Date.now() / 1000;
        } catch (err) {
            console.error('Failed to decode token:', err);
            return true;
        }
    }

    getToken = () => {
        const token = localStorage.getItem('id_token');
        if (token && !this.isTokenExpired(token)) {
            return token;
        }
        localStorage.removeItem('id_token');
        return null;
    }

    login = (idToken) => {
        this.dispatch(SIGN_IN(idToken));
        window.location.assign('/');
    }

    logout = () => {
        this.dispatch(SIGN_OUT());
        window.location.assign('/');
    }
}

export default AuthService;