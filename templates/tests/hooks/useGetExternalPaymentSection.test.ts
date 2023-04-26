import {renderHook} from '@testing-library/react-hooks';
import {useGetExternalPaymentGatewaySection} from 'src/hooks/useGetExternalPaymentGatewaySection';
import {checkLoadExternalPaymentGatewayErrors} from 'src/library/checkLoadExternalPaymentGatewayErrors';
import {mocked} from 'jest-mock';
import {act} from 'react-dom/test-utils';

const store = {
    data: {
        initial_data: {
            external_payment_gateways: [
                {
                    'is_test': true,
                    'iframe_url': 'testURL',
                    'target_div': 'payment',
                    'base_url': 'testURL',
                    'public_id': 'publicID',
                    'location': 'payment_method_below',
                    'currency': 'USD'
                },
                {
                    'is_test': true,
                    'iframe_url': 'testURL2',
                    'target_div': 'payment',
                    'base_url': 'testURL2',
                    'public_id': 'publicID2',
                    'location': 'customer_info_below',
                    'currency': 'USD'
                }
            ],
        },
    },
    appSetting: {
        languageIso: '',
    },
    externalPaymentGateways: {
        isLoading: new Set(),
        isValid: new Set(),
    },
    isLoading: {
    },
    isValid: {
        shippingAddress: true,
        shippingLine: true,
    }
};

jest.mock('src/hooks/rootHooks');
jest.mock('src/library/checkLoadExternalPaymentGatewayErrors');

const mockDispatch = jest.fn();

const checkLoadExternalErrorsMock = mocked(checkLoadExternalPaymentGatewayErrors);

jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => mockDispatch
}));

describe('Testing hook useGetExternalPaymentSection', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        checkLoadExternalErrorsMock.mockImplementation((gateway, callback) => {
            act(() => {
                callback();
            });
            return () => Promise.resolve();
        });
    });

    const data = [
        {name: 'test', input: store.data.initial_data.external_payment_gateways[0], output: {loading: false, isValidAddress: true, isValidShippingLine: true, notValidText: 'payment_gateway_loading_error', fieldSectionText: 'payment_method', isValidExternalLoad: false}}
    ];

    test.each(data)('$name', async ({name, input, output}) => {
        const {result} = renderHook(() => useGetExternalPaymentGatewaySection(input));
        await result.current.onLoad();
        jest.runAllTimers();
        expect(result.current).toEqual(expect.objectContaining(output));
    });
});
