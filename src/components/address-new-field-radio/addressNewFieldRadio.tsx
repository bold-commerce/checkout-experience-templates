import React from 'react';
import {Address, FieldRadio} from 'src/components';
import {INewAddressFieldRadioProps} from 'src/types';

export function AddressNewFieldRadio(props: INewAddressFieldRadioProps): React.ReactElement {
    return (
        <li className="saved-address-list-item" >
            <FieldRadio
                label={props.label}
                value="new"
                checked={props.checked}
                dataTestId={props.dataTestId}
                handleChange={props.handleChange} />
            {
                props.checked ?
                    <Address
                        type={props.type}
                        showTitle={false}
                        showSavedAddresses={false}
                        title=""/>
                    : null
            }
        </li>
    );
}
