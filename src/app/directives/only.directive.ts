import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';
import {NgControl} from '@angular/forms';
import {DecimalPipe} from '@angular/common';

@Directive({
  selector: '[appOnly]'
})
export class OnlyDirective {

  @Input('appOnly') type: 'Letters' | 'Numbers' | 'NumbersLetters' 
     | 'Address'  | 'User' | 'Spaces' | 'DecimalValores' | 'NumbersLettersDot' | 'NumbersLettersOnly' | 'NumbersLettersPG' | 'NumbersLettersLine' | 'LettersOnly';
  @Input() option:  'Lower' | 'Upper';

  blank = new RegExp(/^[\ ]+|[\ ]{2,}?|[\ ]+$/g);
  lastword = new RegExp(/([a-zA-z]+$)/g);
  decimalPipe: DecimalPipe;

  constructor(private el: ElementRef, private render: Renderer2, private control: NgControl) {
    this.decimalPipe = new DecimalPipe('en-US');
  }

  @HostListener('input') oninput() {
    const abstractControl  = this.control.control;
    let value = this.el.nativeElement.value;
    let r;
    let result;
    if (this.type === 'Letters') { // no permite caracteres
      r = new RegExp(/[0-9_-]+/g);
      result = value.replace(r, '');
      r = new RegExp(/[\\#+\[\]@$~%'":*¿?<°(),.&/|¨´;>{}!¡=]/g);
      result = result.replace(r, '');
      this.render.setProperty(this.el.nativeElement, 'value', result);
      abstractControl?.setValue(result);
    }
    if (this.type === 'LettersOnly') { // permite caracteres -(&)/
      r = new RegExp(/[0-9_]+/g);
      result = value.replace(r, '');
      r = new RegExp(/[\\#+\[\]@$~%'":*¿?<°|¨´;>{}!¡=]/g);
      result = result.replace(r, '');
      this.render.setProperty(this.el.nativeElement, 'value', result);
    }
    if (this.type === 'Numbers') {
      r = new RegExp(/\D/g);
      result = value.replace(r, '');
      this.render.setProperty(this.el.nativeElement, 'value', result);
      this.control.valueAccessor?.writeValue(result);
      abstractControl?.setValue(result);
    }
    if (this.type === 'NumbersLetters') {// no permite caracteres
      r = new RegExp(/[\\#+\[\]@$~|¬^°¨%'"_;&:*¿?<>(/´)\-,.{}!¡=]/g);
      result = value.replace(r, '');
      this.render.setProperty(this.el.nativeElement, 'value', result);
      abstractControl?.setValue(result);
    }
    if (this.type === 'NumbersLettersOnly') {// permite caracteres ()-/&.,
      r = new RegExp(/[\\#+\[\]@$~|¬^°¨%'"_;:*¿?<>{}!¡=]/g);
      result = value.replace(r, '');
      this.render.setProperty(this.el.nativeElement, 'value', result);
      abstractControl?.setValue(result);
    }
    if (this.type === 'NumbersLettersPG') {// permite caracteres ()-/&.,
      r = new RegExp(/[\\#+\[\]@$~|¬^°¨'"_;:*¿?<>{}!¡=]/g);
      result = value.replace(r, '');
      this.render.setProperty(this.el.nativeElement, 'value', result);
      abstractControl?.setValue(result);
    }
    if (this.type === 'NumbersLettersLine') {// permite guion -
      r = new RegExp(/[\\#+\[\]@$~|¬^°¨%'"_;&:*¿?<>(),.{´}!¡=]/g);
      result = value.replace(r, '');
      this.render.setProperty(this.el.nativeElement, 'value', result);
      abstractControl?.setValue(result);
    }
    if (this.type === 'NumbersLettersDot') {// permite .
      r = new RegExp(/[\\#+\[\]@$~|¬^°¨%'"_;&:*¿?<>(/´)\-,{}!¡=]/g);
      result = value.replace(r, '');
      this.render.setProperty(this.el.nativeElement, 'value', result);
      abstractControl?.setValue(result);
    }
    if (this.type === 'User') {// No permite espacios y solo permite . - _ * /
      r = new RegExp(/[\\#+\[\]@$~|¬^°¨%'"&¿?<>´{}!¡,()=:;]/g);
      result = value.trim().replace(r, '');
      this.render.setProperty(this.el.nativeElement, 'value', result);
      abstractControl?.setValue(result);
    }
    if (this.type == 'Spaces'){// No permite espacios y solo permite . - _
      r = new RegExp(/[\\#+\[\]$~|¬^°¨%'"&¿?<>´{}!¡*/,()=:;]/g);
      result = value.trim().replace(r, '');
      this.render.setProperty(this.el.nativeElement, 'value', result);
      abstractControl?.setValue(result);
    }
    if (this.type === 'Address') {
      r = new RegExp(/[\\+\[\]&,|()@$~%¨'";:*°´_¿?<>{}!¡=]/g);
      result = value.replace(r, '');
      this.render.setProperty(this.el.nativeElement, 'value', result);
      abstractControl?.setValue(result);
    }

    if (this.option === 'Lower') {
      value = result.toLowerCase();
      this.render.setProperty(this.el.nativeElement, 'value', value);
      this.setValueControl(abstractControl, value);
    }
    if (this.option === 'Upper') {
      if (result) {
        value = result.toUpperCase();
        this.render.setProperty(this.el.nativeElement, 'value', value);
        this.setValueControl(abstractControl, value);
      }
    }
  }

  @HostListener('change') onchange() {
    let value = this.el.nativeElement.value;
    value = value.trim();
    if (value === '') {
      value = null;
      const abstractControl = this.control.control;
      abstractControl?.setValue(value);
      abstractControl?.updateValueAndValidity();
    }
    this.render.setProperty(this.el.nativeElement, 'value', value);
  }

  setValueControl(abstractControl:any, value:any) {
    if (abstractControl) {
      abstractControl.setValue(value);
    }
  }

}

