import { $routeToChangeStore, setRouteToChangeEvent } from './model';

$routeToChangeStore.on(setRouteToChangeEvent, (oldRoute, newRoute) => newRoute);
