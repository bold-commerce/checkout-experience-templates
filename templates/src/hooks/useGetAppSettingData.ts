import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetAppSettingData(field: string): string | boolean {
    return useAppSelector((state) => state.appSetting[field]);
}
