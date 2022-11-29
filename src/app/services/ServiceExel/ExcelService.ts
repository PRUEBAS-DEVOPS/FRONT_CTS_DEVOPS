import{Injectable} from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8';
const EXCEL_EXTENSION='xlsx';

@Injectable()

export class ExcelService{
    constructor(){}

    public exportAsExcelFile(json: any[],excelfilename:string):void{
        const worksheet: XLSX.WorkSheet= XLSX.utils.json_to_sheet(json);
        const workbook:XLSX.WorkBook={Sheets:{'data':worksheet},SheetNames:['data']};       
        const excelBuffer: any = XLSX.write(workbook,{bookType:'xlsx',type:'array'});

        this.saveAsExcelFile(excelBuffer,excelfilename);
    }

    private saveAsExcelFile(buffer:any,filename:string):void{
        const data: Blob=new Blob([buffer],{type:EXCEL_TYPE});
        FileSaver.saveAs(data,filename+'_Export_'+ new Date().getTime()+EXCEL_EXTENSION)
    }
}
