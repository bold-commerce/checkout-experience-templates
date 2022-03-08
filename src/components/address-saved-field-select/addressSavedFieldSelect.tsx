import React from 'react';
import {ISavedAddressFieldSelectProps} from 'src/types';
import { FieldSelect} from 'src/components';
import {useGetSavedAddressData} from 'src/hooks';

export function AddressSavedSelect(props: ISavedAddressFieldSelectProps): React.ReactElement {

    const {id, label, options, placeholder, handleChange} = useGetSavedAddressData(props.type);

    return (
        <FieldSelect placeholder={placeholder}
            className={props.className}
            options={options}
            label={label}
            isPlaceholderDisabled={false}
            handleChange={handleChange}
            id={id} />
    );
}
