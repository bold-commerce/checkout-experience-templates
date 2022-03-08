import React from 'react';
import {IAddressFieldInputProps} from 'src/types';
import {FieldInput} from 'src/components';
import {useGetAddressFieldInputData} from 'src/hooks/useGetAddressFieldInputData';
import ClassNames from 'classnames';

export function AddressFieldInput(props: IAddressFieldInputProps): React.ReactElement {

    const {placeholder, id, name , value, showField, errorMessage, handleChange, handleBlur} = useGetAddressFieldInputData(props.type, props.fieldId, props.debounceApiCall, props.placeholder);
    const cssClass = ClassNames(props.className, {'address__hidden': !showField});

    return (
        <FieldInput placeholder={placeholder}
            className={cssClass}
            name={name}
            value={value}
            handleChange={handleChange}
            handleBlur={handleBlur}
            errorMessage={errorMessage}
            id={id}/>
    );
}
