import {IInitializeEndpointData, IOrderInitialization} from 'src/types';
import {getValidatedOrderData} from 'src/utils';
import {autocompleteServices} from 'src/constants';

const orderData: IInitializeEndpointData = window.initializedOrder.data;
const validatedData = getValidatedOrderData(orderData);

export const orderInitialization: IOrderInitialization = {
    appSetting: {
        screenWidth: window.innerWidth,
        languageIso: 'en',
        callApiAtOnEvents: true,
        autocompleteService: autocompleteServices.GOOGLE_AUTOCOMPLETE,
        billingType: 'same',
        discountText: '',
        pigiDisplaySca: false
    },
    isLoading: {
        pigiIframe: false,
        customerPageButton: false,
        shippingPageButton: false,
        discountButton: false,
        discountClose: false,
        shippingLines: false,
    },
    isButtonDisable: {
        customerPageButton: false,
        shippingPageButton: true,
    },
    isValid: {
        shippingAddress: false,
        updatedShippingAddress: false
    },
    overlay: {
        inverted: false,
        shown: false,
        icon: '',
        header: '',
        subHeader: '',
        content: ''
    },
    errors: [],
    data: {
        jwt_token: validatedData.jwt_token,
        public_order_id: validatedData.public_order_id,
        application_state: validatedData.application_state,
        initial_data:validatedData.initial_data
    }
};
