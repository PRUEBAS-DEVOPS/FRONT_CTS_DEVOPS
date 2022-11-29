import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], arg: string): any {
    if(!value) {
      return [];
    }
    if(!arg) {
      return value;
    }
    const resultSedes=[];
    for(const sedes of value){
      if(arg== null || arg.length<3)return value;
      if(sedes.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultSedes.push(sedes)
      };
    };
    return resultSedes;
  }

}
