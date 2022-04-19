import {IApplicationStateCurrency, IUseGetCurrencyInformation} from 'src/types';
import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetCurrencyInformation(showCurrency = false): IUseGetCurrencyInformation {
    const currencyData: IApplicationStateCurrency = useAppSelector((state) => state.data.application_state.currency);
    const currency = currencyData.iso_code;
    const currencySymbol = currencyData.symbol;
    let formattedPrice = currencyData.format;
    if(showCurrency){
        formattedPrice = `${currency} ${formattedPrice}`;
    }
    return {currency, currencySymbol, formattedPrice};
}
