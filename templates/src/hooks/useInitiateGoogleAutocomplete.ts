/* istanbul ignore file */
// TODO: Remove above comment and implement tests on CE-272

import {useEffect, useState} from 'react';
import {AddressFieldIds} from 'src/constants';
import {googleAutocompleteRetrieveOptions, isAutocompleteDataPopulated, scriptsAreLoaded} from 'src/utils';
import {IAutocompleteData} from 'src/types';
import {useGetCountryInfoList} from 'src/hooks/useGetCountryData';
import AutocompleteOptions = google.maps.places.AutocompleteOptions;
import Autocomplete = google.maps.places.Autocomplete;
import PlaceResult = google.maps.places.PlaceResult;
import {GoogleAutocompleteConstants} from 'src/constants';
import {useDispatchAutocompleteData, useGetAutocompleteAPIKey} from 'src/hooks';
import {ICountryInformation} from '@boldcommerce/checkout-frontend-library';

export function useInitiateGoogleAutocomplete(): void {
    let autocomplete: Autocomplete;
    const apiKey = useGetAutocompleteAPIKey();
    const getCountryInfoList: Array<ICountryInformation> = useGetCountryInfoList();
    const dispatchAutocompleteData = useDispatchAutocompleteData();

    const [addressData, setAddressData] = useState({
        address1: '',
        city: '',
        postalCode: '',
        province: '',
        provinceCode: '',
        country: '',
        countryCode: ''
    });

    /*
     * initializeAutoComplete needs to be in window object, as it is called in the callback part of the Google Maps API URL
     *
     * I wonder if those need to be also in the window object:
     *  - autocomplete object
     *  - fillAddressFields function
     */
    useEffect(() => {
        // Function called when script is loaded - see below, in callback=... part of the google maps API URL
        if (!window.initializeAutoComplete) {
            window.initializeAutoComplete = (): void => {
                const address1Field = document.querySelector(`#${AddressFieldIds.address1FieldSelector}`) as HTMLInputElement;
                const googleAutocompleteOptions: AutocompleteOptions = googleAutocompleteRetrieveOptions(getCountryInfoList);
                autocomplete = autocomplete || new google.maps.places.Autocomplete(address1Field, googleAutocompleteOptions);
                autocomplete.addListener(GoogleAutocompleteConstants.eventToListen, fillAddressFields);
            };
        }

        if (addressData && isAutocompleteDataPopulated(addressData)) {
            dispatchAutocompleteData(addressData);
        }
    }, [addressData]);

    // Dispatch event instead of setting up value directly
    const fillAddressFields = (): void => {
        const tempAddressData: IAutocompleteData = {
            address1: '',
            city: '',
            postalCode: '',
            province: '',
            provinceCode: '',
            country: '',
            countryCode: ''
        };
        const place: PlaceResult = autocomplete.getPlace();

        for (const googleAutocompleteAddressComponent of place.address_components as Array<google.maps.GeocoderAddressComponent>) {
            const googleAutocompleteAddressComponentType: string = googleAutocompleteAddressComponent.types[0];
            switch (googleAutocompleteAddressComponentType) {
                case 'street_number': {
                    tempAddressData.address1 = `${googleAutocompleteAddressComponent.long_name} ${tempAddressData.address1}`; break;
                }
                case 'route': {
                    tempAddressData.address1 += googleAutocompleteAddressComponent.long_name; break;
                }
                case 'postal_code': {
                    tempAddressData.postalCode = `${googleAutocompleteAddressComponent.long_name}${tempAddressData.postalCode}`;  break;
                }
                case 'postal_code_suffix': {
                    tempAddressData.postalCode = `${tempAddressData.postalCode}-${googleAutocompleteAddressComponent.long_name}`; break;
                }
                case 'locality':
                    tempAddressData.city = googleAutocompleteAddressComponent.long_name;
                    break;
                case 'administrative_area_level_1': {
                    tempAddressData.province = googleAutocompleteAddressComponent.long_name;
                    tempAddressData.provinceCode = googleAutocompleteAddressComponent.short_name;
                    break;
                }
                case 'country':
                    tempAddressData.country = googleAutocompleteAddressComponent.long_name;
                    tempAddressData.countryCode = googleAutocompleteAddressComponent.short_name;
                    break;
            }
        }
        setAddressData(tempAddressData);
    };

    // Script initialisation
    if (!scriptsAreLoaded([GoogleAutocompleteConstants.googleAutocompleteScriptId])) {
        const srcWithKey = GoogleAutocompleteConstants.srcWithKey.replace('API_KEY', apiKey);

        const script = document.createElement('script');
        script.src = srcWithKey;
        script.async = true;
        script.id = GoogleAutocompleteConstants.googleAutocompleteScriptId;
        document.head.appendChild(script);
    }
}
