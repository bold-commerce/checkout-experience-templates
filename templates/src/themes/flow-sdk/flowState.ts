import {ICheckoutFlow, IFlowType, IMetaFlow} from 'src/themes/flow-sdk/types';

export const flowType: IFlowType = {
    META: 'meta',
};

export const checkoutFlow: ICheckoutFlow = {
    params: {
        shopIdentifier: '',
        flowElementId: '',
        boldSecureUrl: 'https://secure.boldcommerce.com',
        environment: {type: 'production'},
        onAction: null,
    },
    flow_settings: {},
    canCheckout: false,
    onCheckoutClick: null,
    onGoingRequests: []
};

export const metaFlow: IMetaFlow = {
    metaPay: null,
    metaPaymentClient: null,
};
