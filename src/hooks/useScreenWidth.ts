import {RootState} from 'src';
import {useAppSelector} from './rootHooks';

export function useScreenWidth(): number {
    return useAppSelector((state: RootState) => state.appSetting.screenWidth);
}
