import { useGetErrors } from 'src/hooks';
import { mocked } from 'jest-mock';
import { Constants, errorTypes } from 'src/constants';
import { renderHook } from '@testing-library/react-hooks';
import { useCheckShippingAddress } from 'src/themes/buy-now/hooks';

type ReturnTestData = {
    name: string;
    useGetErrorsHookReturn: ReturnType<typeof useGetErrors>;
    expectedReturn: ReturnType<typeof useCheckShippingAddress>;
}

jest.mock('src/hooks/useGetErrors');

const useGetErrorsMock = mocked(useGetErrors);

describe('testing hook useCheckShippingAddress', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    const returnTestData: ReturnTestData[] = [
        {
            name: 'Should return correct values for no errors',
            useGetErrorsHookReturn: [],
            expectedReturn: {
                isValid: true,
            },
        },
        {
            name: 'Should return correct values for unrelated errors',
            useGetErrorsHookReturn: [
                {
                    type: errorTypes.address,
                    address_type: Constants.BILLING,
                    field: 'N/A',
                    severity: 'N/A',
                    sub_type: 'N/A',
                    message: 'N/A',
                },
            ],
            expectedReturn: {
                isValid: true,
            },
        },
        {
            name: 'Should return correct values if there are shipping address field errors',
            useGetErrorsHookReturn: [
                {
                    type: errorTypes.address,
                    address_type: Constants.SHIPPING,
                    field: 'N/A',
                    severity: 'N/A',
                    sub_type: 'N/A',
                    message: 'N/A',
                },
            ],
            expectedReturn: {
                isValid: false,
            },
        },
        {
            name: 'Should return correct values if there are shipping line errors',
            useGetErrorsHookReturn: [
                {
                    type: errorTypes.shipping_line,
                    field: 'N/A',
                    severity: 'N/A',
                    sub_type: 'N/A',
                    message: 'N/A',
                },
            ],
            expectedReturn: {
                isValid: false,
            },
        },
    ];

    test.each(returnTestData)('$name', ({
        useGetErrorsHookReturn,
        expectedReturn,
    }) => {
        useGetErrorsMock.mockReturnValue(useGetErrorsHookReturn);

        const { result } = renderHook(() => useCheckShippingAddress());

        expect(result.current).toEqual(expectedReturn);
    });
});