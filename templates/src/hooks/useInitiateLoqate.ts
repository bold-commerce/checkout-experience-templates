/* istanbul ignore file */
// TODO: Remove above comment and implement tests on CE-272

import {useGetCountryInfoList} from 'src/hooks/useGetCountryData';
import {IAutocompleteData, ILoqateSettingsOptions} from 'src/types';
import {isAutocompleteDataPopulated, scriptsAreLoaded} from 'src/utils';
import {useEffect, useState} from 'react';
import {LoqateConstants} from 'src/constants';
import {useDispatchAutocompleteData, useGetAutocompleteAPIKey} from 'src/hooks';
import {ICountryInformation} from '@boldcommerce/checkout-frontend-library';

export function useInitiateLoqate(scriptIsLoaded = false): {scriptIsLoaded: boolean} {
    //Needs to be passed as parameter coming from endpoint - no hard coded values
    const apiKey = useGetAutocompleteAPIKey();
    const getCountryInfoList: Array<ICountryInformation> = useGetCountryInfoList();
    const [loqateScriptIsLoaded, setLoqateScriptIsLoaded] = useState(scriptIsLoaded);
    const [addressData, setAddressData] = useState({
        address1: '',
        city: '',
        postalCode: '',
        province: '',
        provinceCode: '',
        country: '',
        countryCode: ''
    });
    const dispatchAutocompleteData = useDispatchAutocompleteData();

    /*
     * initializeAutoComplete needs to be in window object, as it is called in the callback part of the Google Maps API URL
     *
     * I wonder if those need to be also in the window object:
     *  - autocomplete object
     *  - fillAddressFields function
     */
    useEffect(() => {
        if (addressData && isAutocompleteDataPopulated(addressData)) {
            dispatchAutocompleteData(addressData);
        }

        if (loqateScriptIsLoaded) {
            const settingsOptions: ILoqateSettingsOptions = {key: apiKey};

            if (getCountryInfoList && getCountryInfoList.length > 0) {
                const countryCodesList: Array<string> = [];
                getCountryInfoList.map((countryEntry: ICountryInformation) => {
                    countryCodesList.push(countryEntry.iso_code);
                });
                settingsOptions.countries = {codesList: countryCodesList.join(',')};
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const control = new pca.Address(LoqateConstants.ADDRESS_FIELDS, settingsOptions);

            control.listen('populate', function (addressFromLoqate) {
                const tempAddressData: IAutocompleteData = {
                    address1: addressFromLoqate.Line1,
                    address2: addressFromLoqate.SubBuilding,
                    company: addressFromLoqate.Company,
                    city: addressFromLoqate.City,
                    postalCode: addressFromLoqate.PostalCode,
                    province: addressFromLoqate.ProvinceName,
                    provinceCode: addressFromLoqate.ProvinceCode,
                    country: addressFromLoqate.CountryName,
                    countryCode: addressFromLoqate.CountryIso2
                };
                setAddressData(tempAddressData);
            });
        }
    }, [loqateScriptIsLoaded, addressData]);

    // Script initialisation - need to retrieve apiKey from an endpoint but not defined yet
    if (!scriptsAreLoaded([LoqateConstants.JS_SCRIPT_ID, LoqateConstants.CSS_SCRIPT_ID])) {
        const script = document.createElement('script');
        script.src = LoqateConstants.JS_SCRIPT_SRC;
        script.async = false;
        script.id = LoqateConstants.JS_SCRIPT_ID;
        script.onload = () => setLoqateScriptIsLoaded(true);
        //document.body.appendChild(script);

        const link = document.createElement('link');
        link.href = LoqateConstants.CSS_SCRIPT_SRC;
        link.id = LoqateConstants.CSS_SCRIPT_ID;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        //document.body.appendChild(link);
    }

    return {scriptIsLoaded: loqateScriptIsLoaded};
}
