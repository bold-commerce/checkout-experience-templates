import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {ILifeField} from '@boldcommerce/checkout-frontend-library';

const {data:{initial_data}} = defaultOrderInitialization;

export function lifeFieldsInitialDataReducer(state = initial_data.life_elements): Array<ILifeField> {
    return state;
}
