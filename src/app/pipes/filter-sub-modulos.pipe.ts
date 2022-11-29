import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterSubModulos'
})
export class FilterSubModulosPipe implements PipeTransform {

  transform(value: any[], arg: string): any {
    if(!value) {
      return [];
    }
    if(!arg) {
      return value;
    }
    const resultSubModulo = [];
    for (const SubModul of value) {
      if (arg == null || arg.length < 3) { return value; }
      if (SubModul.Nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultSubModulo.push(SubModul);
      }
      if (SubModul.nombreModulo.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultSubModulo.push(SubModul);
      }
    }
    return resultSubModulo;
  }

}
