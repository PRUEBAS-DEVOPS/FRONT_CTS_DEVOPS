import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUsuarios'
})
export class FilterUsuariosPipe implements PipeTransform {
  transform(value: any[], arg: string): any {
    if(!value) {
      return [];
    }
    if(!arg) {
      return value;
    }
    const resultUser = [];
    for (const User of value) {
      if (arg == null || arg.length < 3) { return value; }
      if (User.documento.indexOf(arg) > -1) {
        resultUser.push(User);
      }
      if (User.usuario.toLowerCase().indexOf(arg.toLowerCase()) > -1 || User.nombreCOmpleto.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultUser.push(User);
      }  
    }

    return resultUser;
  }

}
