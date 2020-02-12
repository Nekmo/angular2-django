import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material";
import {BulkUpdateDialogComponent, BulkUpdateDialogData} from "./bulk-update-dialog/bulk-update-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class BulkUpdateService {

    constructor(public dialog: MatDialog) {}

    openDialog(data: BulkUpdateDialogData) {
        const dialogRef = this.dialog.open(BulkUpdateDialogComponent, {
            width: '800px',
            data: data,
        });

        dialogRef.afterClosed().subscribe(() => {
            console.log('The dialog was closed');
        });
        return dialogRef;
    }
}
