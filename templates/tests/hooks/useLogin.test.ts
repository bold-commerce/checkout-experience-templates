import {renderHook} from '@testing-library/react-hooks';
import {
    useCallApiAtOnEvents,
    useGetCustomerInfoDataByField,
    useGetCustomerMarketingField,
    useGetGeneralSettingCheckoutFields,
    useLogin
} from 'src/hooks';
import {mocked} from 'jest-mock';
import {debounceConstants} from 'src/constants';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));
jest.mock('src/hooks/useCallApiAtOnEvents');
jest.mock('src/hooks/useGetCustomerInformation');
jest.mock('src/hooks/useGetCustomerInformation');
jest.mock('src/hooks/useGetGeneralSettingCheckoutFields');
const useCallApiAtOnEventsMock = mocked(useCallApiAtOnEvents, true);
const useGetCustomerInfoDataByFieldMock = mocked(useGetCustomerInfoDataByField, true);
const useGetCustomerMarketingFieldMock = mocked(useGetCustomerMarketingField, true);
const useGetGeneralSettingCheckoutFieldsMock = mocked(useGetGeneralSettingCheckoutFields, true);

describe('Testing hook useLogin', () => {

    const debounceMock = jest.fn();
    debounceConstants.debouncedGuestCustomerFunction = jest.fn();
    const email = 'test@email.com';
    const marketing = true;
    const eventMock = {preventDefault: jest.fn()};

    beforeEach(() => {
        jest.clearAllMocks();
        window = Object.create(window);
        useGetCustomerInfoDataByFieldMock.mockReturnValue(email);
        useGetCustomerMarketingFieldMock.mockReturnValue(marketing);
        Object.defineProperty(window, 'location', {
            value: {
                href: 'http://dummy.com'
            }
        });
        window.loginUrl = 'http://test.com';
    });

    test('rendering the hook properly', () => {
        useGetGeneralSettingCheckoutFieldsMock.mockReturnValueOnce('checked');
        useCallApiAtOnEventsMock.mockReturnValueOnce(true);
        const {result} = renderHook(() => useLogin());
        const results = result.current;
        results.loginUrl && results.loginUrl(eventMock);
        expect(window.location.href).toEqual('http://test.com');

        expect(results.email).toStrictEqual(email);
        expect(results.acceptMarketingChecked).toStrictEqual(marketing);
        expect(results.acceptMarketingHidden).toStrictEqual(false);
    });

    test('rendering the change event with callApiAtOnEvents false ', () => {
        useCallApiAtOnEventsMock.mockReturnValueOnce(false);
        useGetGeneralSettingCheckoutFieldsMock.mockReturnValueOnce('hidden');
        const {result} = renderHook(() => useLogin());
        const results = result.current;
        results.handleCheckboxChange();
        expect(mockDispatch).toBeCalledTimes(1);
        expect(debounceMock).toBeCalledTimes(0);
        expect(results.acceptMarketingHidden).toStrictEqual(true);
    });

    test('rendering the change event with callApiAtOnEvents true ', () => {
        useCallApiAtOnEventsMock.mockReturnValueOnce(true);
        useGetGeneralSettingCheckoutFieldsMock.mockReturnValueOnce('hidden');
        const {result} = renderHook(() => useLogin());
        const results = result.current;
        results.handleCheckboxChange();
        expect(mockDispatch).toBeCalledTimes(1);
        expect(results.acceptMarketingHidden).toStrictEqual(true);

    });

});
