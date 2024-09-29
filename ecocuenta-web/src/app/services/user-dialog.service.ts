import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../components/user-dialog/user-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class UserInfoDialogService {
    constructor(private dialog: MatDialog) { }

    openUserInfoDialog() {
        const dialogRef = this.dialog.open(UserDialogComponent, {
            width: '300px',
            data: { name: '', email: '' }
        });

        return dialogRef.afterClosed();
    }
}