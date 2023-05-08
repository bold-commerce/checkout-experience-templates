import {renderHook} from '@testing-library/react-hooks';
import * as useGetCountryData from 'src/hooks/useGetCountryData';
import * as useDispatchAutocompleteData from 'src/hooks/useDispatchAutocompleteData';
import {useInitiateGoogleAutocomplete} from 'src/hooks';
import * as scriptsAreLoaded from 'src/utils/scriptsAreLoaded';
import * as isAutocompleteDataPopulated from 'src/utils/isAutocompleteDataPopulated';
import SpyInstance = jest.SpyInstance;
import {GoogleAutocompleteConstants} from 'src/constants';
import {ICountryInformation} from '@boldcommerce/checkout-frontend-library';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

// Skipped while CE-193 is not merged in develop - document.body.appendChild function is commented in hook
describe.skip('Testing hook useGetAutocompleteService', () => {
    let useGetCountryInfoListSpy: SpyInstance;
    let scriptsAreLoadedSpy: SpyInstance;
    let isAutocompleteDataPopulatedSpy: SpyInstance;
    let useDispatchAutocompleteDataSpy: SpyInstance;
    let documentCreateElementSpy: SpyInstance;
    let documentBodyAppendChildSpy: SpyInstance;
    let documentQuerySelectorSpy: SpyInstance;
    let getCountryInfoListMock: Array<ICountryInformation>;
    let mockedScript: HTMLScriptElement;

    beforeEach(() => {
        jest.restoreAllMocks();
        getCountryInfoListMock = [
            {
                iso_code: 'CA',
                name: 'Canada',
                show_province: false,
                province_label: 'Province',
                show_postal_code: false,
                provinces: [],
                valid_for_shipping: false,
                valid_for_billing: false
            },
            {
                iso_code: 'US',
                name: 'United States',
                show_province: false,
                province_label: 'State',
                show_postal_code: false,
                provinces: [],
                valid_for_shipping: false,
                valid_for_billing: false
            },
            {
                iso_code: 'FR',
                name: 'France',
                show_province: false,
                province_label: 'Région',
                show_postal_code: false,
                provinces: [],
                valid_for_shipping: false,
                valid_for_billing: false
            },
            {
                iso_code: 'BR',
                name: 'Brazil',
                show_province: false,
                province_label: 'Provincia',
                show_postal_code: false,
                provinces: [],
                valid_for_shipping: false,
                valid_for_billing: false
            },
            {
                iso_code: 'MX',
                name: 'Mexico',
                show_province: false,
                province_label: 'Provincia',
                show_postal_code: false,
                provinces: [],
                valid_for_shipping: false,
                valid_for_billing: false
            },
            {
                iso_code: 'DE',
                name: 'Germany',
                show_province: false,
                province_label: 'Länder',
                show_postal_code: false,
                provinces: [],
                valid_for_shipping: false,
                valid_for_billing: false
            },
            {
                iso_code: 'AU',
                name: 'Australia',
                show_province: false,
                province_label: 'State',
                show_postal_code: false,
                provinces: [],
                valid_for_shipping: false,
                valid_for_billing: false
            },
        ];
        mockedScript = createScriptElement();

        useDispatchAutocompleteDataSpy = jest.spyOn(useDispatchAutocompleteData, 'useDispatchAutocompleteData');
        useGetCountryInfoListSpy = jest.spyOn(useGetCountryData, 'useGetCountryInfoList');
        scriptsAreLoadedSpy = jest.spyOn(scriptsAreLoaded, 'scriptsAreLoaded');
        isAutocompleteDataPopulatedSpy = jest.spyOn(isAutocompleteDataPopulated, 'isAutocompleteDataPopulated');
        documentCreateElementSpy = jest.spyOn(document, 'createElement');
        documentBodyAppendChildSpy = jest.spyOn(document.body, 'appendChild');
        documentQuerySelectorSpy = jest.spyOn(document, 'querySelector');
    });

    test('scripts are already loaded and addressData is not empty', () => {
        window.initializeAutoComplete = jest.fn();
        useGetCountryInfoListSpy.mockReturnValueOnce(getCountryInfoListMock);
        scriptsAreLoadedSpy.mockReturnValueOnce(true);
        isAutocompleteDataPopulatedSpy.mockReturnValueOnce(false);

        renderHook(() => useInitiateGoogleAutocomplete());

        expect(documentCreateElementSpy).not.toHaveBeenCalled();
        expect(documentBodyAppendChildSpy).not.toHaveBeenCalled();
        expect(useDispatchAutocompleteDataSpy).not.toHaveBeenCalled();
    });

    test('scripts are already loaded and addressData is empty', () => {
        window.initializeAutoComplete = jest.fn();
        useGetCountryInfoListSpy.mockReturnValueOnce(getCountryInfoListMock);
        scriptsAreLoadedSpy.mockReturnValueOnce(true);
        isAutocompleteDataPopulatedSpy.mockReturnValueOnce(true);

        renderHook(() => useInitiateGoogleAutocomplete());

        expect(documentCreateElementSpy).not.toHaveBeenCalled();
        expect(documentBodyAppendChildSpy).not.toHaveBeenCalled();
        expect(useDispatchAutocompleteDataSpy).toHaveBeenCalledTimes(1);
    });

    test('scripts are not loaded and addressData is not empty', () => {
        window.initializeAutoComplete = jest.fn();
        useGetCountryInfoListSpy.mockReturnValueOnce(getCountryInfoListMock);
        scriptsAreLoadedSpy.mockReturnValueOnce(false);
        isAutocompleteDataPopulatedSpy.mockReturnValueOnce(false);

        renderHook(() => useInitiateGoogleAutocomplete());

        expect(documentCreateElementSpy).toHaveBeenCalledTimes(1);
        expect(documentCreateElementSpy).toHaveBeenCalledWith('script');
        expect(documentBodyAppendChildSpy).toHaveBeenCalledTimes(1);
        expect(documentBodyAppendChildSpy).toHaveBeenCalledWith(mockedScript);
        expect(useDispatchAutocompleteDataSpy).not.toHaveBeenCalled();
    });

    test('scripts are not loaded and addressData is empty', () => {
        window.initializeAutoComplete = jest.fn();
        useGetCountryInfoListSpy.mockReturnValue(getCountryInfoListMock);
        scriptsAreLoadedSpy.mockReturnValueOnce(false).mockReturnValueOnce(true);
        isAutocompleteDataPopulatedSpy.mockReturnValue(true);

        renderHook(() => useInitiateGoogleAutocomplete());

        expect(documentCreateElementSpy).toHaveBeenCalledTimes(1);
        expect(documentCreateElementSpy).toHaveBeenCalledWith('script');
        expect(documentBodyAppendChildSpy).toHaveBeenCalledTimes(1);
        expect(documentBodyAppendChildSpy).toHaveBeenCalledWith(mockedScript);
        expect(useDispatchAutocompleteDataSpy).toHaveBeenCalledTimes(1);
        expect(isAutocompleteDataPopulatedSpy).toHaveBeenCalledTimes(1);
    });
});

function createScriptElement(): HTMLScriptElement {
    const apiKey = 'AIzaSyA5a3ZybUZWNM6PZCm6g9HgV9Jqad7JgP4';
    const srcWithKey = GoogleAutocompleteConstants.srcWithKey.replace('API_KEY', apiKey);
    const script: HTMLScriptElement = document.createElement('script');
    script.id = GoogleAutocompleteConstants.googleAutocompleteScriptId;
    script.async = false;
    script.src = srcWithKey;
    return script;
}
