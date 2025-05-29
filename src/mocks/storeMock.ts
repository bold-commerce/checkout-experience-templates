import {IOrderInitialization} from 'src/types';
import {initialDataMock} from 'src/mocks/orderIntializationDataMock';
import {autocompleteServices, Constants} from 'src/constants';

export const storeMock: IOrderInitialization = {
    data: initialDataMock,
    appSetting: {
        screenWidth: 1224,
        languageIso: 'en',
        autocompleteService: autocompleteServices.GOOGLE_AUTOCOMPLETE,
        callApiAtOnEvents: false,
        billingType: Constants.SHIPPING_SAME,
        discountText: '',
        isExpressPaySectionEnable: false,
        isOnePageTheme: false,
        allowNavigation: false,
        paymentComponentType: Constants.EPS,
        epsBoldPayment: null,
    },
    errors: [],
    isLoading: {
        customerPageButton: false,
        shippingPageButton: false,
        discountButton: false,
        discountClose: false,
        shippingLines: false,
    },
    externalPaymentGateways: {
        isLoading: new Set(),
        isValid: new Set(),
    },
    isValid: {
        shippingAddress: false,
        updatedShippingAddress: false,
        billingAddress: false,
        orderProcessed: false,
        shippingLine: false,
        scaToken: false,
        batchPostShippingAddress: false,
        batchPostBillingAddress: false,
        taxesGenerated: false,
    },
    isButtonDisable: {
        customerPageButton: false,
        shippingPageButton: false
    },
    overlay: {
        shown: false,
        inverted: false,
    },
    isSessionInitialized: false,
};
