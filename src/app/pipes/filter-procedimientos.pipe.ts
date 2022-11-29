import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProcedimientos'
})
export class FilterProcedimientosPipe implements PipeTransform {

  transform(value: any[], arg: string): any {
    if(!value) {
      return [];
    }
    if(!arg) {
      return value;
    }
    const resultExam=[];
    for(const Exam of value){
      if(arg== null || arg.length<3)return value;
      if(Exam.Procedimiento.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultExam.push(Exam)
      };
    };
    for(const Exam of value){
      if(arg== null || arg.length<3)return value;
      if(Exam.CodProcedimiento.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultExam.push(Exam)
      };
    };
    return resultExam;
  }  

}
