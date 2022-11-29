import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPerfiles'
})
export class FilterPerfilesPipe implements PipeTransform {

  transform(value: any[], arg: string): any {
    if(!value) {
      return [];
    }
    if(!arg) {
      return value;
    }
    const resultPerfil = [];
    for (const Perf of value) {
      if (arg == null || arg.length < 3) { return value; }
      if (Perf.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultPerfil.push(Perf);
      }
    }
    return resultPerfil;
  }

}
