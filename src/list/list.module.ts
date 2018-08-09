import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatTableModule, MatIconModule, MatPaginatorModule, MatFormFieldModule, MatSortModule,
} from "@angular/material";
import {
    DjangoCellDef,
    DjangoColumnDef,
    DjangoTableComponent
} from "./django-table/django-table.component";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
      CommonModule,
      MatTableModule,
      MatIconModule,
      MatPaginatorModule,
      MatFormFieldModule,
      MatPaginatorModule,
      MatSortModule,
      RouterModule,

  ],
  declarations: [
      DjangoTableComponent,
      DjangoColumnDef,
      DjangoCellDef,
  ],
    exports: [
        DjangoTableComponent,
        DjangoColumnDef,
        DjangoCellDef,
    ]
})
export class DjangoListModule { }
