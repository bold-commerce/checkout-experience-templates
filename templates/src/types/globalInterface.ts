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

export interface IAddress {
    id?: string | null
    first_name: string,
    last_name: string,
    address_line_1: string,
    address_line_2: string,
    country: string,
    city: string,
    province: string,
    country_code: string,
    province_code: string,
    postal_code: string,
    business_name: string,
    phone_number: string
}

export interface IProductData {
    id: string,
    title: string,
    product_title: string,
    image_url: string,
    properties: Record<string, string>,
    description: string,
    quantity: number,
    price: number,
    total_price: number,
    visible: boolean,
    line_item_key: string,
    barcode: string,
    compare_at_price: number,
    weight: number,
    weight_unit: string,
    product_id: string,
    variant_id: string,
    requires_shipping: boolean,
    sku: string,
    taxable: boolean,
    tags: string,
    vendor: string
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
