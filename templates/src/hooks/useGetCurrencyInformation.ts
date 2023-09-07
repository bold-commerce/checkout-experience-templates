import {IUseGetCurrencyInformation} from 'src/types';
import {useAppSelector} from 'src/hooks/rootHooks';
import {renderHtmlEntities} from 'src/utils';
import {ICurrency} from '@boldcommerce/checkout-frontend-library';

export function useGetCurrencyInformation(showCurrency = false): IUseGetCurrencyInformation {
    const currencyData: ICurrency = useAppSelector((state) => state.data.application_state.currency);
    const displayCurrencyData: ICurrency = useAppSelector((state) => state.data.application_state?.display_currency);
    let currency, currencySymbol, formattedPrice;
    if (displayCurrencyData) {
        currency = displayCurrencyData.iso_code;
        currencySymbol = displayCurrencyData.symbol;
        formattedPrice = renderHtmlEntities(displayCurrencyData.format);
    } else {
        currency = currencyData.iso_code;
        currencySymbol = currencyData.symbol;
        formattedPrice = renderHtmlEntities(currencyData.format);
    }
    if (showCurrency) {
        formattedPrice = `${currency} ${formattedPrice}`;
    }
    return {currency, currencySymbol, formattedPrice};
}
