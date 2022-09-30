import { $isGoodsVisible, setIsGoodsVisible, toggleIsGoodsVisible } from './model';

$isGoodsVisible
    .on(setIsGoodsVisible, (state, data) => data)
    .on(toggleIsGoodsVisible, state => !state);
