import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatTableModule, MatIconModule, MatPaginatorModule, MatFormFieldModule, MatSortModule,
} from "@angular/material";
import {DjangoTableComponent} from "./django-table/django-table.component";
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
      RouterModule

  ],
  declarations: [
      DjangoTableComponent
  ],
    exports: [
        DjangoTableComponent,
    ]
})
export class DjangoListModule { }
