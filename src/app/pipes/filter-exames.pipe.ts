import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterExames',
})
export class FilterExamesPipe implements PipeTransform {
  transform(value: any[], arg: string): any {
    if(!value) {
      return [];
    }
    if(!arg) {
      return value;
    }
    const resultExam = [];
    for (const Exam of value) {
      if (arg == null || arg.length < 3) { return value; }
      if (Exam.NombreExamen.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultExam.push(Exam);
      }
      if (Exam.CodAthenea.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultExam.push(Exam);
      }
    }
    return resultExam;
  }
}
