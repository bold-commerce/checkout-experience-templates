/* istanbul ignore file */
// TODO: Remove above comment and implement tests on CE-272

import {useEffect, useState} from 'react';
import {shippingAddressFieldIds, billingAddressFieldIds} from 'src/constants';
import {googleAutocompleteRetrieveOptions, isAutocompleteDataPopulated, scriptsAreLoaded} from 'src/utils';
import {IAutocompleteData} from 'src/types';
import {useGetCountryInfoList} from 'src/hooks/useGetCountryData';
import AutocompleteOptions = google.maps.places.AutocompleteOptions;
import Autocomplete = google.maps.places.Autocomplete;
import PlaceResult = google.maps.places.PlaceResult;
import {GoogleAutocompleteConstants} from 'src/constants';
import {useDispatchAutocompleteShippingData, useDispatchAutocompleteBillingData, useGetAutocompleteAPIKey} from 'src/hooks';
import {ICountryInformation} from '@boldcommerce/checkout-frontend-library';

const TYPE_SHIPPING = 'shipping';
const TYPE_BILLING = 'billing';

export function useInitiateGoogleAutocomplete(): void {
    let autocompleteShipping: Autocomplete;
    let autocompleteBilling: Autocomplete;
    const apiKey = useGetAutocompleteAPIKey();
    const getCountryInfoList: Array<ICountryInformation> = useGetCountryInfoList();
    const dispatchAutocompleteShippingData = useDispatchAutocompleteShippingData();
    const dispatchAutocompleteBillingData = useDispatchAutocompleteBillingData();

    const [shippingAddressData, setShippingAddressData] = useState({
        address1: '',
        city: '',
        postalCode: '',
        province: '',
        provinceCode: '',
        country: '',
        countryCode: ''
    });

    const [billingAddressData, setBillingAddressData] = useState({
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
                const shippingAddress1Field = document.querySelector(`#${shippingAddressFieldIds.address1FieldSelector}`) as HTMLInputElement;
                const billingAddress1Field = document.querySelector(`#${billingAddressFieldIds.address1FieldSelector}`);
                const googleAutocompleteOptions: AutocompleteOptions = googleAutocompleteRetrieveOptions(getCountryInfoList);
                
                autocompleteShipping = autocompleteShipping || new google.maps.places.Autocomplete(shippingAddress1Field, googleAutocompleteOptions);
                autocompleteShipping.addListener(GoogleAutocompleteConstants.eventToListen, () => fillAddressFields(autocompleteShipping, TYPE_SHIPPING));

                if (billingAddress1Field) {
                    autocompleteBilling = autocompleteBilling || new google.maps.places.Autocomplete(billingAddress1Field as HTMLInputElement, googleAutocompleteOptions);
                    autocompleteBilling.addListener(GoogleAutocompleteConstants.eventToListen, () => fillAddressFields(autocompleteBilling, TYPE_BILLING));
                }
            };
        } else {
            window.initializeAutoComplete();
        }

        if (shippingAddressData && isAutocompleteDataPopulated(shippingAddressData)) {
            dispatchAutocompleteShippingData(shippingAddressData);
        }

        if (billingAddressData && isAutocompleteDataPopulated(billingAddressData)) {
            dispatchAutocompleteBillingData(billingAddressData);
        }
    }, [shippingAddressData, billingAddressData]);

    // Dispatch event instead of setting up value directly
    const fillAddressFields = (autocomplete: Autocomplete, type: string): void => {
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
                    tempAddressData.address1 = `${googleAutocompleteAddressComponent.long_name} ${tempAddressData.address1}`;
                    break;
                }
                case 'route': {
                    tempAddressData.address1 += googleAutocompleteAddressComponent.long_name;
                    break;
                }
                case 'postal_code': {
                    tempAddressData.postalCode = `${googleAutocompleteAddressComponent.long_name}${tempAddressData.postalCode}`;
                    break;
                }
                case 'postal_code_suffix': {
                    tempAddressData.postalCode = `${tempAddressData.postalCode}-${googleAutocompleteAddressComponent.long_name}`;
                    break;
                }
                case 'locality':
                case 'postal_town':
                case 'administrative_area_level_2':
                    if (!tempAddressData.city) {
                        tempAddressData.city = googleAutocompleteAddressComponent.long_name;
                    }
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

        if (type === TYPE_SHIPPING) {
            setShippingAddressData(tempAddressData);
        } else if (type === TYPE_BILLING) {
            setBillingAddressData(tempAddressData);
        }
        
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
