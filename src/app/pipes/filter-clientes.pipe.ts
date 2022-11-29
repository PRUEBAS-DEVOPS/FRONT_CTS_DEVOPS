import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterClientes',
})
export class FilterClientesPipe implements PipeTransform {
  transform(value: any[], arg: string): any {
    if(!value) {
      return [];
    }
    if(!arg) {
      return value;
    }
    const resultCliente = [];
    for (const Client of value) {
      if (arg == null || arg.length < 3) { return value; }
      if (Client.razonsocial.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultCliente.push(Client);
      }
      if (Client.nit.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultCliente.push(Client);
      }
    }
    return resultCliente;
  }
}
