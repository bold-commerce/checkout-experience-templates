import {renderHook} from '@testing-library/react-hooks';
import {useAppSelector, useGetCurrencyInformation} from 'src/hooks';
import {initialDataMock} from 'src/mocks';
const store = {
    data: initialDataMock
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing useGetCurrencyInformation', () => {

    test('Rendering the hook properly', () => {
        const {result} = renderHook(() => useGetCurrencyInformation());
        expect(useAppSelector).toHaveBeenCalledTimes(1);
        expect(result.current.currencySymbol).toStrictEqual('$');
        expect(result.current.currency).toStrictEqual('CAD');
    });
});
