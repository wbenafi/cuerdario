import { Redirect } from 'expo-router';

import { appRoutes } from '../src/navigation/routes';

export default function IndexRoute() {
  return <Redirect href={appRoutes.tuner} />;
}
