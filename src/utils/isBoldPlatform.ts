import {PlatformTypeConstants} from 'src/constants';

export function isBoldPlatform(): boolean {
    return window.platformType === PlatformTypeConstants.BOLD_PLATFORM;
}
