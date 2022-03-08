import {ICountryInformation} from 'src/types';
import {useAppSelector} from 'src/hooks';

export function useGetCountryInfoList(): ICountryInformation[]{
    return useAppSelector((state) => state.data.initial_data.country_info);
}

export function useGetCountryInfoByCountryCode(country_code: string): ICountryInformation | undefined{
    const countryList = useAppSelector((state) => state.data.initial_data.country_info);
    const countryInfo: ICountryInformation = countryList.find(o => o.iso_code === country_code);
    return countryInfo;
}
