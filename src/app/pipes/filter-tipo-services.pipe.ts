import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTipoServices'
})
export class FilterTipoServicesPipe implements PipeTransform {

  transform(value: any[], arg: string): any {
    if(!value) {
      return [];
    }
    if(!arg) {
      return value;
    }
    const resultServicesTip = [];
    for (const TipServives of value) {
      if (arg == null || arg.length < 3) { return value; }
      if (TipServives.TipoServicio.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultServicesTip.push(TipServives);
      }
     
    }
    return resultServicesTip;
  }

}
