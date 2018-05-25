import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {ApiService} from "./api.service";

import {SerializerService} from "./serializer.service";

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
    ],
    declarations: [
        // SerializerService,

    ],
    exports: [
        // SerializerService,
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
