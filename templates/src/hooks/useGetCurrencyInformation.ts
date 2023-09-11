import {IUseGetCurrencyInformation} from 'src/types';
import {useAppSelector} from 'src/hooks/rootHooks';
import {renderHtmlEntities} from 'src/utils';
import {ICurrency} from '@boldcommerce/checkout-frontend-library';

export function useGetCurrencyInformation(showCurrency = false): IUseGetCurrencyInformation {
    const currencyData: ICurrency = useAppSelector((state) => state.data.application_state.currency);
    const currency = currencyData.iso_code;
    const currencySymbol = currencyData.symbol;
    let formattedPrice = renderHtmlEntities(currencyData.format);
    if(showCurrency){
        formattedPrice = `${currency} ${formattedPrice}`;
    }
    return {currency, currencySymbol, formattedPrice};
}
