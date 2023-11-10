import {META_TIMEOUT_SECONDS} from 'src/themes/flow-sdk/constants';

export function getTimerLog(startTime: number): string {
    const endTime = Math.floor(Date.now() / 1000);
    const elapsedTime = endTime - startTime;
    const isTimeout = elapsedTime > META_TIMEOUT_SECONDS ? 'TIMEOUT' : '';

    return `${isTimeout} elapsedTime: ${elapsedTime.toFixed(3)}s endTime: ${endTime.toFixed(3)}s`;
}