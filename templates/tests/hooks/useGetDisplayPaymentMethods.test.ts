import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';
import {useGetDisplayPaymentMethods, useGetPayments} from 'src/hooks';
import {initialDataMock} from 'src/mocks';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';

jest.mock('src/utils');
jest.mock('src/hooks/useGetPayments');
const getTermMock = mocked(getTerm, true);
const useGetPaymentsMock = mocked(useGetPayments, true);

describe('Testing hook useGetDisplayPaymentMethods', () => {
    const hookReturnMock = {
        paymentsMethod: initialDataMock.application_state.payments,
        terms: {noPaymentMethod: 'No payment method'}
    };

    beforeEach(() => {
        useGetPaymentsMock.mockReturnValue(hookReturnMock.paymentsMethod);
        getTermMock.mockReturnValue('');
    });

    test('rendering the hook properly', () => {
        getTermMock.mockReturnValueOnce(hookReturnMock.terms.noPaymentMethod);

        const {result} = renderHook(() => useGetDisplayPaymentMethods());

        expect(result.current).toStrictEqual(hookReturnMock);
        expect(useGetPaymentsMock).toHaveBeenCalledTimes(1);
        expect(getTermMock).toHaveBeenCalledTimes(1);
        expect(getTermMock).toHaveBeenCalledWith('no_payment_method', Constants.PAYMENT_INFO);
    });
});
