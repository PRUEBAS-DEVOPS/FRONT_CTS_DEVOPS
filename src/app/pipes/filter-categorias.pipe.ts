import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCategorias',
})
export class FilterCategoriasPipe implements PipeTransform {
  transform(value: any[], arg: string): any {
    if(!value) {
      return [];
    }
    if(!arg) {
      return value;
    }
    const resultCateg = [];
    for (const Categ of value) {
      if (arg == null || arg.length < 3) { return value; }
      if (Categ.Nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultCateg.push(Categ);
      }
    }
    return resultCateg;
  }
}
