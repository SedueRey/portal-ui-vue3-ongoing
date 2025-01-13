import { randomIntFromInterval } from '../utils';

import Widget from './models/Widget';

export function DashboardWidgetMockService() {
  return Promise.resolve(Widget());
}
export function DashboardWidgetsMockService(min, max) {
  const random = randomIntFromInterval(min, max);
  const returnData = [];
  for (let index = 0; index < random; index += 1) {
    returnData.push(Widget() as never);
  }
  return Promise.resolve(returnData);
}
