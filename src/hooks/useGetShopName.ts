import {useAppSelector} from 'src/hooks';

export function useGetShopName(): string {
    return useAppSelector((state) => state.data.initial_data.shop_name);
}
