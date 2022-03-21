import * as useBillingAddress from 'src/hooks/useBillingAddress';
import {fireEvent, render, screen} from '@testing-library/react';
import {BillingAddress} from 'src/components';
import {IAddressProps, IBillingAddress} from 'src/types';
import {Constants} from 'src/constants';
import {Provider} from 'react-redux';
import * as Store from 'src/store';

const store = Store.initializeStore();

describe('Testing BillingAddress component', () => {
    let billingAddressHook: jest.SpyInstance;
    const one = 1;

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
        billingAddressHook = jest.spyOn(useBillingAddress, 'useBillingAddress');
    });

    test('Render the BillingAddress properly', () => {
        billingAddressHook.mockReturnValue(hookResult);
        const {container} = render(<BillingAddress/>);
        expect(container.getElementsByClassName('billing-address').length).toBe(one);
        expect(container.getElementsByClassName('address__FieldSection').length).toBe(one);
        expect(container.getElementsByClassName('shipping-same').length).toBe(one);
        expect(container.getElementsByClassName('shipping-different').length).toBe(one);
        expect(container.getElementsByClassName('test-component').length).toBe(0);

        const sameRadio: Partial<HTMLInputElement> = screen.getByLabelText(hookResult.billingSame);
        const differentRadio: Partial<HTMLInputElement> = screen.getByLabelText(hookResult.billingDifferent);
        expect(sameRadio.checked).toEqual(true);
        expect(differentRadio.checked).toEqual(false);
    });

    test('Render the BillingAddress with different billing address', () => {
        const localHookResult = {...hookResult};
        localHookResult.customBilling = Constants.SHIPPING_DIFFERENT;
        billingAddressHook.mockReturnValue(localHookResult);
        const {container} = render(<Provider store={store}><BillingAddress/> </Provider>);
        expect(container.getElementsByClassName('shipping-same').length).toBe(one);
        expect(container.getElementsByClassName('shipping-different').length).toBe(one);

        const sameRadio: Partial<HTMLInputElement> = screen.getByLabelText(hookResult.billingSame);
        const differentRadio: Partial<HTMLInputElement> = screen.getByLabelText(hookResult.billingDifferent);
        expect(sameRadio.checked).toEqual(false);
        expect(differentRadio.checked).toEqual(true);
    });


    test('trigger handle change event', () => {
        billingAddressHook.mockReturnValue(hookResult);
        render(<BillingAddress/>);
        const differentRadio: Partial<HTMLInputElement> = screen.getByLabelText(hookResult.billingDifferent);
        fireEvent.click(differentRadio as Element);
        expect(hookResult.handleChange).toBeCalled();
    });

});
