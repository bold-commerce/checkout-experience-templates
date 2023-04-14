import {defaultOrderInitialization} from 'src/constants/orderInitialization';

const {data:{jwt_token, public_order_id}} = defaultOrderInitialization;

export const jwtTokenReducer = (state = jwt_token): string => state;

export const publicOrderIdReducer = (state = public_order_id): string => state;

