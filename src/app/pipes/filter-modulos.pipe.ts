import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterModulos'
})
export class FilterModulosPipe implements PipeTransform {

  transform(value: any[], arg: string): any {
    if(!value) {
      return [];
    }
    if(!arg) {
      return value;
    }
    const resultModul = [];
    for (const Modul of value) {
      if (arg == null || arg.length < 3) { return value; }
      if (Modul.modulo.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultModul.push(Modul);
      }
    }
    return resultModul;
  }

}
