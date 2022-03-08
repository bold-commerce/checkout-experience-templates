import React from 'react';
import {IAddressFieldSelectProps} from 'src/types';
import { FieldSelect} from 'src/components';
import {useGetAddressProvinceInputData} from 'src/hooks';
import ClassNames from 'classnames';

export function AddressProvinceSelect(props: IAddressFieldSelectProps): React.ReactElement {

    const {placeholder, label, id, name , value, showProvince, provinceOptions , handleChange, handleBlur, errorMessage} = useGetAddressProvinceInputData(props.type, props.debounceApiCall);
    const cssClass = ClassNames(props.className, {'address__hidden': !showProvince});

    return (
        <FieldSelect placeholder={placeholder}
            className={cssClass}
            options={provinceOptions}
            label={label}
            isPlaceholderDisabled={true}
            name={name}
            value={value}
            errorMessage={errorMessage}
            handleChange={handleChange}
            handleBlur={handleBlur}
            id={id} />
    );
}
