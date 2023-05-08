import {AnyAction} from 'redux';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {ICountryInformation} from '@boldcommerce/checkout-frontend-library';

const {data:{initial_data}} = defaultOrderInitialization;

export function countryReducer(state = initial_data.country_info, action: AnyAction ): Array<ICountryInformation> {
    switch (action.type) {
        default:
            return state;

    }
}
