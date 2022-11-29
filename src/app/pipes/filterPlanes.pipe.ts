import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPlanes'
})
export class filterPlanesPipe implements PipeTransform {

  transform(value: any[], arg: string): any {
    if(!value) {
      return [];
    }
    if(!arg) {
      return value;
    }
    const resultSed = [];
    for (const Sed of value) {
      if (arg == null || arg.length < 3) { return value; }
      if (Sed.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultSed.push(Sed);
      }
     
    }
    return resultSed;
  }

}
