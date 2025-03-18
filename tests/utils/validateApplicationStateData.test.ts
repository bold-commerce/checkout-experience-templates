import {validateApplicationStateData} from 'src/utils';
import {
    ICurrency,
    ICustomer, IDiscount,
    ILineItem, IOrderMetaData, IPayment,
    IShipping,
    IShippingLine,
    ITax
} from '@boldcommerce/checkout-frontend-library';
import {IApplicationState} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';
import {defaultCustomer} from 'src/constants';

describe('testing function validateApplicationStateData', () => {
    const defaultAddress = {
        address_line_1: '',
        address_line_2: '',
        business_name: '',
        city: '',
        country: '',
        country_code: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        postal_code: '',
        province: '',
        province_code: ''
    };
    const billingAddress = {
        address_line_1: '',
        address_line_2: '',
        business_name: '',
        city: '',
        country: '',
        country_code: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        postal_code: '',
        province: '',
        province_code: ''
    };

    const defaultShipping =  {
        amount : 0,
        description: '',
        id: '',
        code: '',
    };

    const currency: ICurrency = {
        iso_code: 'CAD',
        iso_numeric_code: 124,
        symbol: '$',
        format: '${{amount}}',
        has_decimal: true,
        show_iso_code: true
    };

    const display_currency: ICurrency = {
        iso_code: 'CAD',
        iso_numeric_code: 124,
        symbol: '$',
        format: '${{amount}}',
        has_decimal: true,
        show_iso_code: true
    };

    const appData = {
        customer: {} as ICustomer,
        addresses: {
            billing: billingAddress,
            shipping: defaultAddress,
        },
        line_items: [] as Array<ILineItem>,
        shipping: {
            selected_shipping: defaultShipping,
            available_shipping_lines: [] as Array<IShippingLine>,
            taxes: [],
            discounts: [],
        } as IShipping,
        taxes: [] as Array<ITax>,
        discounts: [] as Array<IDiscount>,
        payments: [] as Array<IPayment>,
        order_total: 0,
        order_balance: 0,
        resumable_link: '',
        created_via: '',
        currency: currency,
        display_currency: display_currency,
        display_exchange_rate: 1,
        is_processed: false,
        order_meta_data: {} as IOrderMetaData,
        link_to_cart: '',
        flow_id: null,
    } as IApplicationState;

    const expected = {
        customer: defaultCustomer,
        addresses: {
            billing: billingAddress,
            shipping: defaultAddress,
        },
        line_items: [] as Array<ILineItem>,
        shipping: {
            selected_shipping: defaultShipping,
            available_shipping_lines: [] as Array<IShippingLine>,
            taxes: [],
            discounts: [],
        } as IShipping,
        taxes: [] as Array<ITax>,
        discounts: [] as Array<IDiscount>,
        payments: [] as Array<IPayment>,
        order_total: 0,
        order_balance: 0,
        resumable_link: '',
        fees: [],
        currency: currency,
        display_currency: display_currency,
        display_exchange_rate: 1,
        created_via: '',
        is_processed: false,
        order_meta_data: {} as IOrderMetaData,
        link_to_cart: '',
        flow_id: null,
    } as IApplicationState;

    const dataArray = [
        {
            name: 'call function with proper data',
            appData: {
                ...appData,
                addresses: {
                    shipping: defaultAddress,
                    billing: billingAddress,
                },
                shipping: {
                    ...appData.shipping,
                    selected_shipping: defaultShipping
                }
            },
        },
        {
            name: 'call function with empty shipping and billing and customer',
            appData: {
                ...appData,
                customer: {},
                addresses: {
                    shipping: {},
                    billing: {},
                },
                shipping: {
                    ...appData.shipping,
                    selected_shipping: defaultShipping
                }
            },
        },
        {
            name: 'call function with null shipping and billing',
            appData: {
                ...appData,
                addresses: {
                    shipping: null,
                    billing: null,
                },
                shipping: {
                    ...appData.shipping,
                    selected_shipping: defaultShipping
                }
            },
        },
        {
            name: 'call function with empty SelectedShipping',
            appData: {
                ...appData,
                addresses: {
                    shipping: defaultAddress,
                    billing: billingAddress,
                },
                shipping: {
                    ...appData.shipping,
                    selected_shipping: {}
                }
            },
        },
    ];

    test.each(dataArray)(
        '$name',
        ({appData}) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const result = validateApplicationStateData(appData);
            expect(result).toStrictEqual(expected);
        });
});
