import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTarifas',
})
export class FilterTarifasPipe implements PipeTransform {
  transform(value: any[], arg: string): any {
    if(!value) {
      return [];
    }
    if(!arg) {
      return value;
    }
    const resultTarif = [];
    for (const Tarif of value) {
      if (arg == null || arg.length < 3) { return value; }
      if (Tarif.CodTarifa.toString().toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultTarif.push(Tarif);
      }
      if (Tarif.NombreTarifa.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultTarif.push(Tarif);
      }
    }

    return resultTarif;
  }
}
