import {stateKeys} from "../redux/actions";
import {setReduxState} from "./helpers";
import {userType} from "./Identifiers";

const TOKEN_KEY = 'token';

export function userLoggedIn() {
    return !!getUserToken();
}

export function getActiveStore() {
    return sessionStorage.getItem('user') ? sessionStorage : localStorage;
}

export function getUserToken() {
    return getActiveStore().getItem(TOKEN_KEY)
}

export function loadUserInfo() {
    //Fetch user full details from server using token(recommended)
    //or
    //From local storage
    const data = getActiveStore().getItem(stateKeys.USER)
    const user = data ? JSON.parse(data) : null;

    //This should update redux
    setReduxState(user, stateKeys.USER)
}

export function getUser(key, defaultValue = null) {
    //Get user details from redux (recommended)
    // let data = reduxState(stateKeys.USER)
    // //or
    // //Local/Session storage
    const userData = getActiveStore().getItem(stateKeys.USER);
    let data = userData ? JSON.parse(userData) : null;

    if (!data || (key && typeof data[key] === 'undefined')) {
        return defaultValue
    }

    return key ? data[key] : data;
}

export function updateUserInfo(data) {
    const userData = getUser();
    let update = Object.assign({}, userData, data);

    getActiveStore().setItem(stateKeys.USER, JSON.stringify(update));
    setReduxState(update, stateKeys.USER)
}

export function loginUser(token, user, redirect) {
    const storage = localStorage;
    storage.setItem(TOKEN_KEY, token);
    if (user) {
        storage.setItem(stateKeys.USER, JSON.stringify(user));
        setReduxState(user, stateKeys.USER)
    }

    if (redirect) {
        const intended = rememberRoute();
        if (intended) {
            window.location = intended;
        } else if (user.roleName &&
            (user.roleName === userType.superadmin)) {
            window.location = "/admin/dashboard";
        } else if (user.roleName &&
            (user.roleName === userType.hod)) {
            window.location = "/hod/dashboard";
        } else if (user.roleName &&
            (user.roleName === userType.schooladmin)) {
            window.location = "/schooladmin/dashboard";
        } else if (user.roleName &&
            (user.roleName === userType.instructor)) {
            window.location = "/instructor/dashboard";
        } else if (user.roleName &&
            (user.roleName === userType.student)) {
            window.location = "/student/dashboard";
        } else {
            window.location = "/login";
        }
    }

}

export function rememberRoute() {
    const key = '__intended';
    const old = sessionStorage.getItem(key);
    // sessionStorage.setItem(key, window.location.pathname);

    return old;
}

export function logOutUser(redirect) {
    // getActiveStore().removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(stateKeys.USER);
    sessionStorage.removeItem(stateKeys.USER);

    window.location = redirect ? redirect : '/login';
}
