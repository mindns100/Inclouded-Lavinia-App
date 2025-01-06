import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({ providedIn: 'root' })
export class StorageService {

    constructor(
        private storage: Storage
    ) { }

    set(name: any, item: any): Promise<any> {
        return this.storage.set(name, item);
    }

    get(name: any): Promise<any> {
        return this.storage.get(name);
    }

    remove(name: any): Promise<any> {
        return this.storage.remove(name);
    }

    clear(): Promise<void> {
        return this.storage.clear();
    }
}