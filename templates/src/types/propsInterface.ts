import React, { ReactChild } from 'react';
import {
    IApplicationStateDiscount,
    IApplicationStateLineItem,
    IApplicationStatePayment,
    IApplicationStateSelectShippingLine,
    IApplicationStateTax, ICountryInformationProvince,
    IPaymentsSummaryClasses
} from 'src/types/appInterfaces';
import {ISelectList} from 'src/types/customerInterface';
import {IAddress, IFieldNamesSummary} from 'src/types/globalInterface';

export interface IAddressProps {
    title: string;
    type: string;
    showTitle: boolean;
    showSavedAddresses: boolean;
    handleChange?: (e) => void;
    handleBlur?: (e) => void;
    handleFocus?: (e) => void;
}

export interface IFieldSectionProps {
    title: string;
    showTitle: boolean;
    className?: string;
    accessory?: React.ReactNode;
}

export interface IFieldInputProps {
    placeholder: string;
    className: string;
    value: string;
    label?: string;
    helpText?: string;
    type?: string;
    id?: string;
    name?: string;
    errorMessage?: string | null;
    handleChange?: (e) => void;
    handleBlur?: (e) => void;
    handleFocus?: (e) => void;
}

export interface IFieldCheckboxProps {
    value: string;
    label?: string;
    checked? : boolean;
    className?: string;
    name?: string;
    errorMessage?: string | null;
    handleClick?: (e) => void;
    handleChange?: (e) => void;
    handleBlur?: (e) => void;
    handleFocus?: (e) => void;
}

export interface IFieldSelectProps {
    placeholder: string;
    className: string;
    value?: string;
    label?: string;
    id?: string;
    name?: string;
    isPlaceholderDisabled: boolean;
    options: Array<ISelectList>;
    errorMessage?: string | null;
    handleChange?: (e) => void;
    handleBlur?: (e) => void;
    handleFocus?: (e) => void;
}

export interface IAddressFieldInputProps {
    type: string;
    fieldId: string;
    className: string;
    placeholder: string;
    debounceApiCall: () => void
}

export interface IAddressFieldSelectProps{
    type: string;
    className: string;
    debounceApiCall: () => void
}

export interface ISavedAddressFieldSelectProps{
    type: string;
    className: string;
}

export interface ISavedAddressFieldRadioListProps{
    type: string;
}

export interface ISavedAddressFieldRadioProps{
    address: IAddress;
    checked?: boolean;
    handleChange?: (e) => void;
}

export interface INewAddressFieldRadioProps{
    type: string,
    label: string,
    checked?: boolean,
    handleChange?: (e) => void;
}

export interface IFieldRadioProps{
    value: string;
    label?: string | JSX.Element;
    checked? : boolean;
    className?: string;
    id?: string;
    name?: string;
    errorMessage?: string | null;
    handleClick?: (e) => void;
    handleChange?: (e) => void;
    handleBlur?: (e) => void;
    handleFocus?: (e) => void;
}

export interface ISummaryLineNonExpandable {
    eventName: string;
    hasBottom?: boolean;
    name: string;
    total: number;
    textAlign?: string;
}

export interface ISummaryLineExpandable {
    eventDeleteName?: string;
    eventToggleName: string;
    isExpanded?: boolean;
    hasBottom?: boolean;
    hasList?: boolean;
    hasDeleteButton?: boolean;
    total: number;
    textAlign?: string;
    content: Array<IApplicationStateSelectShippingLine | IApplicationStateDiscount | IApplicationStateTax | IApplicationStatePayment>;
    title: string;
}

export interface ISummaryLineExpanded {
    eventDeleteName?: string;
    amount: number;
    content: string;
    id: string;
    classes: IPaymentsSummaryClasses;
    textAlign?: string;
    hasDeleteButton?: boolean;
    itemId?: string;
}

export interface ISummarySection {
    orderCompleted: boolean;
}

export type ITaxesAmount = ISummarySection;

export interface ICartItemsProps {
    line_items: Array<IApplicationStateLineItem>;
    onUpdateQuantity?: (lineItemKey: string, quantity: number) => Promise<void>;
    quantityDisabled?: boolean;
}

export interface ICartItemProps {
    line_item: IApplicationStateLineItem;
    onUpdateQuantity?: (lineItemKey: string, quantity: number) => Promise<void>;
    quantityDisabled?: boolean;
}

export interface ISemiControlledNumberInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    value: number;
    onCommit: (value: number) => void;
}

export interface IAddressHookProps{
    placeholder: string;
    id: string;
    name: string;
    value: string;
    errorMessage?: string;
    handleChange: (e) => void;
    handleBlur?: () => void;
}

export interface IAddressProvinceHookProps extends IAddressHookProps{
    showProvince: boolean;
    label: string;
    provinceOptions: Array<ISelectList>;
}

export interface IAddressCountryHookProps extends IAddressHookProps{
    countryOptions: Array<ISelectList>;
    label: string;
}

export interface IAddressFieldHookProps extends IAddressHookProps{
    showField: boolean;
}

export interface IAddressPostalCodeAndProvinceDataProps {
    showPostalCode: boolean;
    showProvince: boolean;
    provinceLabel: string;
    province: Array<ICountryInformationProvince>
}

export interface IShippingLinesHookProps{
    selectedLine: IApplicationStateSelectShippingLine
    shippingLines: Array<IApplicationStateSelectShippingLine>
    noShippingAreaText: string
    shippingLinesLength: number
    handleChange: (e) => void
}

export interface ISavedAddressHookProps{
    id: string;
    title: string;
    label: string;
    placeholder: string;
    options: Array<ISelectList>;
    savedAddresses: Array<IAddress>;
    handleChange: (e) => void;
}

export interface IBreadcrumbsProps {
    active: number;
}

export interface IFooterProps {
    className?: string;
    backLinkOnClick?: (event) => void;
    backLinkText?: string;
    nextButtonText: string;
    nextButtonOnClick: () => void;
    nextButtonLoading?: boolean;
    nextButtonDisable?: boolean;
    contactUs?: boolean;
}

export interface IContactUsProps {
    className?: string;
}

export interface IOrderRecapProps {
    className?: string;
}

export interface IOrderRecapDisplayItemProps {
    className?: string;
    title: string;
    children: React.ReactNode;
}

export interface IGenericMessageSectionProps {
    className?: string;
    sectionTitle?: string;
    messageTitle: string;
    messageText: string;
}

export interface IUseGuestCustomer {
    email: string;
    getTerm: (term,section) => string;
    emailError: string | undefined;
    handleChange: (e) => void;
    handleBlurEmail?: (e) => void;
    handleCheckboxChange: () => void;
    acceptMarketingChecked: boolean;
    acceptMarketingHidden: boolean
}

export interface IBillingAddress {
    customBilling: string;
    handleChange: (e) => void;
    toggleBillingSameAsShipping: (e) => void,
    billingSame: string;
    billingTitle: string;
    billingDifferent: string;
    addressProps: IAddressProps
}

export interface ISummaryDiscountCode {
    discounts: Array<IApplicationStateDiscount>;
    discountError: string;
    buttonLoading: boolean;
    buttonDisabled: boolean;
    addDiscount: () => void;
    updateNewDiscountCode: (e) => void;
    discountCodeText: string;
    discountCodeInputText: string;
}

export interface ISummaryDiscountLine{
    discountCloseLoading: boolean,
    deleteElementFromState: (e, i) => void
    isLoading: boolean,
}

export interface IUseSummaryLineExpanded{
    textAlign: string,
    eventDeleteName: string,
    itemId: string,
    deleteElementFromState: (i ,e) => void,
    closeLoading: boolean,
    isLoading: boolean,
    formattedPrice: string,
}

export interface IUseSummaryLineExpandable{
    expand: boolean;
    classes: IPaymentsSummaryClasses;
    toggle: () => void;
    fieldNames: IFieldNamesSummary,
    formattedPrice: string,
}

export interface ILockedSectionProps{
    classNameSection: string
    className: string
    text: string
}

export interface ILoadingSectionProps{
    className: string,
    isLoading: boolean
}

export interface IUseCustomerPageProp extends IFooterProps{
    active: number
}

export interface IUseCartSummary {
    expandSummary: boolean;
    totals: number;
    showSummary: boolean;
    toggleSummary: () => void;
    lineItems: Array<IApplicationStateLineItem>
}

export interface IUseGetThankYou {
    returnUrl: () => void;
    thankYouTitle: string;
    terms: Record<string, string>;
    isGeneric: boolean;
    websiteName: string;
}

export interface IUseGetCartItem {
    quantity: number;
    incrementQuantity: () => void;
    decrementQuantity: () => void;
    updateQuantity: (quantity: number) => void;
}

export interface IUseGetShippingLines {
    loading: boolean;
    isValidAddress: boolean;
    notValidText: string;
    fieldSectionText: string;
}

export interface IUseGetPaymentSection {
    loading: boolean;
    isValidAddress: boolean;
    isValidShippingLine: boolean;
    notValidText: string;
    fieldSectionText: string;
    isValidPigiLoad: boolean;
    onLoad: () => void;
}

export interface IUseGetOrderRecap {
    noOrderData: boolean;
    shippingAddress: IAddress;
    billingAddress: IAddress;
    shippingDescription: string;
    terms: Record<string, string>;
}

export interface IUseOutOfStock {
    returnUrl: () => void;
    terms: Record<string, string>;
    websiteName: string;
}

export interface IUseSessionExpired {
    returnUrl: () => void;
    terms: Record<string, string>;
}

export interface IUseContactUs {
    needHelp: string;
    contactUs: string;
}

export interface IUseFooterRights {
    shopAlias: string;
    footerRights: string;
}

export interface IUseGetDisplayPaymentMethods {
    paymentsMethod: Array<IApplicationStatePayment>;
    terms: Record<string, string>;
}


export type IUsePaymentPage = IFooterProps;

export interface ITitle {
    isMobile: boolean;
}

export interface IUseLogin {
    loginUrl: (event) => void;
    email: string;
    handleCheckboxChange: () => void;
    acceptMarketingChecked: boolean;
    acceptMarketingHidden: boolean;
}

export interface IUseSupportedLanguages {
    languagesOptions: Array<ISelectList>;
    value: string;
    handleChange: (e) => void;
}

export interface IUseGetCurrencyInformation {
    currency: string,
    currencySymbol: string,
    formattedPrice: string,
}
export interface INavigationHeadingProps {
    className?: string;
    text: string;
    navigation?: () => void;
    secondary?: React.ReactElement;
}

export interface IUseIndexPageProps {
    loginUrl: (event) => void;
    loginText: string;
    orderTotal: number;
    websiteName: string;
    lineItems: Array<IApplicationStateLineItem>;
    summaryHeadingText: string;
    email: string;
    shippingHeadingText: string;
    address: IAddress;
    paymentHeadingText: string;
    quantityDisabled: boolean;
    checkoutOnClick: () => Promise<void>;
    updateLineItemQuantity: (lineItemKey: string, qty: number) => Promise<void>;
}

export interface ICondensedSectionProps {
    className?: string;
    navigationHeadingProps: INavigationHeadingProps;
    children?: ReactChild | Array<ReactChild>
}

export interface ICloseableHeaderProps {
    className?: string;
    title: string;
    onClose: () => void;
}
export interface IUseExpandableDiscount {
    expandDiscount: boolean;
    toggleDiscount: () => void;
    discountCodeInputText: string;
}

export interface ICondensedShippingProps {
    address: IAddress;
    showMethod?: boolean;
    showPhone?: boolean;
}
