import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatTableModule, MatIconModule, MatPaginatorModule, MatFormFieldModule, MatSortModule, MatInputModule,
    MatCheckboxModule,
} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";
import {
    DjangoCellDef,
    DjangoColumnDef,
    DjangoTableComponent
} from "./django-table/django-table.component";
import {RouterModule} from "@angular/router";
import {DjangoFilterService, DjangoInput} from "./django-filter.service";

@NgModule({
  imports: [
      CommonModule,
      MatTableModule,
      MatIconModule,
      MatPaginatorModule,
      MatFormFieldModule,
      MatInputModule,
      MatPaginatorModule,
      MatSortModule,
      MatCheckboxModule,
      RouterModule,
      FlexLayoutModule,
  ],
  declarations: [
      DjangoTableComponent,
      DjangoColumnDef,
      DjangoCellDef,

      DjangoInput,

      // DjangoFilterService,
  ],
    exports: [
        DjangoTableComponent,
        DjangoColumnDef,
        DjangoCellDef,

        DjangoInput,
        // DjangoFilterService,
    ],
    entryComponents: [
        DjangoInput,
    ]
})
export class DjangoListModule {
    static forRoot(): ModuleWithProviders {
      return {
        ngModule: DjangoListModule,
        providers: [ DjangoFilterService ]
      };
    }

}
