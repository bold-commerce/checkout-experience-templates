import React from 'react';
import {FieldRadio, CondensedShipping} from 'src/components';
import {ISavedAddressFieldRadioProps} from 'src/types';

export function AddressSavedFieldRadio(props: ISavedAddressFieldRadioProps): React.ReactElement {
    const label = <CondensedShipping address={props.address} showPhone />;

    return (
        <li className="saved-address-list-item" >
            <FieldRadio
                label={label}
                dataTestId={props.dataTestId}
                value={`${props.address.id}__${props.address.address_line_1}`}
                checked={props.checked}
                handleChange={props.handleChange} />
        </li>
    );
}
