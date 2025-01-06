import { TranslatePipe } from './pipes/translate.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslateService } from './services/translate.service';
export function setupTranslateFactory(service: TranslateService) {
    return () => service.use(null);
}
@NgModule({
    declarations: [TranslatePipe],
    imports: [CommonModule, HttpClientModule],
    exports: [TranslatePipe],
    providers: [TranslatePipe],
})
export class TranslateModule { }