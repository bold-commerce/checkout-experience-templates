const hooks: Record<string, {name: string, hook: () => unknown}> = {};
const hooksResult: Record<string, unknown> = {};

export function setHook(name: string, hook: () => unknown): void {
    hooks[name] = {name, hook};
}

export function getHook(name: string): unknown {
    return hooksResult[name];
}

export function executeHooks(): void {
    Object.values(hooks).forEach(( item ) => {
        hooksResult[item.name] = item.hook();
    });
}
