import {renderHook} from '@testing-library/react-hooks';
import * as useGetCountryData from 'src/hooks/useGetCountryData';
import * as useDispatchAutocompleteData from 'src/hooks/useDispatchAutocompleteData';
import {useInitiateLoqate} from 'src/hooks';
import * as scriptsAreLoaded from 'src/utils/scriptsAreLoaded';
import * as isAutocompleteDataPopulated from 'src/utils/isAutocompleteDataPopulated';
import SpyInstance = jest.SpyInstance;
import {LoqateConstants} from 'src/constants';
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
    let getCountryInfoListMock: Array<ICountryInformation>;
    let mockedLink: HTMLLinkElement;
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
        mockedLink = createLinkElement();
        mockedScript = createScriptElement();

        useDispatchAutocompleteDataSpy = jest.spyOn(useDispatchAutocompleteData, 'useDispatchAutocompleteData');
        useGetCountryInfoListSpy = jest.spyOn(useGetCountryData, 'useGetCountryInfoList');
        scriptsAreLoadedSpy = jest.spyOn(scriptsAreLoaded, 'scriptsAreLoaded');
        isAutocompleteDataPopulatedSpy = jest.spyOn(isAutocompleteDataPopulated, 'isAutocompleteDataPopulated');
        documentCreateElementSpy = jest.spyOn(document, 'createElement');
        documentBodyAppendChildSpy = jest.spyOn(document.body, 'appendChild');
    });

    test('scripts are already loaded and addressData is not empty', () => {
        useGetCountryInfoListSpy.mockReturnValueOnce(getCountryInfoListMock);
        scriptsAreLoadedSpy.mockReturnValueOnce(true);
        isAutocompleteDataPopulatedSpy.mockReturnValueOnce(false);

        renderHook(() => useInitiateLoqate());

        expect(documentCreateElementSpy).not.toHaveBeenCalled();
        expect(documentBodyAppendChildSpy).not.toHaveBeenCalled();
        expect(useDispatchAutocompleteDataSpy).not.toHaveBeenCalled();
    });

    test('scripts are already loaded and addressData is empty', () => {
        useGetCountryInfoListSpy.mockReturnValueOnce(getCountryInfoListMock);
        scriptsAreLoadedSpy.mockReturnValueOnce(true);
        isAutocompleteDataPopulatedSpy.mockReturnValueOnce(true);

        renderHook(() => useInitiateLoqate());

        expect(documentCreateElementSpy).not.toHaveBeenCalled();
        expect(documentBodyAppendChildSpy).not.toHaveBeenCalled();
        expect(useDispatchAutocompleteDataSpy).toHaveBeenCalledTimes(1);
    });

    test('scripts are not loaded and addressData is not empty', () => {
        useGetCountryInfoListSpy.mockReturnValueOnce(getCountryInfoListMock);
        scriptsAreLoadedSpy.mockReturnValueOnce(false);
        isAutocompleteDataPopulatedSpy.mockReturnValueOnce(false);

        renderHook(() => useInitiateLoqate());

        expect(documentCreateElementSpy).toHaveBeenCalledTimes(2);
        expect(documentCreateElementSpy).toHaveBeenCalledWith('script');
        expect(documentCreateElementSpy).toHaveBeenCalledWith('link');
        expect(documentBodyAppendChildSpy).toHaveBeenCalledTimes(2);
        expect(documentBodyAppendChildSpy).toHaveBeenCalledWith(mockedScript);
        expect(documentBodyAppendChildSpy).toHaveBeenCalledWith(mockedLink);
        expect(useDispatchAutocompleteDataSpy).not.toHaveBeenCalled();
    });

    test('scripts are not loaded and addressData is empty', () => {
        useGetCountryInfoListSpy.mockReturnValue(getCountryInfoListMock);
        scriptsAreLoadedSpy.mockReturnValueOnce(false).mockReturnValueOnce(true);
        isAutocompleteDataPopulatedSpy.mockReturnValue(true);

        renderHook(() => useInitiateLoqate());

        expect(documentCreateElementSpy).toHaveBeenCalledTimes(2);
        expect(documentCreateElementSpy).toHaveBeenCalledWith('script');
        expect(documentCreateElementSpy).toHaveBeenCalledWith('link');
        expect(documentBodyAppendChildSpy).toHaveBeenCalledTimes(2);
        expect(documentBodyAppendChildSpy).toHaveBeenCalledWith(mockedScript);
        expect(documentBodyAppendChildSpy).toHaveBeenCalledWith(mockedLink);
        expect(useDispatchAutocompleteDataSpy).toHaveBeenCalledTimes(1);
        expect(isAutocompleteDataPopulatedSpy).toHaveBeenCalledTimes(1);
    });

    test('scripts are loaded, addressData is empty, test useEffect function', () => {
        const listenMock = jest.fn();
        const AddressMock = jest.fn();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.pca = {
            Address: AddressMock
        };
        AddressMock.mockReturnValueOnce({
            listen: listenMock
        });

        useGetCountryInfoListSpy.mockReturnValue(getCountryInfoListMock);
        scriptsAreLoadedSpy.mockReturnValueOnce(true);
        isAutocompleteDataPopulatedSpy.mockReturnValue(true);

        renderHook(
            ({ scriptIsLoaded }) => useInitiateLoqate(scriptIsLoaded),
            {
                initialProps: { scriptIsLoaded: true }
            });

        expect(documentCreateElementSpy).not.toHaveBeenCalled();
        expect(documentBodyAppendChildSpy).not.toHaveBeenCalled();
        expect(useDispatchAutocompleteDataSpy).toHaveBeenCalledTimes(1);
        expect(isAutocompleteDataPopulatedSpy).toHaveBeenCalledTimes(1);
        expect(AddressMock).toHaveBeenCalled();
        expect(listenMock).toHaveBeenCalled();
    });
});

function createLinkElement(): HTMLLinkElement {
    const link: HTMLLinkElement = document.createElement('link');
    link.href = LoqateConstants.CSS_SCRIPT_SRC;
    link.id = LoqateConstants.CSS_SCRIPT_ID;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    return link;
}

function createScriptElement(): HTMLScriptElement {
    const script: HTMLScriptElement = document.createElement('script');
    script.src = LoqateConstants.JS_SCRIPT_SRC;
    script.async = false;
    script.id = LoqateConstants.JS_SCRIPT_ID;
    script.onload = jest.fn();
    return script;
}
