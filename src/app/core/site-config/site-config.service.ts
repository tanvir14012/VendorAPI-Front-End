import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { SmsConfig, SmtpConfig, CompanyInfo } from './site-config.types';

@Injectable({
    providedIn: 'root'
})
export class SiteConfigService
{
    private _smtpConfig: ReplaySubject<SmtpConfig> = new ReplaySubject<SmtpConfig>(1);
    private _smsConfig: ReplaySubject<SmsConfig> = new ReplaySubject<SmsConfig>(1);
    private _companyInfo: ReplaySubject<CompanyInfo> = new ReplaySubject<CompanyInfo>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
 
    /**
     * Getter for SmtpConfig, SmsConfig
     *
     * @param value
     */
 
     get smtpConfig$(): Observable<SmtpConfig>
     {
         return this._smtpConfig.asObservable();
     }

     get smsConfig$(): Observable<SmsConfig>
     {
         return this._smsConfig.asObservable();
     }

     get companyInfo$(): Observable<CompanyInfo>
     {
        return this._companyInfo.asObservable();
     }
 
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the SmtpConfig
     *
     * @param SmtpConfig
     */

     AddSmtpConfig(config: SmtpConfig): Observable<any>
     {
         let formData = new FormData();
         for(var key in config) {
             if(config[key] !== '') {
             formData.append(key, config[key]);
             }
         }
         
         return this._httpClient.post<SmtpConfig>(`${environment.ApiRoot}/account/addSmtpConfig`,
          formData).pipe(
             take(1),
             switchMap((config) => {
                 if(config) {
                     this._smtpConfig.next(config);
                 }
                 return of(config);
             }),
             catchError(() => {
                 return of(null);
             })
         );
     }

    /**
     * Get the current SmtpConfig
     */
    getSmtpConfig(): Observable<SmtpConfig>
    {
        return this._httpClient.get<SmtpConfig>(`${environment.ApiRoot}/admin/getSmtpConfig`).pipe(
            tap((config: any) => {
                if(config) {
                    this._smtpConfig.next(config);
                }
            })
        );
    }

    /**
     * Update the SmtpConfig
     *
     * @param SmtpConfig
     */
    updateSmtpConfig(config: SmtpConfig): Observable<any>
    {
        let formData = new FormData();
        for(var key in config) {
            if(config[key] !== '') {
            formData.append(key, config[key]);
            }
        }
        
        return this._httpClient.post<SmtpConfig>(`${environment.ApiRoot}/admin/updateSmtpConfig`,
         formData).pipe(
            take(1),
            switchMap((config) => {
                if(config) {
                    this._smtpConfig.next(config);
                }
                return of(config);
            }),
            catchError(() => {
                return of(null);
            })
        );
    }


    /**
     * Get the current SmtpConfig
     */
    getSmsConfig(): Observable<SmsConfig>
    {
        return this._httpClient.get<SmsConfig>(`${environment.ApiRoot}/admin/getSmsConfig`).pipe(
            tap((config: any) => {
                if(config) {
                    this._smsConfig.next(config);
                }
            })
        );
    }

    /**
     * Update the SmsConfig
     *
     * @param SmtpConfig
     */
    updateSmsConfig(config: SmsConfig): Observable<any>
    {
        let formData = new FormData();
        for(var key in config) {
            if(config[key] !== '') {
            formData.append(key, config[key]);
            }
        }
        
        return this._httpClient.post<SmsConfig>(`${environment.ApiRoot}/admin/updateSmsConfig`,
         formData).pipe(
            take(1),
            switchMap((config) => {
                if(config) {
                    this._smsConfig.next(config);
                }
                return of(config);
            }),
            catchError(() => {
                return of(null);
            })
        );
    }

    /**
     * Get the current getCompanyInfo
     */
     getCompanyInfo(): Observable<CompanyInfo>
     {
         return this._httpClient.get<CompanyInfo>(`${environment.ApiRoot}/admin/getCompanyInfo`).pipe(
             tap((info: any) => {
                 if(info) {
                     this._companyInfo.next(info);
                 }
             })
         );
     }

     /**
     * Update the company info
     *
     * @param CompanyInfo
     */
    updateCompanyInfo(info: CompanyInfo): Observable<any>
    {
        let formData = new FormData();
        for(var key in info) {
            if(info[key] !== '' && key !== 'logoImage') {
            formData.append(key, info[key]);
            }
        }

        //Add the image file
        if(info.logoImage) {
            formData.append('logoImage', info.logoImage.file, info.logoImage.name);
        }

        const headers = new HttpHeaders().append("Content-Decomposition", "multipart/form-data");

        return this._httpClient.post<CompanyInfo>(`${environment.ApiRoot}/admin/updateCompanyInfo`,
         formData, { headers: headers }).pipe(
            take(1),
            switchMap((info) => {
                if(info) {
                    this._companyInfo.next(info);
                }
                return of(info);
            }),
            catchError(() => {
                return of(null);
            })
        );
    }
}
