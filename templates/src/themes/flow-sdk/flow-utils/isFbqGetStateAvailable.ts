
export function isFbqGetStateAvailable(): boolean {
    const isAvailable = window.fbq
        && typeof window.fbq === 'function'
        && window.fbq.getState
        && typeof window.fbq.getState === 'function';
    return !!isAvailable;
}
