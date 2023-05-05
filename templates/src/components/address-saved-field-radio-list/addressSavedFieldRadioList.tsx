import React from 'react';
import {FieldSection, AddressNewFieldRadio, AddressSavedFieldRadio} from 'src/components';
import {useGetSavedAddressData, useGetShippingData} from 'src/hooks';
import {ISavedAddressFieldRadioListProps} from 'src/types';
import {IAddress} from '@boldcommerce/checkout-frontend-library';

export function AddressSavedFieldRadioList(props: ISavedAddressFieldRadioListProps): React.ReactElement {
    const {title, placeholder, savedAddresses, handleChange} = useGetSavedAddressData(props.type);
    const selectedAddress = useGetShippingData();

    return (
        <FieldSection title={title} className="shipping-address__FieldSection" showTitle={true}>
            <ul className="saved-address-list">
                {
                    savedAddresses.map((address: IAddress) => {
                        return (
                            <AddressSavedFieldRadio
                                key={`address_${address.id}`}
                                address={address}
                                dataTestId={`address_${address.id}`}
                                checked={address.id === selectedAddress.id}
                                handleChange={handleChange}/>
                        );
                    })
                }
                <AddressNewFieldRadio
                    key={'address_new'}
                    type={props.type}
                    dataTestId={'address-new'}
                    label={placeholder}
                    checked={!selectedAddress.id}
                    handleChange={handleChange}/>
            </ul>
        </FieldSection>
    );
}
