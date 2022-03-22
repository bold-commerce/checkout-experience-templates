import {useAppSelector, useGetButtonDisableVariable} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';

const store = {
    isButtonDisable: {customerPageButton: false}
};
const customerPageButton = store.isButtonDisable.customerPageButton;

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing hook useGetButtonDisableVariable', () => {

    test('test hook properly', () => {
        const {result} = renderHook(() => useGetButtonDisableVariable('customerPageButton'));
        expect(result.current).toStrictEqual(customerPageButton);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});
