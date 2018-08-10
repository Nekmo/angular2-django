import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {ApiService} from "./api.service";

import {SerializerService} from "./serializer.service";
import {DynamicComponentComponent, ViewContainerDirective} from "./dynamic-component.component";


@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
    ],
    declarations: [
        // SerializerService,
        DynamicComponentComponent,
        ViewContainerDirective,
    ],
    exports: [
        // SerializerService,
        DynamicComponentComponent,
    ]
})
export class DjangoModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DjangoModule,
            providers: [
                // SerializerService
            ]
        };
    }
}
