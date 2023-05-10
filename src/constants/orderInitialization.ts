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
        pigiDisplaySca: false,
        isExpressPaySectionEnable: false
    },
    isLoading: {
        pigiIframe: false,
        customerPageButton: false,
        shippingPageButton: false,
        discountButton: false,
        discountClose: false,
        shippingLines: false,
    },
    externalPaymentGateways: {
        isLoading: new Set(),
        isValid: new Set(),
    },
    isButtonDisable: {
        customerPageButton: false,
        shippingPageButton: true,
    },
    isValid: {
        shippingAddress: false,
        updatedShippingAddress: false,
        billingAddress: false,
        orderProcessed: false,
        shippingLine: false,
        pigi: false,
        pigiLoaded: false,
        scaToken: false,
    },
    isSessionInitialized: false,
    overlay: {
        inverted: true,
        shown: true,
        icon: '',
        header: '',
        subHeader: '',
        content: '',
        showCustomContent: false
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
                    id: '',
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
                    id: '',
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
                selected_shipping: {
                    id: '',
                    description: '',
                    amount: 0
                },
                available_shipping_lines: [],
                taxes: [],
                discounts: [],
            },
            order_meta_data: {
                cart_parameters: {},
                note_attributes: {},
                notes: '',
                tags: [],
            },
            currency: {
                iso_code: 'CAD',
                iso_numeric_code: 124,
                symbol: '$',
                format: '${{amount}}',
                has_decimal: true,
                show_iso_code: true
            },
            fees: [],
            resumable_link: '',
            created_via: '',
            is_processed: false,
        },
        initial_data: {
            shop_name: '',
            supported_languages: [],
            country_info: [],
            general_settings: {
                checkout_process: {
                    company_name_option: '',
                    phone_number_required: false,
                    accepts_marketing_checkbox_option: '',
                    tax_exempt_checkbox_enabled: false,
                },
                address_autocomplete: {
                    provider: null,
                    api_key: null,
                },
            },
            alternative_payment_methods: [],
            external_payment_gateways: [],
        }
    },
};
