import {
    useAppSelector, useGetExternalPaymentGatewayReady,
    useGetValidVariable,
} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';

const store = {
    isValid: {test: true, externalPaymentGateways: new Set()}
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing hook useGetValidVariable', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('testing hook properly', () => {
        const field = 'test';
        const {result} = renderHook(() => useGetValidVariable(field));
        expect(result.current).toStrictEqual(true);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });

});
describe('useGetExternalGatewayValidVariable', () => {
    test('returns a good value', () => {
        const gateway = {
            base_url: '', iframe_url: '', is_test: false, location: '', public_id: '', target_div: ''
        };
        const {result} = renderHook(() => useGetExternalPaymentGatewayReady(gateway));
        expect(result.current).toEqual(false);
    });
});
