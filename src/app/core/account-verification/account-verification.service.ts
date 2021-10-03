import { catchError, switchMap } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable, of, ReplaySubject } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class AccountVerificationService {
    private _verificationStatus$: ReplaySubject<any> = new ReplaySubject<any>(1);
    constructor(private _httpClient: HttpClient) {

    }

    /**
     * Get verification status
     */
    getVerificationStatus(): Observable<any> {
        return this._httpClient.get(`${environment.ApiRoot}/accountVerification/getRequestStatus`).pipe(
            switchMap((status) => {
                this._verificationStatus$.next(status);
                return of(status);
            }),
            catchError(() => {
                return of(null);
            })
        );
    }

    //Getter
    get verificationStatus$(){
        return this._verificationStatus$.asObservable();
    }

    /**
     * 
     * Send account verification requests
     */
    sendVerificationRequest(model: any): Observable<any> {
        let fd = new FormData();

        fd.append('identityDocType', model.identityDocType);
        fd.append('idNumber', model.identityNumber);
        fd.append('idImage', model.identityDoc, model.identityDocFileName);
        fd.append('businessName', model.businessName);
        fd.append('addressLine1', model.businessAddress1);
        fd.append('addressLine2', model.businessAddress2);
        fd.append('country', model.country?.iso);
        fd.append('city', model.city);
        fd.append('state', model.state);
        fd.append('zip', model.zip);
        fd.append('phoneNumber', model.country.code + model.phoneNumber);
        fd.append('website', model.website);

        for(let i = 0; i < model.legalDocs.length; i++) {
            const doc = model.legalDocs[i];
            fd.append(`companyDocumentFiles[${i}].file`, doc.fileSource);
            fd.append(`companyDocumentFiles[${i}].name`, doc.fileName);
        }

        const headers = new HttpHeaders().append("Content-Decomposition", "multipart/form-data");

        return this._httpClient.post<any>(`${environment.ApiRoot}/accountVerification/sendRequest`, fd, {
            headers: headers
        }).pipe(
            catchError(() => {
                return of(null);
            })
        );
    }
}