import {AnyAction} from 'redux';
import {ICountryInformation} from 'src/types';
import {orderInitialization} from 'src/constants/orderInitialization';

const {data:{initial_data}} = orderInitialization;

export function countryReducer(state = initial_data.country_info, action: AnyAction ): ICountryInformation[] {
    switch (action.type) {
        default:
            return state;

    }
}
