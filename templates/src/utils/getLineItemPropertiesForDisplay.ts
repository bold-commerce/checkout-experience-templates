export function getLineItemPropertiesForDisplay(properties: Record<string, string>): Array<string>{
    return Object.keys(properties)
        .reduce<string[]>((arr, key) => {
            //exclude any properties that start with '_' or are blank
            if(!key.startsWith('_') && properties[key] !== ''){
                arr.push(`${key}: ${properties[key]}`);
            }
            return arr;
        }, []);
}