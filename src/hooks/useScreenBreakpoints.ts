import {IUseScreenBreakpoints} from 'src/types';
import {useScreenWidth} from 'src/hooks';
import {MOBILE_SCREEN_WIDTH, TABLET_SCREEN_WIDTH} from 'src/constants';

export function useScreenBreakpoints(): IUseScreenBreakpoints {
    const screenWidth = useScreenWidth();
    const isMobile = screenWidth < MOBILE_SCREEN_WIDTH;
    const isTablet = screenWidth >= MOBILE_SCREEN_WIDTH && screenWidth < TABLET_SCREEN_WIDTH;
    const isDesktop = screenWidth >= TABLET_SCREEN_WIDTH;

    return {isMobile, isTablet, isDesktop};
}
