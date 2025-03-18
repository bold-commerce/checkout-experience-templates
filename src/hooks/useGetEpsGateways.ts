import {useAppSelector} from 'src/hooks';

export function useGetEpsGateways(): boolean {
    const epsGateway = useAppSelector((state) => state.data.initial_data.eps_gateways);
    return Object.keys(epsGateway).length > 0;
}

