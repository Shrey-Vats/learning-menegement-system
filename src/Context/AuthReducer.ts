// src/context/AuthReducer.ts (Update your existing file)

import { AuthState, AuthAction, AuthActionType } from "./AuthContext.types";

const AuthReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case AuthActionType.LOGIN_START:
            return {
                user: null,
                isFetching: true,
                error: false,
            };
        case AuthActionType.LOGIN_SUCCESS:
            return {
                user: action.payload,
                isFetching: false,
                error: false,
            };
        case AuthActionType.LOGIN_FAILURE:
            return {
                user: null,
                isFetching: false,
                error: true,
            };
        case AuthActionType.LOGOUT:
            return {
                user: null,
                isFetching: false,
                error: false,
            };
        default:
            return state;
    }
};

export default AuthReducer;