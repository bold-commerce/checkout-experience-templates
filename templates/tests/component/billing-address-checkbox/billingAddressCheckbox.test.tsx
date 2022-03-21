import * as useBillingAddress from 'src/hooks/useBillingAddress';
import {fireEvent, render, screen} from '@testing-library/react';
import {BillingAddressCheckbox} from 'src/components';
import {IAddressProps, IBillingAddress} from 'src/types';
import {Constants} from 'src/constants';
import {Provider} from 'react-redux';
import * as Store from 'src/store';

const store = Store.initializeStore();

describe('Testing BillingAddressCheckbox component', () => {
    let billingAddressHook: jest.SpyInstance;

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
        billingAddressHook = jest.spyOn(useBillingAddress, 'useBillingAddress');
    });

    test('Render the BillingAddress properly', () => {
        billingAddressHook.mockReturnValue(hookResult);
        const {container} = render(<BillingAddressCheckbox/>);
        expect(container.getElementsByClassName('billing-address-checkbox').length).toBe(1);
        expect(container.getElementsByClassName('billing-address__FieldSection').length).toBe(1);
        expect(container.getElementsByClassName('new-billing-address').length).toBe(0);

        const sameCheckbox: Partial<HTMLInputElement> = screen.getByTestId('field-checkbox');
        expect(sameCheckbox.checked).toEqual(true);
    });


    test('Render the BillingAddress with different billing address', () => {
        const localHookResult = {...hookResult};
        localHookResult.customBilling = Constants.SHIPPING_DIFFERENT;
        billingAddressHook.mockReturnValue(localHookResult);
        const {container} = render(<Provider store={store}><BillingAddressCheckbox/> </Provider>);
        expect(container.getElementsByClassName('billing-address-checkbox').length).toBe(1);
        expect(container.getElementsByClassName('billing-address__FieldSection').length).toBe(1);
        expect(container.getElementsByClassName('new-billing-address').length).toBe(1);

        const sameCheckbox: Partial<HTMLInputElement> = screen.getByTestId('field-checkbox');
        expect(sameCheckbox.checked).toEqual(false);
    });


    test('trigger handle change event', () => {
        billingAddressHook.mockReturnValue(hookResult);
        render(<BillingAddressCheckbox/>);
        
        const sameCheckbox: Partial<HTMLInputElement> = screen.getByTestId('field-checkbox');
        fireEvent.click(sameCheckbox as Element);
        expect(hookResult.toggleBillingSameAsShipping).toBeCalled();
    });

});
