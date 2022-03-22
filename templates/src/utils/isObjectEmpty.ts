
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isObjectEmpty(object): boolean {
    return object ? Object.values(object).every(x => x === null || x === '' || x === undefined) : true;
}
