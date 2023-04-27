import {IOrderInitialization} from 'src/types';
import {initialDataMock} from 'src/mocks/orderIntializationDataMock';
import {errorFields, errorSeverities, errorSubTypes, errorTypes} from 'src/constants';

export const stateMock: IOrderInitialization = {
    'data': {
        'initial_data': initialDataMock.initial_data,
        'application_state': initialDataMock.application_state,
        'public_order_id': initialDataMock.public_order_id,
        'jwt_token': initialDataMock.jwt_token
    },
    'appSetting': {
        'screenWidth': window.innerWidth,
        'languageIso': 'en',
        'callApiAtOnEvents': true,
        'autocompleteService': '',
        'billingType': 'same',
        'discountText': '',
        'pigiDisplaySca': false,
        'isExpressPaySectionEnable': false
    },
    externalPaymentGateways: {
        isLoading: new Set(),
        isValid: new Set(),
    },
    'isLoading': {
        pigiIframe: false,
        customerPageButton: false,
        shippingPageButton: false,
        discountButton:false,
        discountClose: false,
        shippingLines: false,
    },
    'isValid': {
        shippingAddress: false,
        updatedShippingAddress: false,
        billingAddress: false,
        orderProcessed: false,
        shippingLine: false,
        pigi: false,
        pigiLoaded: true,
        scaToken: false,
    },
    'isButtonDisable': {
        customerPageButton: false,
        shippingPageButton: true,
    },
    'isSessionInitialized': false,
    'errors': [{
        message: 'Test message',
        field: errorFields.address_line_1,
        severity: errorSeverities.validation,
        sub_type: errorSubTypes.email,
        type: errorTypes.address,
        address_type: ''
    }],
    'overlay': {
        inverted: false,
        shown: false,
        icon: '',
        header: '',
        subHeader: '',
        content: ''
    },
};
