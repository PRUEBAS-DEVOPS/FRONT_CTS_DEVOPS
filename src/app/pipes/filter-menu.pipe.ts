import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterMenu'
})
export class FilterMenuPipe implements PipeTransform {

  transform(value: any[], arg: string): any {
    if(!value) {
      return [];
    }
    if(!arg) {
      return value;
    }
    const resultSub=[];
    for(const sub of value){
      if(arg== null || arg.length<3)return value;
      if(sub.opcion.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultSub.push(sub)
      };
    };
    return resultSub;
  }

}
