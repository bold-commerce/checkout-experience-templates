import {IFrontEndEvent, IInitializeOrderData} from 'src/types/appInterfaces';
import {IEnvironment} from '@boldcommerce/checkout-frontend-library';

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
        bugsnagApiKey: string,
        enableConsole: boolean,
        fbq?: IFbq,
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
    isExpressPaySectionEnable: boolean
}

export interface IBreadcrumbs {
    sectionLabel: string
    crumbs: Array<IBreadcrumb>
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

export interface IFbq {
    (event: string, eventName: string, params?: Record<string, unknown>): void;
    (event: string, dataProcessingOptions: Array<string>, dataProcessingOptionsCountry?: number, dataProcessingOptionsState?: number): void;
    getState: () => IFbqState;
}

export interface IFbqState {
    pixelInitializationTime: number;
    pixels: Array<IFbqPixel>;
}

export interface IFbqPixel {
    agent: unknown;
    eventCount: number;
    id: string;
}
