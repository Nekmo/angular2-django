import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ListComponent} from "./list/list.component";
import {
    MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule,
    MatPaginatorModule, MatSelectModule, MatSnackBarModule, MatSortModule,
    MatTableModule,
    MatToolbarModule, MatTooltipModule
} from "@angular/material";
import {DurationComponent, TimeAgoComponent} from "./datetime/datetime.component";
import {MomentModule} from "angular2-moment";
import {RouterModule} from '@angular/router';

export {ListComponent}

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatToolbarModule,
        MatListModule,
        MatIconModule,
        MatFormFieldModule,
        MatTableModule,
        MatCardModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatSortModule,
        MatInputModule,
        MatSelectModule,
        MatMenuModule,
        MatSnackBarModule,
        MomentModule,
        RouterModule,

    ],
    exports: [
        MatButtonModule,
        MatToolbarModule,
        MatListModule,
        MatIconModule,
        MatFormFieldModule,
        MatTableModule,
        MatCardModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatSortModule,
        MatInputModule,
        MatSelectModule,
        MatMenuModule,
        MatSnackBarModule,
        MomentModule,
        RouterModule,
    ],
    declarations: [ListComponent, DurationComponent, TimeAgoComponent]
})
export class ViewsModule { }
