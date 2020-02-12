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
import  {
    BulkUpdateDialogComponent,
} from "./bulk-update-dialog/bulk-update-dialog.component"
import {RouterModule} from "@angular/router";
import {DjangoFilterService, DjangoInput} from "./django-filter.service";
import {DjangoFormModule} from "../form/form.module"

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

      DjangoFormModule,
  ],
  declarations: [
      DjangoTableComponent,
      DjangoColumnDef,
      DjangoCellDef,

      DjangoInput,
      BulkUpdateDialogComponent,

      // DjangoFilterService,
  ],
    exports: [
        DjangoTableComponent,
        DjangoColumnDef,
        DjangoCellDef,

        DjangoInput,
        BulkUpdateDialogComponent,
        // DjangoFilterService,
    ],
    entryComponents: [
        DjangoInput,
        BulkUpdateDialogComponent,
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
