import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetGeneralSettingCheckoutFields(field: string): string | boolean {
    return useAppSelector((state) =>  state.data.initial_data.general_settings.checkout_process[field]);
}
