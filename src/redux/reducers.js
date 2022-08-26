import {stateKeys} from "./actions";

const initialState = {};
initialState[stateKeys.PAGE_CLASS] = '';
initialState[stateKeys.SITE_NAME] = 'Sample React Site';
initialState[stateKeys.SITE_DOMAIN] = 'example.ng';
initialState[stateKeys.DIALOG_TITLE] = null;
initialState[stateKeys.DIALOG_CONTENT] = null;
initialState[stateKeys.DIALOG_ACTION] = null;
initialState[stateKeys.DIALOG_ACTION_TEXT] = 'Ok, Continue';
initialState[stateKeys.SERVICES] = [];
initialState[stateKeys.USER] = {};
initialState[stateKeys.ADD_TO_CART_MODAL_SERVICE] = {};
initialState[stateKeys.SHOW_ADD_TO_CART_MODAL] = false;
initialState[stateKeys.TOAST] = [];
initialState[stateKeys.PRINT_ORDER] = {};

export function reducer(state = initialState, action) {
    let data = {};
    data[action.type] = action.value;
    return JSON.parse(JSON.stringify(Object.assign({}, state, data)));
}