import React from 'react';
import { DisplayAddress, FieldRadio } from 'src/components';
import { ISavedAddressFieldRadioProps } from 'src/types';

export function AddressSavedFieldRadio(props: ISavedAddressFieldRadioProps): React.ReactElement { 

    const label = <DisplayAddress {...props.address}/>;
    return (
        <li className="saved-address-list-item" >
            <FieldRadio 
                label={label} 
                value={props.address.address_line_1} 
                checked={props.checked}
                handleChange={props.handleChange} />
        </li>
    );
}
