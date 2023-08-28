export interface IFlow {
    flow_id: string;
    flow_type: string;
    is_test_mode: boolean;
}

export interface IMetaConfig {
    partner_id: string;
    partner_merchant_id: string;
    public_gateway_id: string;
    acquirer_country_code: string;
}

export type IMetaFlowSettings = IFlow & IMetaConfig;

export type IMetaPaymentMode = 'TEST' | 'LIVE';

export interface IMetaSupportedContainersProperties {
    'require-cvv': boolean
}

export interface IMetaPaymentConfiguration {
    mode: IMetaPaymentMode;
    partnerId: string;
    partnerMerchantId: string;
    acquirerCountryCode: string;
    supportedContainers: Record<'basic-card-v1' | 'ecom-token-v1', IMetaSupportedContainersProperties | Record<string, never>>;
    containerContext: string;
    requestId?: string;
    userID?: string;
    pixelId?: string;
    eventId?: string;
    uxFlags?: Array<'DISABLE_PROACTIVE_CHECKOUT' | 'PIXEL_COOKIE_DETECTED' | 'META_CHECKOUT'>;
    merchantName?: string;
    sessionUsage?: 'ON_SESSION' | 'OFF_SESSION';
}

export interface IMetaPaymentCurrencyAmount {
    currency: string; // ISO 4217. Currently, only USD is supported for currency.
    value: string; // if currency is USD, express a value of $19.99 as 19.99
}

export interface IMetaPaymentItem {
    amount: IMetaPaymentCurrencyAmount;
    label: string;
    secondaryLabel?: string;
    quantity?: number;
    imageURI?: string;
    contentId?: string;
    contentType?: string;
    contentCategory?: string;
}

export interface IMetaSummaryPaymentItem {
    amount: IMetaPaymentCurrencyAmount;
    summaryItemType: 'SUBTOTAL' | 'ESTIMATED_TAX' | 'FULFILLMENT' | 'OFFER' | 'FEE';
    label: string;
}

export interface IMetaOffer {
    code: string;
    label: string;
}

export interface IMetaPaymentAddress {
    addressLine: Array<string>;
    city: string;
    region: string; // The region or state of the address.
    country: string;
    postalCode: string;
    recipient?: string;
    organization?: string;
    phone?: string;
    dependentLocality?: string; // An additional locality name for the address, such as a neighborhood or borough.
    sortingCode?: string; // An additional postal code for the address that is used by post offices in some locations.
}

export interface IMetaFulfillmentOption {
    id: string;
    label: string;
    amount: IMetaPaymentCurrencyAmount;
    dateTimeRangeStart?: Date;
    dateTimeRangeEnd?: Date;
}

export interface IMetaDistance {
    value: number;
    unit: 'miles' | 'kilometers';
}

export interface IMetaPickupFulfillmentOption extends IMetaFulfillmentOption {
    pickupLocationAddress: IMetaPaymentAddress;
    pickupStoreAvailability: boolean;
    pickupStoreDistance?: IMetaDistance;
}

export interface IMetaPickupInfo {
    pickupRadiusZipCode?: string;
    pickupName?: string;
    pickupEmail?: string;
    pickupPhone?: string;
    pickupNotes?: string;
}

export interface IMetaPaymentDetails {
    total: IMetaPaymentItem;
    summaryItems?: Array<IMetaSummaryPaymentItem>;
    displayItems?: Array<IMetaPaymentItem>;
    offers?: Array<IMetaOffer>;
    billingAddress?: IMetaPaymentAddress;
    shippingAddress?: IMetaPaymentAddress;
    fulfillmentOptions?: Array<IMetaFulfillmentOption | IMetaPickupFulfillmentOption>;
    fulfillmentOptionId?: string;
    pickupInfo?: IMetaPickupInfo;
}

export interface IMetaPaymentOptions {
    requestPayerEmail: boolean;
    requestPayerPhone: boolean;
    requestShipping: boolean;
    requestBillingAddress: boolean;
    allowOfferCodes: boolean;
    requestPickupName?: boolean;
    requestPickupEmail?: boolean;
    requestPickupPhone?: boolean;
    ctaType?: 'PAY' | 'CONTINUE'; // default is PAY
    fulfillmentType?: 'SHIPPING' | 'PICKUP'; // default is SHIPPING
    billingAddressMode?: 'MIN' | 'FULL'; // default is MIN
}

export interface IMetaPaymentRequest {
    paymentConfiguration: IMetaPaymentConfiguration;
    paymentDetails: IMetaPaymentDetails;
    paymentOptions: IMetaPaymentOptions;
}

export interface IMetaPaymentContainer {
    mode: IMetaPaymentMode;
    containerId: string;
    containerType: 'basic-card-v1' | 'ecom-token-v1';
    containerData: string;
}

export interface IMetaPaymentResponse {
    requestId: string;
    container: IMetaPaymentContainer;
    containerDescription: string;
    payerEmail?: string;
    payerPhone?: string;
    fulfillmentOptionId?: string;
    pickupName?: string;
    pickupEmail?: string;
    pickupPhone?: string;
    shippingAddress?: IMetaPaymentAddress;
    billingAddress?: IMetaPaymentAddress;
    offers?: Array<IMetaOffer>;
}

export interface IMetaThemeOptions {
    theme: 'light' | 'dark';
}

export type IMetaAvailability = 'AVAILABLE' | 'NOT_AVAILABLE' | 'MIGHT_BE_AVAILABLE' | 'NOT_SUPPORTED';

export type IMetaPaymentDetailChangeType = 'FULFILLMENT_OPTION_ID' | 'SHIPPING_ADDRESS' | 'BILLING_ADDRESS' | 'OFFERS' | 'PICKUP_ZIP_CODE';

export interface IMetaPaymentDetailsChangedEvent {
    changeTypes: Array<IMetaPaymentDetailChangeType>;
    paymentDetails: IMetaPaymentDetails;
}

export type IMetaPaymentDataErrorReason =
    'INVALID_PAYMENT_DATA' |
    'INVALID_SHIPPING_ADDRESS' |
    'INVALID_FULFILLMENT_OPTION' |
    'INVALID_BILLING_ADDRESS' |
    'INVALID_OFFER_CODE' |
    'OUT_OF_SERVICE_AREA' |
    'GENERIC_FAILURE' |
    'OTHER_ERROR' |
    'TIMEOUT';

export type IMetaPaymentDataErrorField =
    'city' |
    'country' |
    'dependentLocality' |
    'organization' |
    'postalCode' |
    'recipient' |
    'region' |
    'sortingCode' |
    'addressLine' |
    'payerPhone' |
    'payerEmail' |
    'offers' |
    'fulfillmentOptionId';

export interface IMetaPaymentDataError {
    reason: IMetaPaymentDataErrorReason;
    message?: string;
    field?: IMetaPaymentDataErrorField;
}

export interface IMetaPaymentDetailsUpdate {
    paymentDetails: IMetaPaymentDetails;
    errors?: Array<IMetaPaymentDataError>;
}

export interface IMetaPaymentAuthorizationResult {
    authorizationState: 'SUCCESS' | 'ERROR';
    error?: IMetaPaymentDataError;
    orderId?: string;
}

export interface IMetaPaymentClient {
    getAvailability(paymentConfig: IMetaPaymentConfiguration): Promise<IMetaAvailability>;
    renderButton(container: string, providePaymentRequest: () => IMetaPaymentRequest, onResponse: (responsePromise: Promise<IMetaPaymentResponse>) => void, _options?: IMetaThemeOptions): Promise<void>;
    getPaymentResponse(request: IMetaPaymentRequest): Promise<IMetaPaymentResponse>;
    attemptProactivePayment(request: IMetaPaymentRequest): Promise<IMetaPaymentResponse>;
    onPaymentDetailsChanged?(event: IMetaPaymentDetailsChangedEvent): Promise<IMetaPaymentDetailsUpdate>;
    onPaymentConsent?(event: IMetaPaymentResponse): Promise<IMetaPaymentAuthorizationResult>;
}

export interface IMetaPaymentClientConstructor extends Error{
    new(clientVersion: string): IMetaPaymentClient;
    (clientVersion: string): IMetaPaymentClient;
    readonly prototype: IMetaPaymentClient;
}

export type IMetaPaymentErrorCode = 'ABORTED' | 'TIMEOUT' | 'INVALID_REQUEST' | 'MERCHANT_ACCOUNT_ERROR' | 'INTERNAL_ERROR' | 'DISMISSED_FOR_SESSION';

export interface IMetaPaymentError {
    readonly code: IMetaPaymentErrorCode | string;
    readonly message: string;
}

export interface IMetaPaymentErrorConstructor {
    new(code: IMetaPaymentErrorCode, message: string): IMetaPaymentError;
    (code: IMetaPaymentErrorCode, message: string): IMetaPaymentError;
    readonly prototype: IMetaPaymentError;
}

export interface IMetaPay {
    PaymentClient: IMetaPaymentClientConstructor
    PaymentError: IMetaPaymentErrorConstructor
}

export interface IMetaFlow {
    metaPay: IMetaPay | null;
    metaPaymentClient: IMetaPaymentClient | null
}
