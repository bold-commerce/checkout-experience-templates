export const placeHolderTransformer = (data = '', placeHolder: string, active: boolean): string => {
    if (active && data === '') {
        return placeHolder;
    }
    return data;
};