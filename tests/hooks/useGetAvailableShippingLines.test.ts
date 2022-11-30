import {useAppSelector, useGetAvailableShippingLines} from 'src/hooks';
import {initialDataMock} from 'src/mocks';
import {renderHook} from '@testing-library/react-hooks';

const store = {
    data: initialDataMock
};
const shippingLines = initialDataMock.application_state.shipping.available_shipping_lines;

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing hook useGetAvailableShippingLines', () => {

    test('test hook properly', () => {
        const {result} = renderHook(() => useGetAvailableShippingLines());
        expect(result.current).toStrictEqual(shippingLines);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });

});
