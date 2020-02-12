import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {DjangoFormComponent} from "angular-django/form/django-form/django-form.component";
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from "@angular/material";


export interface BulkUpdateDialogData {
    queryset: any,
    fields: string[];
}


@Component({
    selector: 'app-bulk-update-dialog',
    templateUrl: './bulk-update-dialog.component.html',
    styleUrls: ['./bulk-update-dialog.component.scss']
})
export class BulkUpdateDialogComponent implements OnInit {

    @ViewChild('form') form: DjangoFormComponent;

    api;
    queryset;
    fields: any[];

    constructor(
        public dialogRef: MatDialogRef<BulkUpdateDialogComponent>,
        public snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: BulkUpdateDialogData) {}

    ngOnInit() {
        this.api = this.data.queryset;
        this.queryset = this.data.queryset;
        this.fields = this.data.fields;

        this.form.onFormSubmit = (data, onSuccess=null) => {
            data = this.form.getSubmitData(data);
            this.queryset.bulk_update(data).subscribe((data) => {
                this.snackBar.open(`Updated ${data.updated} items`, 'Close', {
                    duration: 3000,
                });
                this.dialogRef.close();
            });
        }
    }
}
