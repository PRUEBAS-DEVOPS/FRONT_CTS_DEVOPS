import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterChequeos',
})
export class FilterChequeosPipe implements PipeTransform {
  transform(value: any[], arg: string): any {
    if(!value) {
      return [];
    }
    if(!arg) {
      return value;
    }
    const resultCheq = [];
    for (const Cheque of value) {
      if (arg == null || arg.length < 3) { return value; }
      if (Cheque.CodAthenea.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultCheq.push(Cheque);
      }
      if (Cheque.NombreChequeo.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultCheq.push(Cheque);
      }
    }
    return resultCheq;
  }
}
