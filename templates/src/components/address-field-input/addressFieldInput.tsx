import React from 'react';
import {IAddressFieldInputProps} from 'src/types';
import {FieldInput} from 'src/components';
import {useGetAddressFieldInputData} from 'src/hooks';

export function AddressFieldInput(props: IAddressFieldInputProps): React.ReactElement {

    const {placeholder, id, name , value, errorMessage, handleChange, handleBlur, dataTestId} = useGetAddressFieldInputData(props.type, props.fieldId, props.debounceApiCall, props.placeholder);

    return (
        <FieldInput placeholder={placeholder}
            className={props.className}
            name={name}
            value={value}
            dataTestId={dataTestId}
            handleChange={handleChange}
            handleBlur={handleBlur}
            errorMessage={errorMessage}
            id={id}/>
    );
}
