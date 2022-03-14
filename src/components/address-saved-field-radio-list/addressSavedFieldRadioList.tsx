import React from 'react';
import { FieldSection, AddressNewFieldRadio, AddressSavedFieldRadio } from 'src/components';
import { useGetSavedAddressData, useGetShippingData } from 'src/hooks';
import { IAddress, ISavedAddressFieldRadioListProps } from 'src/types';

export function AddressSavedFieldRadioList(props: ISavedAddressFieldRadioListProps): React.ReactElement {
    const { title, placeholder, savedAddresses, handleChange } = useGetSavedAddressData(props.type);
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
                                checked={address.id === selectedAddress.id}
                                handleChange={handleChange}/>
                        );
                    })
                }
                <AddressNewFieldRadio
                    key={'address_new'}
                    type={props.type}
                    label={placeholder} 
                    checked={!selectedAddress.id}
                    handleChange={handleChange}/>
            </ul>
        </FieldSection>
    );
}
