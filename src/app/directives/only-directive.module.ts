import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlyDirective } from './only.directive';


@NgModule({
  declarations: [OnlyDirective],
  imports: [
    CommonModule,
  ],
  exports:[
    OnlyDirective
  ]
})
export class OnlyModule {
}