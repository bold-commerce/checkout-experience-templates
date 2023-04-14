import {shouldHideRoProperty} from 'src/utils';

export function getLineItemPropertiesForDisplay(properties: Record<string, string>, cartParameters: Record<string, string>): Array<string>{
    return Object.keys(properties)
        .reduce<string[]>((arr, key) => {
            //exclude any properties that start with '_', are blank, or are RO hidden properties
            if(!key.startsWith('_') && properties[key] !== '' && !shouldHideRoProperty(key, cartParameters)){
                arr.push(`${key}: ${properties[key]}`);
            }
            return arr;
        }, []);
}