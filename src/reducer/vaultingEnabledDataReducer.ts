import {defaultOrderInitialization} from 'src/constants/orderInitialization';

const {data} = defaultOrderInitialization;

export function vaultingEnabledDataReducer(state = data.vaulting_enabled): boolean {
    return state;
}