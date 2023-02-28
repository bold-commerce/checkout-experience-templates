import React from 'react';
import ClassNames from 'classnames';
import {IAddressProps} from 'src/types';
import {
    FieldSection,
    AddressCountrySelect,
    AddressProvinceSelect,
    AddressFieldInput,
    AddressSavedSelect,
} from 'src/components';
import {Constants} from 'src/constants';
import {useDebouncedValidateAddress, useGetAddressPostalCodeAndProvinceData, useGetGeneralSettingCheckoutFields, useInitiateGenericAutocomplete} from 'src/hooks';

export function Address(props: IAddressProps): React.ReactElement {
    const {type, title, showTitle, showSavedAddresses} = props;
    const debounceApiCall = useDebouncedValidateAddress(type);
    const company = useGetGeneralSettingCheckoutFields('company_name_option') as 'required' | 'hidden' | boolean;
    const hideCompany = company === 'hidden';
    const companyField = company === 'required' ? Constants.ADDRESS_BUSINESS : Constants.ADDRESS_BUSINESS_OPTIONAL;
    const isPhoneRequired = useGetGeneralSettingCheckoutFields('phone_number_required') as boolean;
    const phoneField = isPhoneRequired ? Constants.ADDRESS_PHONE : Constants.ADDRESS_PHONE_OPTIONAL;
    const {showPostalCode} = useGetAddressPostalCodeAndProvinceData(type);
    const postalCodeCN = ClassNames('address__postal_code', {'address__hidden': !showPostalCode});
    const phoneCN = ClassNames('address__phone', {'address__phone--full-width': !showPostalCode});
    const businessNameCN = ClassNames('address__company', {'address__hidden': hideCompany});
    const commonProps = {type, debounceApiCall};

    useInitiateGenericAutocomplete();

    return (
        <div className="address" data-testid={`${type}-address`}>
            <FieldSection title={title} className={'address__FieldSection'} showTitle={showTitle}>
                {showSavedAddresses && (
                    <AddressSavedSelect
                        type={type}
                        className="address__saved-select"
                        autoSelect={props.savedAddressesSelectProps?.autoSelect}
                        placeholderValue={props.savedAddressesSelectProps?.placeholderValue}
                    />
                )}
                <AddressFieldInput {...commonProps} className="address__first" fieldId={Constants.ADDRESS_FIRST_NAME} placeholder={Constants.ADDRESS_FIRST_NAME}/>
                <AddressFieldInput {...commonProps} className="address__last" fieldId={Constants.ADDRESS_LAST_NAME} placeholder={Constants.ADDRESS_LAST_NAME}/>
                <AddressFieldInput {...commonProps} className={businessNameCN}  fieldId={Constants.ADDRESS_BUSINESS} placeholder={companyField}/>
                <AddressFieldInput {...commonProps} className="address__address" fieldId={Constants.ADDRESS_ADDRESS_1} placeholder={Constants.ADDRESS_ADDRESS_1}/>
                <AddressFieldInput {...commonProps} className="address__address2"  fieldId={Constants.ADDRESS_ADDRESS_2} placeholder={Constants.ADDRESS_ADDRESS_2}/>
                <AddressFieldInput {...commonProps} className="address__city"  fieldId={Constants.ADDRESS_CITY} placeholder={Constants.ADDRESS_CITY}/>
                <AddressCountrySelect {...commonProps} className="address__country" />
                <AddressProvinceSelect {...commonProps} className="address__province" />
                <AddressFieldInput {...commonProps} className={postalCodeCN}  fieldId={Constants.ADDRESS_POSTAL_CODE} placeholder={Constants.ADDRESS_POSTAL_CODE}/>
                <AddressFieldInput {...commonProps} className={phoneCN} fieldId={Constants.ADDRESS_PHONE} placeholder={phoneField}/>
            </FieldSection>
        </div>
    );

}
