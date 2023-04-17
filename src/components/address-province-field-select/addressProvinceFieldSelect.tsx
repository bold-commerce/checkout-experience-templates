import React, {useMemo} from 'react';
import {IAddressFieldSelectProps} from 'src/types';
import {FieldSelect} from 'src/components';
import {useGetAddressProvinceInputData} from 'src/hooks';
import ClassNames from 'classnames';

export function AddressProvinceSelect(props: IAddressFieldSelectProps): React.ReactElement {
    const {
        placeholder,
        label,
        id,
        name ,
        value,
        showProvince,
        provinceOptions ,
        handleChange,
        handleBlur,
        errorMessage,
        provinceName,
        dataTestId
    } = useGetAddressProvinceInputData(props.type, props.debounceApiCall);
    const cssClass = ClassNames(props.className, {'address__hidden': !showProvince});

    // Creating temp province if the value is not in the options. As soon as the province
    // is changed to a province that is in the options the temp option will disappear.
    const optionsWithTemp = useMemo(() => {
        const hasOption = !value || provinceOptions.find(opt => opt.value.toLowerCase() === value.toLowerCase());
        return hasOption ? provinceOptions : [
            {value, name: provinceName ?? value},
            ...provinceOptions,
        ];
    }, [provinceOptions, value]);

    return (
        <FieldSelect
            placeholder={placeholder}
            className={cssClass}
            options={optionsWithTemp}
            label={label}
            isPlaceholderDisabled={true}
            dataTestId={dataTestId}
            name={name}
            value={value}
            errorMessage={errorMessage}
            handleChange={handleChange}
            handleBlur={handleBlur}
            id={id}
        />
    );
}
