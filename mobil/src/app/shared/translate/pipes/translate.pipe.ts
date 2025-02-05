import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../services/translate.service';
@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) { }
  transform(key: any): any {
    return this.translateService.translation[key] || key;
  }
}
