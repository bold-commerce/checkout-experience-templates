import {fireEvent, render, screen} from '@testing-library/react';
import {mocked} from 'jest-mock';
import {BillingAddressCheckbox} from 'src/components';
import {Constants} from 'src/constants';
import {useGetIsLoading, useBillingAddress} from 'src/hooks';
import {storeMock} from 'src/mocks';
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

describe('Testing BillingAddressCheckbox component', () => {

    const addressProps: IAddressProps= {
        showSavedAddresses: true,
        title: 'test-title',
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
        const {container} = render(<BillingAddressCheckbox/>);
        expect(container.getElementsByClassName('billing-address-checkbox').length).toBe(1);
        expect(container.getElementsByClassName('billing-address__FieldSection').length).toBe(1);
        expect(container.getElementsByClassName('new-billing-address').length).toBe(0);

        const sameCheckbox: Partial<HTMLInputElement> = screen.getByTestId('billing-address-checkbox');
        expect(sameCheckbox.checked).toEqual(true);
    });


    test('Render the BillingAddress with different billing address', () => {
        const localHookResult = {...hookResult};
        localHookResult.customBilling = Constants.SHIPPING_DIFFERENT;
        useBillingAddressMock.mockReturnValueOnce(localHookResult);
        const {container} = render(<BillingAddressCheckbox/>);
        expect(container.getElementsByClassName('billing-address-checkbox').length).toBe(1);
        expect(container.getElementsByClassName('billing-address__FieldSection').length).toBe(1);
        expect(container.getElementsByClassName('new-billing-address').length).toBe(1);

        const sameCheckbox: Partial<HTMLInputElement> = screen.getByTestId('billing-address-checkbox');
        expect(sameCheckbox.checked).toEqual(false);
    });


    test('trigger handle change event', () => {
        useBillingAddressMock.mockReturnValueOnce(hookResult);
        render(<BillingAddressCheckbox/>);

        const sameCheckbox: Partial<HTMLInputElement> = screen.getByTestId('billing-address-checkbox');
        fireEvent.click(sameCheckbox as Element);
        expect(hookResult.toggleBillingSameAsShipping).toBeCalled();
    });

});
