import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';
import {useDispatch} from 'react-redux';
import {
    useGetLoaderScreenVariable,
    useGetValidVariable,
    useGetRequiresShipping,
    useGetAppSettingData,
    useGetBatchShippingLines
} from 'src/hooks';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';

jest.mock('react-redux');
jest.mock('src/hooks/useGetLoaderScreenVariable');
jest.mock('src/hooks/useGetValidVariable');
jest.mock('src/hooks/useGetRequiresShipping');
jest.mock('src/hooks/useGetAppSettingData');
jest.mock('src/utils');
const useDispatchMock = mocked(useDispatch, true);
const useGetLoaderScreenVariableMock = mocked(useGetLoaderScreenVariable, true);
const useGetValidVariableMock = mocked(useGetValidVariable, true);
const useGetRequiresShippingMock = mocked(useGetRequiresShipping, true);
const useGetAppSettingDataMock = mocked(useGetAppSettingData, true);
const getTermMock = mocked(getTerm, true);

describe('Testing hook useGetShippingLines', () => {
    const mockDispatch = jest.fn();
    const dataArray = [
        {
            name: 'Test shipping and billing type is same',
            billingType: Constants.SHIPPING_SAME,
            requiresShipping: false,
            loadingParameter: true,
            validParameter: true,
            batchPostShippingAddress: true,
            batchPostBillingAddress: true,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            dispatchCalled: 1,
            getLoaderCalled: 1,
            getValidCalled: 3,
            getTermCalled: 3,
        },
        {
            name: 'Test shipping and billing type is different',
            billingType: Constants.SHIPPING_DIFFERENT,
            requiresShipping: false,
            loadingParameter: true,
            validParameter: true,
            batchPostShippingAddress: true,
            batchPostBillingAddress: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            dispatchCalled: 1,
            getLoaderCalled: 1,
            getValidCalled: 3,
            getTermCalled: 3,
        },
    ];

    beforeEach(() => {
        jest.resetAllMocks();
        useDispatchMock.mockReturnValue(mockDispatch);
        mockDispatch.mockReturnValue(Promise.resolve());
    });

    test.each(dataArray)( '$name', async ({
        billingType,
        requiresShipping,
        loadingParameter,
        validParameter,
        batchPostShippingAddress,
        batchPostBillingAddress,
        validTextParameter,
        fieldTextParameter,
        dispatchCalled,
        getLoaderCalled,
        getValidCalled,
        getTermCalled,
    }) => {
        useGetValidVariableMock
            .mockReturnValueOnce(validParameter)
            .mockReturnValueOnce(batchPostShippingAddress)
            .mockReturnValueOnce(batchPostBillingAddress);
        useGetLoaderScreenVariableMock.mockReturnValueOnce(loadingParameter);
        useGetRequiresShippingMock.mockReturnValue(requiresShipping);
        getTermMock.mockReturnValueOnce(validTextParameter).mockReturnValueOnce(fieldTextParameter);
        useGetAppSettingDataMock.mockReturnValue(billingType);

        renderHook(() => useGetBatchShippingLines());
        await Promise.resolve();

        expect(mockDispatch).toHaveBeenCalledTimes(dispatchCalled);
        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledTimes(getLoaderCalled);
        expect(useGetValidVariableMock).toHaveBeenCalledTimes(getValidCalled);
        expect(getTermMock).toHaveBeenCalledTimes(getTermCalled);
    });
});