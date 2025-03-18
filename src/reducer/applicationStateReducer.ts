import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {AnyAction} from 'redux';
import {UPDATE_ORDER_PROCESSED} from 'src/action';

const {data: {application_state}} = defaultOrderInitialization;

export const resumableLinkReducer = (state = application_state.resumable_link): string | null => state;

export const linkToCartReducer = (state = application_state.link_to_cart): string | null => state;

export const createdViaReducer = (state = application_state.created_via): string => state;

export const displayExchangeRateReducer = (state = application_state.display_exchange_rate): number | null => state;

export const flowIdReducer = (state = application_state.flow_id): string | null => state;

export function isProcessedReducer(state = application_state.is_processed, action: AnyAction ): boolean {
    switch (action.type) {
        case UPDATE_ORDER_PROCESSED: {
            return action.payload.data;
        }
        default:
            return state;
    }
}
