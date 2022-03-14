import {
    useCallApiAtOnEvents,
    useDebounceCustomer,
    useGetAddressDataField,
    useGetAddressFieldInputData,
    useGetAddressPostalCodeAndProvinceData,
    useGetErrorByField
} from 'src/hooks';
import {Constants} from 'src/constants';
import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'ts-jest/utils';
import {getTerm} from 'src/utils';
import {IAddressPostalCodeAndProvinceDataProps} from 'src/types';
import {DebouncedState} from 'use-debounce/lib/useDebouncedCallback';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useCallApiAtOnEvents');
jest.mock('src/hooks/useGetErrorByField');
jest.mock('src/hooks/useGetAddressPostalCodeAndProvinceData');
jest.mock('src/hooks/useGetAddressData');
jest.mock('src/hooks/useDebounceCustomer');
const getTermMock = mocked(getTerm, true);
const useCallApiAtOnEventsMock = mocked(useCallApiAtOnEvents, true);
const useGetErrorByFieldMock = mocked(useGetErrorByField, true);
const useGetAddressPostalCodeAndProvinceDataMock = mocked(useGetAddressPostalCodeAndProvinceData, true);
const useGetAddressDataFieldMock = mocked(useGetAddressDataField, true);
const useDebounceCustomerMock = mocked(useDebounceCustomer, true);

describe('Testing hook useGetAddressFieldInputData', () => {
    const debounceMock = jest.fn();
    const type = Constants.SHIPPING;
    const field = Constants.ADDRESS_FIRST_NAME;
    const placeholder = Constants.ADDRESS_FIRST_NAME;
    const getTermValue = 'test-value';
    const target ={
        target: {
            value: '',
            selectedIndex: 0,
            0: {
                text: 'test'
            }
        }
    };

    beforeEach(() => {
        jest.resetAllMocks();
        getTermMock.mockReturnValue(getTermValue);
        useGetAddressDataFieldMock.mockReturnValue(getTermValue);
        useGetAddressPostalCodeAndProvinceDataMock.mockReturnValue({showPostalCode: false} as IAddressPostalCodeAndProvinceDataProps);
        useCallApiAtOnEventsMock.mockReturnValue(false);
        useGetErrorByFieldMock.mockReturnValue('');
    });

    const hookData = [
        {type: Constants.SHIPPING, field: Constants.ADDRESS_FIRST_NAME, placeholder: Constants.ADDRESS_FIRST_NAME, debounce: debounceMock, showField: true, dispatchCalls: 2},
        {type: Constants.SHIPPING, field: Constants.ADDRESS_LAST_NAME, placeholder: Constants.ADDRESS_LAST_NAME, debounce: debounceMock, showField: true, dispatchCalls: 2},
        {type: Constants.SHIPPING, field: Constants.ADDRESS_POSTAL_CODE, placeholder: Constants.ADDRESS_POSTAL_CODE, debounce: debounceMock, showField: false, dispatchCalls: 1},
    ];

    test.each(hookData)(
        'rendering the hook properly ($type, $field, $showField)',
        ({type, field, debounce, placeholder, showField, dispatchCalls}) => {
            const {result} = renderHook(() => useGetAddressFieldInputData(type, field, debounce, placeholder));
            expect(result.current.showField).toStrictEqual(showField);
            expect(result.current.placeholder).toStrictEqual(getTermValue);
            expect(result.current.id).toStrictEqual(type+'-address__'+field);
            expect(result.current.name).toStrictEqual(field);
            expect(result.current.value).toStrictEqual(getTermValue);
            expect(result.current.errorMessage).toStrictEqual('');

            expect(mockDispatch).toBeCalledTimes(0);
            result.current.handleChange(target);
            expect(mockDispatch).toBeCalledTimes(dispatchCalls);
            expect(debounceMock).toBeCalledTimes(0);
        });

    test('rendering the hook with error', () => {
        useGetErrorByFieldMock.mockReturnValueOnce('error');

        const {result} = renderHook(() => useGetAddressFieldInputData(type, field, debounceMock,placeholder));
        expect(result.current.showField).toStrictEqual(true);
        expect(result.current.placeholder).toStrictEqual(getTermValue);
        expect(result.current.id).toStrictEqual(type+'-address__'+field);
        expect(result.current.name).toStrictEqual(field);
        expect(result.current.value).toStrictEqual(getTermValue);
        expect(result.current.errorMessage).toStrictEqual('error');

        expect(mockDispatch).toBeCalledTimes(0);
        result.current.handleChange(target);
        expect(mockDispatch).toBeCalledTimes(3);
        expect(debounceMock).toBeCalledTimes(0);
    });

    test('rendering the hook with callApi', () => {
        useCallApiAtOnEventsMock.mockReturnValueOnce(true);
        useDebounceCustomerMock.mockReturnValue(function() {} as DebouncedState<() => void >);

        const {result} = renderHook(() => useGetAddressFieldInputData(type, field, debounceMock, placeholder));
        expect(result.current.showField).toStrictEqual(true);
        expect(result.current.placeholder).toStrictEqual(getTermValue);
        expect(result.current.id).toStrictEqual(type+'-address__'+field);
        expect(result.current.name).toStrictEqual(field);
        expect(result.current.value).toStrictEqual(getTermValue);
        expect(result.current.errorMessage).toStrictEqual('');

        expect(mockDispatch).toBeCalledTimes(0);
        result.current.handleChange(target);
        expect(mockDispatch).toBeCalledTimes(2);
        expect(debounceMock).toBeCalledTimes(1);
    });

});
