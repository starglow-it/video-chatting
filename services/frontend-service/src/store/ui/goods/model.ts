import { uiDomain } from '../domain/model';

export const $isGoodsVisible = uiDomain.createStore<boolean>(false);

export const setIsGoodsVisible =
    uiDomain.createEvent<boolean>('setIsGoodsVisible');
export const toggleIsGoodsVisible = uiDomain.createEvent(
    'toggleIsGoodsVisible',
);
