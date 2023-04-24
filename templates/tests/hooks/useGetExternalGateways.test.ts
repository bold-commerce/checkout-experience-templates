import {useAppSelector, useGetExternalPaymentGatewayLoading} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {useGetExternalPaymentGateways} from 'src/hooks/useGetExternalPaymentGateways';

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
                    'location': 'payment_method_below'
                },
                {
                    'is_test': true,
                    'iframe_url': 'testURL2',
                    'target_div': 'payment',
                    'base_url': 'testURL2',
                    'public_id': 'publicID2',
                    'location': 'customer_info_below'
                }
            ]
        }
    },
    externalPaymentGateways: {
        isValid: new Set(),
        isLoading: new Set(),
    },
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing hook useGetExternalGateways', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = [
        {name: 'test with customer_info_below', input: 'customer_info_below', output: [store.data.initial_data.external_payment_gateways[1]]},
        {name: 'test with payment_method_below', input: 'payment_method_below', output: [store.data.initial_data.external_payment_gateways[0]]}
    ];

    test.each(data)('$name', ({name, input, output}) => {
        const {result} = renderHook(() => useGetExternalPaymentGateways(input));
        expect(result.current).toStrictEqual(output);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});

describe('Testing useGetExternalPaymentGatewayLoading', () => {
    test('test hook properly', () => {
        const gateway = {
            base_url: '', iframe_url: '', is_test: false, location: '', public_id: '', target_div: '', currency: ''
        };

        const {result} = renderHook(() => useGetExternalPaymentGatewayLoading(gateway));
        expect(result.current).toStrictEqual(false);
    });
});
