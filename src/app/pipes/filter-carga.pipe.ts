import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCarga'
})
export class FilterCargaPipe implements PipeTransform {

  transform(value: any, args: any): any {
    const result = [];
    if (value != '' && value != null) {
      for (const item of value) {

          if (item.Estado.toLowerCase().indexOf(args.toLowerCase()) > -1) {
            result.push(item);
          } 
      }
    }
    return result;
  }

}
