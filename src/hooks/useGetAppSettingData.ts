import {useAppSelector} from 'src/hooks/rootHooks';
import {IEpsPayments} from 'src/types';

export function useGetAppSettingData(field: string): string | boolean | IEpsPayments {
    return useAppSelector((state) => state.appSetting[field]);
}
