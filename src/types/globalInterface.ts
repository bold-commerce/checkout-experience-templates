import {IInitializeOrderData} from 'src/types/appInterfaces';
import {
    IAddress,
    IEnvironment,
    IWalletPayCreateOrderRequest,
    IWalletPayOnShippingRequest
} from '@boldcommerce/checkout-frontend-library';
import {ICustomer} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';

import ApplePayPaymentContact = ApplePayJS.ApplePayPaymentContact;
import ApplePayShippingMethod = ApplePayJS.ApplePayShippingMethod;
import IGoogleAddress = google.payments.api.Address
import GooglePayIntermediateAddress = google.payments.api.IntermediateAddress
import GooglePaySelectionOption = google.payments.api.SelectionOption

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
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        [key:string]: any,
    }
}

export interface IInitialState {
    screenWidth: number,
    languageIso: string,
    callApiAtOnEvents: boolean,
    autocompleteService: string,
    billingType: string,
    discountText: string,
    isExpressPaySectionEnable: boolean,
    isOnePageTheme: boolean,
    allowNavigation: boolean,
    paymentComponentType: string,
    epsBoldPayment: IEpsPayments | null,
}

export interface IEpsPaymentInformation {
    payment_id: string;
}

export interface IEpsTotals {
    order_total: number;
    order_balance: number;
    shipping_total: number;
    discounts_total: number;
    fees_total: number;
    taxes_total: number;
}

export interface ITokenizePayload {
    customer?: Pick<ICustomer, 'first_name'|'last_name'|'email_address'>
    shipping_address?: IAddress,
    billing_address?: IAddress,
    totals?: IEpsTotals,
    client_secret_token?: string,
}

export interface IOrderTotalPayload {
    order_total: number;
}

export interface IEpsPayments {
    renderPayments(elementId: string): Promise<void>;
    renderWalletPayments(elementId: string, options?: IWalletOptions): Promise<void>;
    tokenize(tokenizePayload?: ITokenizePayload): Promise<IEpsPaymentInformation>;
    getDataRequirements(): Array<IRequirementDataType>;
    isScaRequired(): boolean;
    clearErrors(): void;
    updateOrderTotal?(orderTotalPayload: IOrderTotalPayload): void;
}

export interface IWalletOptions {
    shopName: string;
    isPhoneRequired: boolean;
    fastlane: boolean;
    allowedCountryCodes: string[];
}

export interface IEpsInitialOrderGateway {
    gateway_id: number;
    auth_token: string;
    currency: string;
}

export interface IEpsInitialData {
    group_label: string;
    trace_id: string;
    eps_url: string;
    eps_bucket_url: string;
    payment_gateways: Array<IEpsInitialOrderGateway>;
    callbacks?: IPaymentsCallbacks
}

export type IGatewayType =
    'bold_test' |
    'braintree' |
    'stripe' |
    'adyen' |
    'authorize_net' |
    'ppcp' |
    'spreedly';

export type IRequirementDataType =
    'customer' |
    'shipping_address' |
    'shipping_options' |
    'billing_address' |
    'totals' |
    'items' |
    'client_secret_token';

export interface IPaymentsCallbacks {
    onCreatePaymentOrder: (type: IGatewayType, payload: IWalletPayCreateOrderRequest) => Promise<IOnCreatePaymentOrderResponse>;
    onUpdatePaymentOrder: (type: IGatewayType, payload: IWalletPayOnShippingRequest | IApplePayOnUpdatePayload | IGooglePayOnUpdatePayload) => Promise<Record<string, unknown> | IOrderDataPayload>;
    onRequireOrderData: (types: Array<IRequirementDataType>) => Promise<IOrderDataPayload>;
    onApprovePaymentOrder: (type: IGatewayType, paymentInformation: IPaymentInformation, payload: Record<string, unknown>) => Promise<void>;
    onScaPaymentOrder: (type: IGatewayType, payload: IOnScaPaymentOrderPayload) => Promise<IOnScaPaymentOrderResponse>;
    onDeletePaymentMethod: (payload: IOnDeletePaymentMethodPayload) => Promise<IOnDeletePaymentMethodResponse>;
    onUpdateVisuals?: (payload: IOnUpdateVisuals) => Promise<void>;
}

export interface IApplePayOnUpdatePaymentDataPayload {
    payment_type: 'apple';
    locale: string;
    order_id?: string;
    shipping_address?: ApplePayPaymentContact;
    shipping_options?: ApplePayShippingMethod;
}

export interface IApplePayOnUpdatePayload {
    gateway_type: string;
    gateway_id?: number;
    require_order_data?: Array<IRequirementDataType>;
    payment_data: IApplePayOnUpdatePaymentDataPayload;
}

export interface IApplePayOnApprovePaymentDataPayload {
    payment_type: 'apple';
    locale: string;
    order_id?: string;
    shipping_address?: ApplePayPaymentContact;
    billing_address?: ApplePayPaymentContact;
}

export interface IApplePayOnApprovePayload {
    gateway_type: string;
    gateway_id?: number;
    payment_data: IApplePayOnApprovePaymentDataPayload;
}

export interface IGooglePayOnApprovePaymentDataPayload {
    payment_type: 'google';
    is_wallet_pay?: boolean;
    locale: string;
    order_id?: string;
    email?: string;
    shipping_address?: IGoogleAddress;
    billing_address?: IGoogleAddress;
    customer?: Pick<ICustomer, 'first_name'|'last_name'|'email_address'>;
}

export interface IGooglePayOnApprovePayload {
    gateway_type: string;
    gateway_id?: number;
    payment_data: IGooglePayOnApprovePaymentDataPayload;
}

export interface IBraintreePaypalOnApproveCustomer {
    first_name: string;
    last_name: string;
    email_address: string;
    phone?: string | undefined;
}

export interface IBraintreePaypalOnApprovePayload {
    gateway_type: string;
    gateway_id?: number;
    payment_data: IBraintreePaypalOnApproveDataPayload;
}

export interface IBraintreePaypalOnApproveAddress {
    line1: string;
    line2?: string | undefined;
    city: string;
    state: string;
    postalCode: string;
    countryCode: string;
    phone?: string | undefined;
    recipientName?: string | undefined;
}

export interface IBraintreePaypalOnApproveDataPayload {
    payment_type: 'paypal';
    locale: string;
    shipping_address?: IBraintreePaypalOnApproveAddress;
    billing_address?: IBraintreePaypalOnApproveAddress;
    is_wallet_pay: boolean,
    customer: IBraintreePaypalOnApproveCustomer;
}


export interface IOrderDataTotals {
    order_total: number;
    order_balance: number;
    shipping_total: number;
    discounts_total: number;
    fees_total: number;
    taxes_total: number;
}

export interface IOrderDataItem {
    amount: number;
    label: string;
}

export interface IOrderDataPayload {
    customer?: Pick<ICustomer, 'first_name'|'last_name'|'email_address'>;
    shipping_address?: IAddress;
    shipping_options?: Array<IShippingOption>;
    billing_address?: IAddress;
    totals?: IOrderDataTotals;
    items?: Array<IOrderDataItem>;
}

export interface IShippingOption {
    label: string;
    amount: number;
    id: string;
    is_selected: boolean;
}

export interface IOnUpdateVisuals {
    fullscreen: boolean;
}

export interface IOnScaPaymentOrderPayload {
    order_id?: string;
    gateway_id?: number;
}

export interface IOnScaPaymentOrderResponse {
    card?: Record<string, unknown>;
}

export interface IPaymentInformation {
    payment_id: string;
}

export interface IOnCreatePaymentOrderResponse {
    payment_data: {
        id: string;
    }
}

export interface IOnDeletePaymentMethodPayload {
    gateway_id: string;
    public_id: string;
}

export interface IOnDeletePaymentMethodResponse {
    gateway_id: string;
    public_id: string;
}

export interface IEpsPaymentsConstructor {
    new(initialData: IEpsInitialData): IEpsPayments;
    (initialData: IEpsInitialData): IEpsPayments;
    readonly prototype: IEpsPayments;
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

export interface IGooglePayOnUpdatePaymentDataPayload {
    payment_type: 'google';
    locale: string;
    order_id: string;
    shipping_address?: IGoogleAddress | GooglePayIntermediateAddress | undefined;
    shipping_options?: GooglePaySelectionOption | undefined;
}

export interface IGooglePayOnUpdatePayload {
    gateway_type: string;
    gateway_id?: number;
    require_order_data?: Array<IRequirementDataType>;
    payment_data: IGooglePayOnUpdatePaymentDataPayload;
}

export type IBraintreePaypalShippingAddress = {
    city: string;
    state: string;
    country_code: string;
    postal_code: string;
};

export type ShippingOptionType = 'SHIPPING' | 'PICKUP';

export type IBraintreePaypalSelectedShippingOption = {
    label: string;
    type: ShippingOptionType;
    amount: {
        currency_code: string;
        value: string;
    };
};

export interface IBraintreePaypalOnUpdatePaymentDataPayload {
    payment_type: 'paypal';
    locale: string;
    shipping_address?: IBraintreePaypalShippingAddress;
    shipping_options?: IBraintreePaypalSelectedShippingOption;
}

export interface IBraintreePaypalOnUpdatePaymentPayload {
    gateway_type: string;
    gateway_id?: number;
    require_order_data?: Array<IRequirementDataType>;
    payment_data: IBraintreePaypalOnUpdatePaymentDataPayload;
}

export interface IGetFirstAndLastName {
    firstName: string;
    lastName: string;
}

export interface IStripeAddress {
    city?: string,
    country?: string
    dependentLocality?: string
    organization?: string
    phone?: string
    postalCode?: string
    recipient: string
    region?: string
    sortingCode?: string
    addressLine?: Array<string>
}

export interface IStripeCard {
    address_city: string,
    address_country: string,
    address_line1: string,
    address_line1_check: string,
    address_line2: string,
    address_state: string,
    address_zip: string,
    address_zip_check: string,
    brand: string,
    country: string,
    dynamic_last4: string,
    exp_month: number,
    exp_year: number,
    funding: string,
    id: string,
    last4: string,
    name: string,
    object: string,
    tokenization_method: string,
    currency: string,
    cvc_check: string,
}

export interface IOnUpdateStripePayload {
    gateway_type: string;
    gateway_id?: number;
    require_order_data?: Array<IRequirementDataType>;
    payment_data: {
        shipping_address?: IStripeAddress;
        shipping_options?: GooglePaySelectionOption | undefined;
    };
}

export interface IOnApproveStripePayload {
    gateway_type: string;
    gateway_id?: number;
    require_order_data?: Array<IRequirementDataType>;
    payment_data: {
        shipping_address: IStripeAddress;
        card: IStripeCard;
        shipping_options?: GooglePaySelectionOption | undefined;
        customer: {
            payerEmail: string,
            payerName: string,
            payerPhone: string,
        }
    };
}
