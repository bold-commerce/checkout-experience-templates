import {useAppSelector} from 'src/hooks';

export function useCallApiAtOnEvents(): boolean {
    return useAppSelector((state) => state.appSetting.callApiAtOnEvents);
}
