import { Injectable } from '@angular/core';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/firestore';
import { TranslatePipe } from 'src/app/shared/translate/pipes/translate.pipe';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

export class LogItem {
    id: string;
    title: string;
    subtitle: string;
    type: string;
    uid: string;
    versionNumber: string;
    versionCode: string;
    packageName: string;
    cordova: boolean;
    platform: string;
    timeStamp: string;
    email: string;
    currentUrl: string;
    appName: string;
    constructor(
        title: string = null,
        subtitle: any = null,
        type: string = null,
        uid: string = null,
        versionNumber: string = null,
        versionCode: string = null,
        packageName: string = null,
        cordova: boolean = false,
        platform: string = null,
        timeStamp: string = null,
        email: string = null,
        currentUrl: string = null,
        appName: string = null
    ) {
        this.title = title ? (typeof title !== 'string' ? JSON.stringify(title) : title) : title;
        this.subtitle = subtitle ? (typeof subtitle !== 'string' ? JSON.stringify(subtitle) : subtitle) : subtitle;
        this.type = type;
        this.uid = uid;
        this.versionNumber = versionNumber;
        this.versionCode = versionCode;
        this.packageName = packageName;
        this.cordova = cordova;
        this.platform = platform;
        this.timeStamp = timeStamp || new Date().toISOString();
        this.email = email;
        this.currentUrl = currentUrl;
        this.appName = appName;
    }
}

@Injectable({ providedIn: 'root' })
export class LoggerService {

    private isCordova: boolean;
    private offlineLog: LogItem[] = [];
    private uid: string = null;
    private versionCode: string = null;
    private versionNumber: string = null;
    private packageName: string = null;
    private appName: string = null;
    private plt: string = null;
    private logCollectionName = 'SystemLog';
    private loading: HTMLIonLoadingElement;
    private LOGLEVEL: 'NONE' | 'OFFLINE' | 'ANALYTICS' | 'ONLINE' = 'NONE';
    private workgroupId: string = null;
    private email: string = null;

    constructor(
        private storage: StorageService,
        private alertController: AlertController,
        private toastController: ToastController,
        private loadingController: LoadingController,
        private platform: Platform,
        private analytics: AngularFireAnalytics,
        private afs: AngularFirestore,
        private translate: TranslatePipe,
        private router: Router
    ) {
        this.platform.ready().then(async () => {
            await this.init();
            this.plt = this.platform.platforms().join(',');
            this.isCordova = this.platform.is('cordova');
        });
    }

    private init(): Promise<void> {
        return new Promise(async (resolve) => {
            try {
                const offlineLog = await this.loadLog();
                if (offlineLog) {
                    this.offlineLog = offlineLog;
                } else {
                    this.offlineLog = [];
                }
                resolve();
            } catch (error) {
                this.offlineLog = [];
                resolve();
            }
        });
    }

    getOfflineLog() { return this.offlineLog; }

    setUserId(uid: string) {
        this.uid = uid;
        this.analytics.setUserId(uid).then(() => {
            if (this.LOGLEVEL === 'ONLINE') {
                this.uploadOldLog();
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    getUserId() { return this.uid; }

    setCordova(cordova: boolean) { this.isCordova = cordova; }

    getCordova() { return this.isCordova; }

    setVersionCode(versionCode) { this.versionCode = versionCode; }

    getVersionCode(): string { return this.versionCode; }

    setVersionNumber(versionNumber: string) { this.versionNumber = versionNumber; }

    getVersionNumber(): string { return this.versionNumber || environment.version; }

    setPackageName(packageName: string) { this.packageName = packageName; }

    getPackageName(): string { return this.packageName; }

    setAppName(appName: string) { this.appName = appName; }

    getAppName(): string { return this.appName; }

    setEmail(email: string) { this.email = email; }

    getEmail(): string { return this.email; }

    setWorkgroupId(workgroupId: string) { this.workgroupId = workgroupId; }

    getWorkgroupId(): string { return this.workgroupId || null; }

    private logAnalytics(eventName: string, params: any = {}) {
        if (this.getUserId() !== null) {
            params.uid = this.getUserId();
            params.when = new Date().toISOString();
            params.versionNumber = this.getVersionNumber();
            params.versioncode = this.getVersionCode();
            params.packageName = this.getPackageName();
            this.analytics.logEvent(eventName, params).then(() => {
                console.log(eventName);
            }).catch((error) => {
                console.error(error);
            });
        }
    }

    async showToast(message: string = '', color: string = 'primary', duration: number = 1000, position: 'top' | 'bottom' | 'middle' = 'bottom') {
        const toast = await this.toastController.create({
            message: message,
            color: color,
            duration: duration,
            position: position,
            cssClass: 'ion-text-center',
            mode: 'ios'
        });
        await toast.present();
    }

    async handleError(error: any, show = false) {
        console.log(' ----- ERROR ----- ');
        console.log(error);
        const header = error.code || error.header || 'ERROR';
        const title = error.msg || error.message || error.data || error.reason || error || '';
        const subtitle = error.error || '';
        this.addLogItem(title, error, 'error');
        if (show) {
            const alert = await this.alertController.create({
                header: this.translate.transform(header),
                subHeader: this.translate.transform(title),
                message: this.translate.transform(subtitle),
                backdropDismiss: false,
                buttons: [this.translate.transform('OK')]
            });
            await alert.present();
            await alert.onDidDismiss();
        }
    }

    async presentLoading(message: string = undefined): Promise<void> {
        await this.dismissLoading();
        return new Promise(async (resolve) => {
            this.loading = await this.loadingController.create({ message: message, backdropDismiss: false });
            await this.loading.present();
            resolve();
        });
    }

    dismissLoading(): Promise<void> {
        return new Promise(async (resolve) => {
            if (this.loading) { await this.loading.dismiss(); }
            resolve();
        });
    }

    presentPasswordALert(header: string, message: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const alert = await this.alertController.create({
                header: header,
                message: message,
                backdropDismiss: false,
                inputs: [
                    {
                        name: 'password',
                        type: 'password'
                    }
                ],
                buttons: [
                    {
                        text: this.translate.transform('CANCEL'),
                        handler: () => {
                            reject();
                        }
                    },
                    {
                        text: this.translate.transform('OK'),
                        handler: (data) => {
                            resolve(data.password);
                        }
                    }
                ]
            });
            await alert.present();
        });
    }

    presentConfirmALert(header: string, message: string, rejectText: string = null, resolveText: string = null, yesDelete: boolean = false): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const alert = await this.alertController.create({
                header: this.translate.transform(header),
                message: this.translate.transform(message),
                backdropDismiss: false,
                buttons: [
                    {
                        text: rejectText || this.translate.transform('NO'),
                        cssClass: !yesDelete ? 'delete-button' : '',
                        handler: () => {
                            reject();
                        }
                    },
                    {
                        text: resolveText || this.translate.transform('YES'),
                        cssClass: yesDelete ? 'delete-button' : '',
                        handler: () => {
                            resolve();
                        }
                    }
                ]
            });
            await alert.present();
        });
    }

    getSystemLog(uid: string, startDate: Date, endDate: Date, onlyErrors: boolean = false) {
        return this.afs.collection(this.logCollectionName, ref => {
            let query: CollectionReference | Query = ref;
            query = query.where('uid', '==', uid);
            query = query.where('timeStamp', '<', endDate.toISOString());
            query = query.where('timeStamp', '>=', startDate.toISOString());
            if (onlyErrors) {
                query = query.where('type', '==', 'error');
            }
            query = query.orderBy('timeStamp', 'desc');
            return query;
        }).valueChanges();
    }

    private async uploadOldLog() {
        if (this.offlineLog.length > 0) {
            let error = null;
            for (var i = 0, len = this.offlineLog.length; i < len; ++i) {
                const oldLogItem = this.offlineLog[i];
                const newLogItem = {
                    id: null,
                    title: oldLogItem.title,
                    subtitle: oldLogItem.subtitle,
                    type: oldLogItem.type,
                    uid: this.getUserId(),
                    versionNumber: this.getVersionNumber(),
                    versionCode: this.getVersionCode(),
                    packageName: this.getPackageName(),
                    cordova: this.isCordova,
                    platform: this.plt,
                    currentUrl: this.router.url,
                    email: this.email,
                    appName: this.getAppName(),
                    timeStamp: new Date(oldLogItem.timeStamp).toISOString()
                };
                try {
                    await this.addSystemLog(newLogItem, false);
                } catch (e) {
                    error = e;
                }
            }
            if (!error) {
                this.offlineLog = [];
                this.storeLog(this.offlineLog);
            }
        }
    }

    async addLogItem(title: string = null, subtitle: any = null, type: string = 'info', timeStamp: string = null) {
        const item = new LogItem(title, subtitle, type, this.getUserId(), this.getVersionNumber(), this.getVersionCode(), this.getPackageName(), this.isCordova, this.plt, timeStamp, this.email, this.router.url, this.getAppName());
        try {
            await this.addSystemLog(item);
        } catch (error) {
            console.error(error);
        }
    }

    private addSystemLog(item: LogItem, isNew: boolean = true): Promise<void> {
        console.log(JSON.stringify(item));
        return new Promise(async (resolve, reject) => {
            let error = null;
            let analytics = false;
            if (this.LOGLEVEL === 'NONE') { resolve(); return; }
            if (this.LOGLEVEL === 'ANALYTICS') { analytics = true; }
            if (this.LOGLEVEL === 'ONLINE' && item.uid !== null) {
                analytics = true;
                try {
                    item.id = this.afs.createId();
                    await this.afs.collection(this.logCollectionName).doc(item.id).set(Object.assign({}, item));
                } catch (e) { error = e; }
            }
            if (this.LOGLEVEL === 'OFFLINE' || error && isNew || item.uid === null) {
                this.pushOfflineLog(item);
            }
            if (analytics) {
                this.logAnalytics(item.type === 'error' ? 'error_happened' : item.title.toLowerCase());
            }
            if (error) { reject(error); return; }
            resolve(); return;
        });
    }

    private async pushOfflineLog(item: LogItem) {
        try {
            this.offlineLog.push(item);
            await this.storeLog(this.offlineLog);
        } catch (error) {
            console.error(error);
        }
    }

    private loadLog(): Promise<LogItem[]> { return this.storage.get('log-array'); }

    private storeLog(log: LogItem[]): Promise<LogItem[]> { return this.storage.set('log-array', log); }
}