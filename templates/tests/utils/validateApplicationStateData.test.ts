import {validateApplicationStateData} from 'src/utils';
import {
    IApplicationState,
    IApplicationStateCustomer,
    IApplicationStateDiscount,
    IApplicationStateLineItem,
    IApplicationStateOrderMetaData,
    IApplicationStatePayment,
    IApplicationStateSelectShippingLine,
    IApplicationStateShipping,
    IApplicationStateTax
} from 'src/types';


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
        id: ''
    };

    const appData = {
        customer: {} as IApplicationStateCustomer,
        addresses: {
            billing: billingAddress,
            shipping: defaultAddress,
        },
        line_items: [] as Array<IApplicationStateLineItem>,
        shipping: {
            selected_shipping: defaultShipping,
            available_shipping_lines: [] as Array<IApplicationStateSelectShippingLine>,
            taxes: [],
            discounts: [],
        } as IApplicationStateShipping,
        taxes: [] as Array<IApplicationStateTax>,
        discounts: [] as Array<IApplicationStateDiscount>,
        payments: [] as Array<IApplicationStatePayment>,
        order_total: 0,
        resumable_link: '',
        created_via: '',
        order_meta_data: {} as IApplicationStateOrderMetaData
    } as IApplicationState;

    const expected = {
        customer: {} as IApplicationStateCustomer,
        addresses: {
            billing: billingAddress,
            shipping: defaultAddress,
        },
        line_items: [] as Array<IApplicationStateLineItem>,
        shipping: {
            selected_shipping: defaultShipping,
            available_shipping_lines: [] as Array<IApplicationStateSelectShippingLine>,
            taxes: [],
            discounts: [],
        } as IApplicationStateShipping,
        taxes: [] as Array<IApplicationStateTax>,
        discounts: [] as Array<IApplicationStateDiscount>,
        payments: [] as Array<IApplicationStatePayment>,
        order_total: 0,
        resumable_link: '',
        created_via: '',
        order_meta_data: {} as IApplicationStateOrderMetaData
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
            name: 'call function with empty shipping and billing',
            appData: {
                ...appData,
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
