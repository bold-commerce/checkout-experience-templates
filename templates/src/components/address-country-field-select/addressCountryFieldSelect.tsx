import React, {useMemo} from 'react';
import {IAddressFieldSelectProps} from 'src/types';
import {FieldSelect} from 'src/components';
import {useGetAddressCountryInputData} from 'src/hooks';

export function AddressCountrySelect(props: IAddressFieldSelectProps): React.ReactElement {
    const {placeholder, label, id, name, value, countryOptions, handleChange, handleBlur, errorMessage, countryName, dataTestId} = useGetAddressCountryInputData(props.type, props.debounceApiCall);

    // Creating temp country if the value is not in the options. As soon as the country
    // is changed to a country that is in the options the temp option will disappear.
    const optionsWithTemp = useMemo(() => {
        const hasOption = !value || countryOptions.find(opt => opt.value.toLowerCase() === value.toLowerCase());
        return hasOption ? countryOptions : [
            {value, name: countryName ?? value},
            ...countryOptions,
        ];
    }, [countryOptions, value, countryName]);

    return (
        <FieldSelect placeholder={placeholder}
            className="address__country"
            options={optionsWithTemp}
            label={label}
            name={name}
            dataTestId={dataTestId}
            isPlaceholderDisabled={true}
            value={value}
            handleChange={handleChange}
            handleBlur={handleBlur}
            errorMessage={errorMessage}
            id={id}
        />
    );
}
