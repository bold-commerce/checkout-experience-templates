import {IAddress, IInitialState, IProductData} from 'src/types/globalInterface';
import {IError} from 'src/types/translationInterfaces';

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

export interface IApplicationStateShipping {
    selected_shipping: Partial<IApplicationStateSelectShippingLine>,
    available_shipping_lines: Array<IApplicationStateSelectShippingLine>,
    taxes: Array<IApplicationStateTax>,
    discounts: Array<IApplicationStateDiscount>
}

export interface IApplicationStateShippingAvailableLine {
    id: number,
    line: IApplicationStateSelectShippingLine
}

export interface IApplicationStateFee {
    amount: number,
    name: string
}

export interface IApplicationStateTax {
    value: number,
    name: string,
    is_included: boolean
}

export interface IApplicationStateDiscount {
    code: string,
    text: string,
    value: number,
    valid: boolean
}

export interface IApplicationStatePayment {
    gateway_public_id: string,
    amount: number,
    currency: string,
    tag: string
    type: string,
    display_string: string,
    id: string,
    token: string,
    retain: boolean,
    friendly_brand?: string,
    lineText?: string,
    value: number,
    brand: string,
}

export interface ICountryInformationProvince {
    iso_code: string,
    name: string,
    valid_for_shipping: boolean,
    valid_for_billing: boolean
}

export interface ICountryInformation {
    iso_code: string,
    name: string,
    show_province: boolean,
    province_label: string,
    show_postal_code: boolean,
    provinces: Array<ICountryInformationProvince>,
    valid_for_shipping: boolean,
    valid_for_billing: boolean
}

export interface ISupportedLanguage{
    id: number,
    shop_id: number,
    iso_language: string,
    language_name: string,
    language_blob: string,
    is_default: boolean,
    out_of_date: number,
    enabled: number,
    source: null | string,
    created_at: string | null,
    updated_at: string | null,
    deleted_at: string | null,
    name: string,
    shop_language_id: number
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

export interface IGeneralSettings{
    checkout_process: ICheckoutProcess,
    address_autocomplete: IAddressAutoComplete,
}

export interface IInitializeEndpointData {
    jwt_token: string,
    public_order_id: string,
    initial_data: IInitialData,
    application_state: IApplicationState
}

export interface IInitializeOrderData {
    data: IInitializeEndpointData
}


export interface IInitialData {
    shop_name: string,
    country_info: Array<ICountryInformation>,
    supported_languages: Array<ISupportedLanguage>
    general_settings: IGeneralSettings
}

export interface IApplicationState {
    customer: IApplicationStateCustomer,
    addresses: {
        billing: Partial<IAddress>,
        shipping: Partial<IAddress>
    },
    line_items: Array<IApplicationStateLineItem>,
    shipping: IApplicationStateShipping,
    taxes: Array<IApplicationStateTax>,
    discounts: Array<IApplicationStateDiscount>,
    payments: Array<IApplicationStatePayment>,
    order_total: number,
    order_meta_data: IApplicationStateOrderMetaData,
    resumable_link: string,
    created_via: string
}

export interface IApplicationStateLineItem {
    product_data: IProductData,
    taxes: Array<IApplicationStateTax>,
    fees: Array<IApplicationStateFee>,
    discounts: Array<IApplicationStateDiscount>
}

export interface IApplicationStateOrderMetaData {
    cart_parameters: Array<string>
    note_attributes: Array<string>
    notes: string,
    tags: Array<string>
}

export interface IApplicationStateCustomer {
    platform_id: string | null,
    public_id: string | null,
    first_name: string,
    last_name: string,
    email_address: string,
    accepts_marketing: boolean,
    saved_addresses: Array<IAddress>
}

export interface ITotals {
    totalSubtotal: number,
    totalOrder: number,
    totalAmountDue: number,
    totalPaid: number,
    totalDiscounts: number,
    totalTaxes: number,
    totalFees: number
}

export interface IApplicationStateSelectShippingLine {
    id: string,
    description: string,
    amount: number
}

export interface IOverlay{
    shown: boolean,
    inverted: boolean,
    icon?: string,
    header?: string,
    subHeader?: string,
    buttonText?: string
    content?: string
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
    orderProcessed: boolean
}

export interface IOrderInitialization {
    appSetting: IInitialState,
    overlay: IOverlay,
    isLoading: IIsLoading,
    isButtonDisable: IIsButtonDisable
    isValid: IIsValid,
    errors: Array<IError>
    data: IInitializeEndpointData
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
