import { formatMetaAddressFromCheckout } from 'src/themes/flow-sdk/meta';
import { IAddress } from '@boldcommerce/checkout-frontend-library';
import { emptyAddressMock } from 'src/mocks';
import { IMetaPaymentAddress } from 'src/themes/flow-sdk/types';

describe('formatMetaAddressFromCheckout', () => {
  it('should format address correctly', () => {
    const address: IAddress = {
      address_line_1: '123 Main St',
      address_line_2: 'Apt 4',
      city: 'Anytown',
      province: 'California',
      province_code: 'CA',
      country: 'United States',
      country_code: 'US',
      first_name: 'John',
      last_name: 'Doe',
      phone_number: '555-555-5555',
      business_name: 'Acme Inc',
      postal_code: '12345',
    };

    const expected: IMetaPaymentAddress = {
      addressLine: ['123 Main St', 'Apt 4'],
      city: 'Anytown',
      region: 'CA',
      country: 'US',
      recipient: 'John Doe',
      phone: '555-555-5555',
      organization: 'Acme Inc',
      postalCode: '12345',
    };

    expect(formatMetaAddressFromCheckout(address)).toEqual(expected);
  });

  it('should format address correctly with missing fields', () => {

    const expected: IMetaPaymentAddress = {
      addressLine: ['', ''],
      city: '',
      region: '',
      country: '',
      recipient: '',
      phone: '',
      organization: '',
      postalCode: '',
    };

    expect(formatMetaAddressFromCheckout(emptyAddressMock)).toEqual(expected);
  });
});