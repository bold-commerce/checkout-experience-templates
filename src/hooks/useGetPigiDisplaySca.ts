import {useAppSelector} from 'src/hooks';

export function useGetPigiDisplaySca(): boolean {
    return useAppSelector((state) => state.appSetting.pigiDisplaySca);
}
