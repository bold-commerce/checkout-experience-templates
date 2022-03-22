import {IInitializeEndpointData, IOrderInitialization} from 'src/types';
import {getValidatedOrderData} from 'src/utils';
import { defaultOrderInitialization } from 'src/constants/orderInitialization';

export function getOrderInitialization(orderData: IInitializeEndpointData): IOrderInitialization {
    const validatedData = getValidatedOrderData(orderData);

    return {
        ...defaultOrderInitialization,
        data: {
            jwt_token: validatedData.jwt_token,
            public_order_id: validatedData.public_order_id,
            application_state: validatedData.application_state,
            initial_data:validatedData.initial_data
        }
    };
}
