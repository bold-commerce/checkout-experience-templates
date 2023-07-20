import {useAppSelector} from 'src/hooks';
import {ILifeField} from '@boldcommerce/checkout-frontend-library';

export function useGetLifeFields(location: string): Array<ILifeField> {
    return useAppSelector((state) => state.data.initial_data.life_elements)
        .filter(life_field => life_field.location === location);
}