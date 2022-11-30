import {initialDataMock} from 'src/mocks';
import {renderHook} from '@testing-library/react-hooks';
import {useAppSelector, useGetGeneralSettingCheckoutFields} from 'src/hooks';

const store = {
    data: initialDataMock
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing hook useGetGeneralSettingFields', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('rendering the hook properly', () => {
        const {result} = renderHook(() => useGetGeneralSettingCheckoutFields('company_name_option'));
        expect(result.current).toBe(store.data.initial_data.general_settings.checkout_process.company_name_option);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});
