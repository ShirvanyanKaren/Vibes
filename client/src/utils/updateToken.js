import { useDispatch } from "react-redux";
import { UPDATE_TOKEN } from "./redux/actions";

export const useUpdateToken = () => {
    const dispatch = useDispatch();

    const updateToken = (token) => {
        try {
            dispatch({ type: UPDATE_TOKEN, payload: token });
        } catch (error) {
            console.error('Error updating token:', error);
        }
    };

    return updateToken;
};