import {DependencyList, useEffect} from 'react';

export const useAsyncEffect = (
    cb: (
        $: AbortSignal,
        onCleanup: (fn: () => void) => void,
    ) => Promise<void>,
    deps: DependencyList = []
): void => {
    useEffect(() => {
        const controller = new AbortController();
        const cleanupListeners: (() => void)[] = [];
        cb(controller.signal, cleanupListeners.push.bind(cleanupListeners));

        return () => {
            controller.abort();
            for (const listener of cleanupListeners) {
                listener();
            }
        };
    }, deps);
};