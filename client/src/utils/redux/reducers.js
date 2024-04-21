import { SIGN_IN, SIGN_OUT, UPDATE_TOKEN } from "./actions";

export const initialState = {
    LOGGED_IN: false,
    USER: null,
    TOKEN: null,
}

export const reducer = (state = initialState, action) => { 
    switch (action.type) {
        case SIGN_IN:
            localStorage.removeItem('id_token');
            localStorage.setItem('id_token', action.payload);
            return {
                ...state,
                LOGGED_IN: true,
                USER: action.payload.user,
                TOKEN: action.payload.token
            }
        case SIGN_OUT:
            localStorage.removeItem('id_token');
            return {
                ...state,
                LOGGED_IN: false,
                USER: null,
                TOKEN: null
            }
        case UPDATE_TOKEN:
            const token = action.payload.split(' ').pop().trim();   
            localStorage.setItem('id_token', token);
            return {
                ...state,
                TOKEN: token
            }
        default:
            return state;
        }
}