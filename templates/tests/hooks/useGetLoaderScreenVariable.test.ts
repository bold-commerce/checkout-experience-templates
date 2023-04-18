import {useAppSelector, useGetExternalPaymentGatewayLoading, useGetLoaderScreenVariable} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';

const store = {
    isLoading: {test: false, externalPaymentGateways: new Set()}
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing useGetLineItems', () => {
    test('test hook properly', () => {
        const loader = 'test';

        const {result} = renderHook(() => useGetLoaderScreenVariable(loader));
        expect(result.current).toStrictEqual(store.isLoading[loader]);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});


