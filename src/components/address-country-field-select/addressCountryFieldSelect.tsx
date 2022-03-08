import React from 'react';
import {IAddressFieldSelectProps} from 'src/types';
import { FieldSelect} from 'src/components';
import {useGetAddressCountryInputData} from 'src/hooks';

export function AddressCountrySelect(props: IAddressFieldSelectProps): React.ReactElement {

    const {placeholder, label, id, name , value, countryOptions , handleChange, handleBlur, errorMessage} = useGetAddressCountryInputData(props.type, props.debounceApiCall);

    return (
        <FieldSelect placeholder={placeholder}
            className={'address__country'}
            options={countryOptions}
            label={label}
            name={name}
            isPlaceholderDisabled={true}
            value={value}
            handleChange={handleChange}
            handleBlur={handleBlur}
            errorMessage={errorMessage}
            id={id} />
    );
}
