import { handleGetVersion } from './handler/handleGetVersion';
import { $appVersionStore, getAppVersionFx } from './model';

getAppVersionFx.use(handleGetVersion);

$appVersionStore.on(getAppVersionFx.doneData, (_, data) => data);
