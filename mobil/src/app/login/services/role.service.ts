import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    collectionName = 'Roles';

    constructor(
        private afs: AngularFirestore
    ) { }

    async getRoleByUser(user: any) {
        if (user) {
            const role: any = await this.afs.collection(this.collectionName, ref => {
                let query: CollectionReference | Query = ref;
                query = query.where('uid', '==', user.uid);
                return query;
            }).valueChanges().pipe(take(1)).toPromise();
            return role[0];
        } else {
            return { code: 'anonymous' };
        }
    }
}
