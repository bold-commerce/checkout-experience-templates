import {fireEvent, render, screen} from '@testing-library/react';
import {mocked} from 'jest-mock';
import {BillingAddress} from 'src/components';
import {Constants} from 'src/constants';
import {storeMock} from 'src/mocks';
import {useGetIsLoading, useBillingAddress} from 'src/hooks';
import {IAddressProps, IBillingAddress} from 'src/types';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(storeMock)),
    useDispatch: () => mockDispatch
}));
jest.mock('src/hooks/useGetIsLoading');
jest.mock('src/hooks/useBillingAddress');
const useGetIsLoadingMock = mocked(useGetIsLoading, true);
const useBillingAddressMock = mocked(useBillingAddress, true);

describe('Testing BillingAddress component', () => {

    const addressProps: IAddressProps= {
        showSavedAddresses: true,
        title: 'test-titel',
        type: Constants.BILLING,
        showTitle: false,
    };

    const hookResult:IBillingAddress = {
        customBilling: Constants.SHIPPING_SAME,
        toggleBillingSameAsShipping: jest.fn(),
        handleChange: jest.fn(),
        billingDifferent: 'different',
        billingSame: 'same',
        billingTitle: 'title',
        addressProps: addressProps
    };

    beforeEach(() => {
        useGetIsLoadingMock.mockReturnValue(false);
    });

    test('Render the BillingAddress properly', () => {
        useBillingAddressMock.mockReturnValueOnce(hookResult);
        const {container} = render(<BillingAddress/>);
        expect(container.getElementsByClassName('billing-address').length).toBe(1);
        expect(container.getElementsByClassName('address__FieldSection').length).toBe(1);
        expect(container.getElementsByClassName('shipping-same').length).toBe(1);
        expect(container.getElementsByClassName('shipping-different').length).toBe(1);
        expect(container.getElementsByClassName('test-component').length).toBe(0);

        const sameRadio: Partial<HTMLInputElement> = screen.getByLabelText(hookResult.billingSame);
        const differentRadio: Partial<HTMLInputElement> = screen.getByLabelText(hookResult.billingDifferent);
        expect(sameRadio.checked).toEqual(true);
        expect(differentRadio.checked).toEqual(false);
    });

    test('Render the BillingAddress with different billing address', () => {
        const localHookResult = {...hookResult};
        localHookResult.customBilling = Constants.SHIPPING_DIFFERENT;
        useBillingAddressMock.mockReturnValueOnce(localHookResult);
        const {container} = render(<BillingAddress/>);
        expect(container.getElementsByClassName('shipping-same').length).toBe(1);
        expect(container.getElementsByClassName('shipping-different').length).toBe(1);

        const sameRadio: Partial<HTMLInputElement> = screen.getByLabelText(hookResult.billingSame);
        const differentRadio: Partial<HTMLInputElement> = screen.getByLabelText(hookResult.billingDifferent);
        expect(sameRadio.checked).toEqual(false);
        expect(differentRadio.checked).toEqual(true);
    });


    test('trigger handle change event', () => {
        useBillingAddressMock.mockReturnValueOnce(hookResult);
        render(<BillingAddress/>);
        const differentRadio: Partial<HTMLInputElement> = screen.getByLabelText(hookResult.billingDifferent);
        fireEvent.click(differentRadio as Element);
        expect(hookResult.handleChange).toBeCalled();
    });

});
