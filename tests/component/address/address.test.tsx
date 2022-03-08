import {IAddressProps} from 'src/types';
import {Constants} from 'src/constants';
import {render, screen} from '@testing-library/react';
import {Address} from 'src/components';
import {Provider} from 'react-redux';
import * as Store from 'src/store';
import {mocked} from 'ts-jest/utils';
import {useDebouncedValidateAddress, useGetGeneralSettingCheckoutFields, useInitiateGenericAutocomplete} from 'src/hooks';


jest.mock('src/hooks/useGetGeneralSettingCheckoutFields');
jest.mock('src/hooks/useInitiateGenericAutocomplete');
jest.mock('src/hooks/useDebounceValidateAddress');
const useDebouncedValidateAddressMock = mocked(useDebouncedValidateAddress, true);
const useGetGeneralSettingCheckoutFieldsMock = mocked(useGetGeneralSettingCheckoutFields, true);
const useInitiateGenericAutocompleteMock = mocked(useInitiateGenericAutocomplete, true);

const store = Store.initializeStore();
describe('Testing Address component', () => {

    const props: IAddressProps= {
        type: Constants.SHIPPING,
        title: 'test',
        showTitle: true,
        showSavedAddresses: true
    };

    beforeEach(() =>{
        jest.resetAllMocks();
    });

    test('Render the Address properly', () => {
        useGetGeneralSettingCheckoutFieldsMock
            .mockReturnValueOnce('optional')
            .mockReturnValueOnce(true);
        const {container} = render(<Provider store={store}><Address {...props}/></Provider>);
        expect(container.getElementsByClassName('address__FieldSection').length).toBe(1);
        expect(container.getElementsByClassName('address__saved-select').length).toBe(1);
        expect(container.getElementsByClassName('address__first').length).toBe(1);
        expect(container.getElementsByClassName('address__last').length).toBe(1);
        expect(container.getElementsByClassName('address__company').length).toBe(1);
        expect(container.getElementsByClassName('address__address').length).toBe(1);
        expect(container.getElementsByClassName('address__address2').length).toBe(1);
        expect(container.getElementsByClassName('address__city').length).toBe(1);
        expect(container.getElementsByClassName('address__country').length).toBe(1);
        expect(container.getElementsByClassName('address__province').length).toBe(1);
        expect(container.getElementsByClassName('address__postal_code').length).toBe(1);
        expect(container.getElementsByClassName('address__phone').length).toBe(1);
        expect(useDebouncedValidateAddressMock).toHaveBeenCalledTimes(1);
        expect(useInitiateGenericAutocompleteMock).toHaveBeenCalledTimes(1);
        expect(useGetGeneralSettingCheckoutFieldsMock).toHaveBeenCalledTimes(2);
        expect(screen.getByPlaceholderText('Company (optional)')).toBeTruthy();
    });

    test('Render the Address properly with hidden fields', () => {
        const localProps = {...props, showSavedAddresses: false};
        useGetGeneralSettingCheckoutFieldsMock
            .mockReturnValueOnce('hidden')
            .mockReturnValueOnce(false);
        const {container} = render(<Provider store={store}><Address {...localProps}/></Provider>);
        expect(container.getElementsByClassName('address__hidden').length).toBe(1);
        expect(container.getElementsByClassName('address__saved-select').length).toBe(0);
        expect(useDebouncedValidateAddressMock).toHaveBeenCalledTimes(1);
        expect(useInitiateGenericAutocompleteMock).toHaveBeenCalledTimes(1);
        expect(useGetGeneralSettingCheckoutFieldsMock).toHaveBeenCalledTimes(2);
    });

    test('Render the Address with company mandatory', () => {
        useGetGeneralSettingCheckoutFieldsMock
            .mockReturnValueOnce('required')
            .mockReturnValueOnce(false);
        render(<Provider store={store}><Address {...props}/></Provider>);
        expect(screen.getByPlaceholderText('Company')).toBeTruthy();
    });
});
