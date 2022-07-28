import {IInitialState} from 'src/types/globalInterface';
import {IError} from 'src/types/translationInterfaces';
import {IInitializeOrderResponse} from '@bold-commerce/checkout-frontend-library';

export interface IPaymentsSummaryClasses {
    container: string,
    title: {
        container: string,
        arrow: string,
        text: string,
        price: string
    },
    list: {
        ul: string,
        li: string,
        text: string,
        price: string,
        delete: string,
        loading: string,
        loadingSpan: string
    }
}

export interface ICheckoutProcess{
    company_name_option: string,
    phone_number_required: boolean,
    accepts_marketing_checkbox_option: string
}

export interface IAddressAutoComplete{
    provider: string | null,
    api_key: string | null,
}


export interface IInitializeOrderData {
    data: IInitializeOrderResponse
}

export interface ITotals {
    totalSubtotal: number,
    totalOrder: number,
    totalAmountDue: number,
    totalPaid: number,
    totalDiscounts: number,
    totalTaxes: number,
    totalFees: number,
    totalAdditionalFees: number
}

export interface IOverlay{
    shown: boolean,
    inverted: boolean,
    icon?: string,
    header?: string,
    subHeader?: string,
    buttonText?: string,
    content?: string,
    showCustomContent?: boolean
}

export interface IIsLoading{
    pigiIframe: boolean
    customerPageButton: boolean
    shippingPageButton: boolean
    discountButton: boolean
    discountClose: boolean
    shippingLines: boolean
}

export interface IIsButtonDisable {
    customerPageButton: boolean
    shippingPageButton: boolean
}

export interface IIsValid{
    shippingAddress: boolean
    updatedShippingAddress: boolean
    billingAddress: boolean
    orderProcessed: boolean
    shippingLine: boolean
    pigi: boolean
    scaToken: boolean
}

export interface IOrderInitialization {
    appSetting: IInitialState,
    overlay: IOverlay,
    isLoading: IIsLoading,
    isButtonDisable: IIsButtonDisable
    isValid: IIsValid,
    isSessionInitialized: boolean,
    errors: Array<IError>
    data: IInitializeOrderResponse
}

export interface ISummaryDiscountLineProps {
    code: string,
    amount: number
}

export interface ILoqateSettingsOptions {
    key: string,
    countries?: ILoqateCountriesList
}

export interface ILoqateCountriesList {
    codesList: string
}

export interface IAutocompleteData {
    address1: string,
    address2?: string,
    company?: string,
    city: string,
    postalCode: string,
    province: string,
    provinceCode: string,
    country: string,
    countryCode: string,
}

export interface IPigiResponsesPayload {
    success: boolean,
    height: number,
    step?: 'DISPLAYED' | 'COMPLETED' | 'FAILED',
    paymentType?: string,
}

export interface IPigiHandleScaSteps {
    DISPLAYED: string;
    COMPLETED: string;
    FAILED: string;
}

export interface IPigiPaymentTypes {
    GIFT_CARD: string;
    PAYPAL: string;
}

export interface IPigiResponseData {
    responseType: string,
    payload: IPigiResponsesPayload,
}

export interface IEventType {
    publicOrderId: string,
    timestamps: IFrontEndEvent,
}

export interface IFrontEndEvent {
    CheckoutExperienceStartRendering?: string,
    CheckoutExperienceDomInteractive?: string,
    CheckoutExperienceDomContentLoadedEventStart?: string,
    CheckoutExperienceDomContentLoadedEventEnd?: string,
    CheckoutExperienceDomLoading?: string,
    CheckoutExperienceComplete?: string,
    CheckoutExperienceShippingLinesDisplayed?: string,
    CheckoutExperiencePigiInitialized?: string,
    CheckoutExperienceThankYouPageDisplayed?: string,
}

export interface IPaymentIframe {
    onLoad: () => void;
}

// TODO - DELETE ONCE NEW ERROR FORMAT NOT NEEDE - CE-579
export interface INewApiErrorWarningResponse {
    code: string;
    details: INewApiErrorResponseErrorWarningMessage | Array<INewApiErrorResponseErrorWarningMessage>;
    message: string;
    type: string;
}

export interface INewApiErrorResponseErrorWarningMessage {
    error_message?: string;
    warning_message?: string;
    field: string;
}
// END TODO - CE-579
