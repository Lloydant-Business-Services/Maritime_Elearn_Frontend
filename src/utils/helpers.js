import {useState} from "react";
import store from "../redux/store";
import {stateKeys} from "../redux/actions";

export const PAGINATOR_DEFAULT = {
    current_page: 1,
    data: [],
    first_page_url: null,
    from: 1,
    last_page: 1,
    last_page_url: null,
    next_page_url: null,
    path: null,
    per_page: 15,
    prev_page_url: null,
    to: 1,
    total: 1
}

export function getSubDomain() {
    let hostname = window.location.hostname;
    let regexParse = new RegExp('[a-z-0-9]{2,63}.[a-z.]{2,5}$');
    let urlParts = regexParse.exec(hostname);
    return hostname.replace(urlParts[0], '').slice(0, -1);
}

export function getRefLink(refCode) {
    return `${window.location.origin}/ref/${refCode}`
}

export function roundNum(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals).toFixed(decimals);
}

export function time_convert(num) {
    const hours = Math.floor(num / 60);
    const minutes = num % 60;

    const my_hours = hours + (hours > 1 ? " hrs" : ' hr');
    const my_mins = minutes + (minutes > 1 ? " mins" : ' min');

    return hours > 0 ? (my_hours + " " + my_mins) : my_mins;
}

export function durationCovert(data) {
    let num = data;
    let hours = (num / 60);
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    if (rhours < 1) {
        return rminutes + "mins";
    } else if (rhours === 1) {
        return rhours + "hr" + " " + rminutes + "mins";
    } else if (rhours > 1) {
        return rhours + "hrs" + " " + rminutes + "mins";
    }
}

export function vd(value, defaultValue) {
    return typeof (value) !== 'undefined' ? value : defaultValue;
}

export function handleAxiosError(error, el) {
    el = vd(el, '.notify');
    let message = getErrorMessage(error);
    notify({'status': false, 'message': message}, el);
}

export function handleFormSubmissionError(error, component) {
    let message = getErrorMessage(error);
    component.setState({errorMessage: message, success: false, error: true, loading: false});
}

export function handleAxiosErrorWithState(error, state) {
    let message = getErrorMessage(error);
    if (typeof state === 'function')
        state({message: message, success: false, error: true, warning: false, loading: false});
    else
        notify({'status': false, 'message': message});
}

export function getErrorMessage(xhr) {
    let message = '';
    const error = xhr ? (xhr.response ? xhr.response : xhr) : null;
    if (error && error.status) {
        // Request made and server responded
        if (error.status === 500) {
            message = "Something went wrong, try again later";
        } else if (error.status === 503) {
            message = "Service is temporary unavailable, try again later";
        } else if (error.status === 401) {
            message = "Unauthorized, authentication failed";
        } else if (error.status === 422 && typeof error.data.message == "object") {
            // const key = Object.keys(error.data.message)[0];
            const errMessage = error.data.message;
            let textArr = [];
            Object.keys(errMessage).forEach(key => {
                errMessage[key].forEach(function (value, index) {
                    textArr.push(value);
                });
            });
            message = textArr;
        } else {
            message = error.data.message;
        }
    } else if (error && error.toString().startsWith('Error:')) {
        message = error.toString().substring(6);
    } else {
        // The request was made but no response was received
        message = "Error: Something went wrong";
    }
    return message;
}

export function currencyFormat(base_denomination, symbol = '₦', dp = 0) {
    // base_denomination = parseFloat(base_denomination)
    return symbol + (base_denomination / 100).toFixed(dp)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function nairaFormat(num, dp = 0, inKobo = true) {
    return currencyFormat(num, '₦', dp)
}

export function httpQueryBuild(params) {
    let esc = encodeURIComponent;
    return Object.keys(params)
        .map(function (k) {
            return esc(k) + '=' + esc(params[k]);
        })
        .join('&');
}

export function objectToHTTPQuery(params) {
    let query = '';
    if (params)
        query = '?' + httpQueryBuild(params);

    return query;
}

export function br2nl(str) {
    return str.replace(/<br\s*\/?>/mg, "\n");
}

export function nl2br(str) {
    return str.replace(/\n/g, "<br/>");
}

export function isSmallScreen() {
    return window.innerWidth <= 600;
}

export function isMediumScreen() {
    return window.innerWidth > 600 && window.innerWidth < 1024;
}

export function isLargeScreen() {
    return window.innerWidth >= 1024;
}

export function toast(message, time) {
    let toasts = reduxState(stateKeys.TOAST);
    const length = toasts.push(message);
    setReduxState(toasts, stateKeys.TOAST);

    setTimeout(function () {
        toasts = reduxState(stateKeys.TOAST);
        toasts.slice(length - 1, 1);
        delete toasts[length - 1];
        setReduxState(toasts, stateKeys.TOAST)
    }, time ?? 4000);
}

export function notify(response, container, style) {
    //Process message
    let message = '';
    if (typeof (response['message']) !== 'undefined') {
        message = response['message'];
        if (message instanceof Array) {
            message = message.join('<br/>');
        }
    } else {
        message = toString(response);
    }

    container = document.querySelectorAll(container);
    if (!container.length) {
        //If no container is set
        toast(message, 10000);
    } else {
        mapToElements(container, function (el) {
            let handle = el['data-timer'];
            if (typeof handle === 'number') {
                clearTimeout(handle);
            }

            //Remove *-text classes
            el.classList.remove('green-text', 'red-text', 'orange-text');
            el.innerHTML = message;
            if (typeof (response['message']) !== 'undefined') {
                el.classList.add((typeof (response['mode']) !== 'undefined') ?
                    response.mode + '-text' :
                    (response['status'] === true ? 'green-text' : 'red-text'));
            } else {
                el.classList.add((typeof style === 'undefined') ? 'orange-text' : style);
            }
            el.style.display = 'block';
            el['data-timer'] = setTimeout(function () {
                el.style.display = 'none';
            }, 15000);
        })
    }
}

export function mapToElements(elements, callable) {
    [...elements].forEach(function (el, index) {
        callable(el, index);
    });
}

export function copyToClipboard(text, notify) {
    let copy;
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        copy = window.clipboardData.setData("Text", text);

    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        let textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            copy = document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }

    if (typeof notify !== 'undefined' ? !!notify : true) {
        toast('copied', 3000);
    }
    return copy;
}

export function parseName(fullName) {
    let name = fullName || "";
    let result = {firstName: '', lastName: '', otherName: ''};

    if (name.length > 0) {
        let nameTokens = name.match(/[A-ZÁ-ÚÑÜ][a-zá-úñü]+|([aeodlsz]+\s+)+[A-ZÁ-ÚÑÜ][a-zá-úñü]+/g) || [];

        if (nameTokens.length > 3) {
            result.firstName = nameTokens.slice(0, 2).join(' ');
        } else {
            result.firstName = nameTokens.slice(0, 1).join(' ');
        }

        if (nameTokens.length > 2) {
            result.lastName = nameTokens.slice(-1).join(' ');
            result.otherName = nameTokens.slice(-2, -1).join(' ');
        } else if (nameTokens.length > 1) {
            result.lastName = nameTokens.slice(-1).join(' ');
        }
    }

    return result;
}

export function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function showPageLoader() {
    let els = document.querySelectorAll('#page-loader, #page-loader #loader');
    [...els].forEach(function (el) {
        el.style.display = 'block';
    });
}

export function hidePageLoader() {
    let els = document.querySelectorAll('#page-loader, #page-loader #loader');
    [...els].forEach(function (el) {
        el.style.display = 'none';
    });
}

export function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

export default function mergeDeep(target, source) {
    let output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, { [key]: source[key] });
                else
                    output[key] = mergeDeep(target[key], source[key]);
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}

export function useMergeState(initialState) {
    const [state, setState] = useState(initialState);
    const setMergedState = newState =>
        setState(prevState => Object.assign({}, mergeDeep(prevState, newState)));
    return [state, setMergedState];
}

export function setReduxState(value, key) {
    store.dispatch({
        'type': key,
        'value': value
    });
}

export function reduxState(key, defaultValue) {
    const state = store.getState();
    return state[key] ?? defaultValue;
}
