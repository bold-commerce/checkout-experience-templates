import {IFrontEndEvent, IInitializeOrderData} from 'src/types/appInterfaces';
import {IEnvironment} from '@bold-commerce/checkout-frontend-library';

declare global {
    interface Window {
        initializedOrder: IInitializeOrderData,
        shopAlias: string,
        shopName: string,
        platformType: string,
        publicOrderId: string,
        environment: IEnvironment,
        shopIdentifier: string
        returnUrl: string,
        loginUrl: string,
        headerLogoUrl: string,
        resumableUrl: string,
        supportEmail: string,
        initializeAutoComplete: () => void
        currency: string,
        currencySymbol: string,
        initialTimestamps: IFrontEndEvent,
        storeLoadTimesLocally: boolean,
    }
}

export interface IInitialState {
    screenWidth: number,
    languageIso: string,
    callApiAtOnEvents: boolean,
    autocompleteService: string,
    billingType: string,
    discountText: string,
    pigiDisplaySca: boolean,
}

export interface IBreadcrumb {
    name: string,
    text: string,
    status?: string,
    onClick: (event) => void;
}

export interface IFieldNamesSummary {
    content: string,
    amount: string,
    id: string
}

export interface ICondensedShipping {
    name: string;
    addressLine: string;
    phone: string
}
