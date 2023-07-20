import {defaultOrderInitialization} from 'src/constants/orderInitialization';

const {data:{initial_data}} = defaultOrderInitialization;

export function flowSettingsInitialDataReducer(state = initial_data.flow_settings): Record<string, unknown> {
    return state;
}
