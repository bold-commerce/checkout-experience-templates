import {useAppSelector, useGetCombinedDiscounts} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {initialDataMock} from 'src/mocks';

const store = {
    data: initialDataMock
};
store.data.application_state.discounts.push({
    'code': 'Test Discount Code',
    'text': 'Test Text',
    'valid': true,
    'value': 10
});

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing useGetCombinedDiscounts', () => {
    test('test useGetCombinedDiscounts hook properly', () => {
        const {result} = renderHook(() => useGetCombinedDiscounts());
        expect(result.current).toStrictEqual([{
            'code': 'Test Discount Code',
            'text': 'Test Text',
            'valid': true,
            'value': 20
        }]);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});
