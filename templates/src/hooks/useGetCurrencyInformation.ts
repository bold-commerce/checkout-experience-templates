import {IUseGetCurrencyInformation} from 'src/types';

export function useGetCurrencyInformation(showCurrency = false): IUseGetCurrencyInformation {
    // TODO CE-415 - retrieve the information from application state once PAPI team implement it on init endpoint
    const currency = window.currency;
    const currencySymbol = window.currencySymbol;
    let formattedPrice = currencySymbol+'{{amount}}';
    if(showCurrency){
        formattedPrice = `${currency} ${formattedPrice}`;
    }
    return {currency, currencySymbol, formattedPrice};
}
