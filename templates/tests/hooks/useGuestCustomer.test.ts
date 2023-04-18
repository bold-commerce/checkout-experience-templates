import {
    useCallApiAtOnEvents,
    useDebounceCustomer,
    useGetCustomerInfoDataByField,
    useGetCustomerMarketingField,
    useGetErrorByField,
    useGetGeneralSettingCheckoutFields,
    useGuestCustomer
} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';
import {getTerm} from 'src/utils';
import {DebouncedState} from 'use-debounce/lib/useDebouncedCallback';
import {debounceConstants} from 'src/constants';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useGetErrorByField');
jest.mock('src/hooks/useDebounceCustomer');
jest.mock('src/hooks/useCallApiAtOnEvents');
jest.mock('src/hooks/useGetCustomerInformation');
jest.mock('src/hooks/useGetGeneralSettingCheckoutFields');
const getTermMock = mocked(getTerm, true);
const useGetErrorByFieldMock = mocked(useGetErrorByField, true);
const useCallApiAtOnEventsMock = mocked(useCallApiAtOnEvents, true);
const useGetCustomerInfoDataByFieldMock = mocked(useGetCustomerInfoDataByField, true);
const useGetCustomerMarketingFieldMock = mocked(useGetCustomerMarketingField, true);
const useGetGeneralSettingCheckoutFieldsMock = mocked(useGetGeneralSettingCheckoutFields, true);

describe('Testing hook useGuestCustomer', () => {
    const debounceMock = jest.fn();
    const debounceGuestCustomerMock = function() {} as DebouncedState<() => void>
    const email = 'test@email.com';
    const marketing = true;
    const target ={target: {value: ''}};

    beforeEach(() => {
        jest.resetAllMocks();
        useGetCustomerInfoDataByFieldMock.mockReturnValue(email);
        useGetCustomerMarketingFieldMock.mockReturnValue(marketing);
        debounceConstants.debouncedGuestCustomerFunction = debounceGuestCustomerMock;
    });

    const hookData = [
        { error: 'test', handleCalls: 3, checkboxCalls: 4, acceptMarketing: 'checked', acceptMarketingHidden: false},
        { error: '', handleCalls: 1, checkboxCalls: 2, acceptMarketing: 'hidden', acceptMarketingHidden: true},
    ];

    test.each(hookData)(
        'rendering the hook properly ($error, $handleCalls, $checkboxCalls)',
        ({error, handleCalls, checkboxCalls, acceptMarketing,acceptMarketingHidden}) => {
            useGetErrorByFieldMock.mockReturnValue(error);
            useGetGeneralSettingCheckoutFieldsMock.mockReturnValue(acceptMarketing);
            useCallApiAtOnEventsMock.mockReturnValueOnce(true);
            const expectedError = error ? error+' '+error : undefined;


            const {result} = renderHook(() => useGuestCustomer());
            const results = result.current;
            expect(results.email).toStrictEqual(email);
            expect(results.getTerm).toStrictEqual(getTermMock);
            expect(results.emailError).toStrictEqual(expectedError);
            expect(results.acceptMarketingChecked).toStrictEqual(marketing);
            expect(results.acceptMarketingHidden).toStrictEqual(acceptMarketingHidden);

            expect(mockDispatch).toBeCalledTimes(0);
            results.handleChange(target);
            expect(mockDispatch).toBeCalledTimes(handleCalls);

            results.handleCheckboxChange();
            expect(mockDispatch).toBeCalledTimes(checkboxCalls);
            expect(debounceMock).toBeCalledTimes(0);
        });
});
