import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPlanes',
})
export class FilterPlanesPipe implements PipeTransform {
  transform(value: any[], arg: string): any {
    if(!value) {
      return [];
    }
    if(!arg) {
      return value;
    }
    const resultPlanes = [];
    for (const Plant of value) {
      if (arg == null || arg.length < 3) { return value; }
      if (Plant.CodPlan.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultPlanes.push(Plant);
      }
      if (Plant.NombrePlan.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultPlanes.push(Plant);
      }
    }
    return resultPlanes;
  }
}
