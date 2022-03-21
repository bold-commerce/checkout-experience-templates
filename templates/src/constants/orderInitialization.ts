import {IOrderInitialization} from 'src/types';
import {autocompleteServices} from 'src/constants';

export const defaultOrderInitialization: IOrderInitialization = {
    appSetting: {
        screenWidth: window.innerWidth,
        languageIso: 'en',
        callApiAtOnEvents: true,
        autocompleteService: autocompleteServices.GOOGLE_AUTOCOMPLETE,
        billingType: 'same',
        discountText: '',
        pigiDisplaySca: false
    },
    isLoading: {
        pigiIframe: false,
        customerPageButton: false,
        shippingPageButton: false,
        discountButton: false,
        discountClose: false,
        shippingLines: false,
    },
    isButtonDisable: {
        customerPageButton: false,
        shippingPageButton: true,
    },
    isValid: {
        shippingAddress: false,
        updatedShippingAddress: false,
        orderProcessed: false,
    },
    overlay: {
        inverted: false,
        shown: false,
        icon: '',
        header: '',
        subHeader: '',
        content: ''
    },
    errors: [],
    data: {
        jwt_token: '',
        public_order_id: '',
        application_state: {
            customer: {
                platform_id: null,
                public_id: null,
                first_name: '',
                last_name: '',
                email_address: '',
                accepts_marketing: false,
                saved_addresses: []
            },
            addresses: {
                shipping: {
                    first_name: '',
                    last_name: '',
                    address_line_1: '',
                    address_line_2: '',
                    country: '',
                    city: '',
                    province: '',
                    country_code: '',
                    province_code: '',
                    postal_code: '',
                    business_name: '',
                    phone_number: '',
                },
                billing: {
                    first_name: '',
                    last_name: '',
                    address_line_1: '',
                    address_line_2: '',
                    country: '',
                    city: '',
                    province: '',
                    country_code: '',
                    province_code: '',
                    postal_code: '',
                    business_name: '',
                    phone_number: '',
                }
            },
            payments: [],
            discounts: [],
            taxes: [],
            order_total: 0,
            line_items: [],
            shipping: {
                selected_shipping: {},
                available_shipping_lines: [],
                taxes: [],
                discounts: [],
            },
            order_meta_data: {
                cart_parameters: [],
                note_attributes: [],
                notes: '',
                tags: [],
            },
            resumable_link: '',
            created_via: '',
        },
        initial_data: {
            shop_name: '',
            supported_languages: [],
            country_info: [],
            general_settings: {
                checkout_process: {
                    company_name_option: '',
                    phone_number_required: false,
                    accepts_marketing_checkbox_option: ''
                },
                address_autocomplete: {
                    provider: null,
                    api_key: null,
                },
            }
        }
    },
};
