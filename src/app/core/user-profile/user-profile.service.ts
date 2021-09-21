import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { UserProfile } from './user-profile.types';
import { environment } from 'environments/environment';
import { profile } from 'app/mock-api/apps/chat/data';

@Injectable({
    providedIn: 'root'
})
export class UserProfileService
{
    private _userProfile: ReplaySubject<UserProfile> = new ReplaySubject<UserProfile>(1);

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
     * Setter & getter for userProfile
     *
     * @param value
     */
     set userProfile(value: UserProfile)
     {
         // Store the value
         this._userProfile.next(value);
     }
 
     get userProfile$(): Observable<UserProfile>
     {
         return this._userProfile.asObservable();
     }
 
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user profile data
     */
    get(): Observable<UserProfile>
    {
        return this._httpClient.get<UserProfile>(`${environment.ApiRoot}/account/getProfileInfo`).pipe(
            tap((profile: any) => {
                this._userProfile.next(profile.info);
            })
        );
    }

    /**
     * Update the user profile
     *
     * @param userprofile
     */
    update(userProfile: UserProfile): Observable<any>
    {
        let formData = new FormData();
        for(var key in userProfile) {
            //No need to upload base64 image format back, sending the file already.
            if(userProfile[key] !== '' && key !== 'avatar' 
                && key !== 'avatarBase64' && key !== 'country') {
            formData.append(key, userProfile[key]);
            }
        }
        formData.append('countryCode', userProfile.country?.iso);

        //If there is no image in preview, it means avatar is removed by the user,
        // any existing avatar should be deleted from server.
        formData.append('removeAvatar', JSON.stringify(userProfile.avatarBase64 === null));

        //Add the image file
        if(userProfile.avatar) {
            formData.append('avatar', userProfile.avatar.file, userProfile.avatar.name);
        }
        const headers = new HttpHeaders().append("Content-Decomposition", "multipart/form-data");
        
        return this._httpClient.post<UserProfile>(`${environment.ApiRoot}/account/updateProfileInfo`,
         formData, { headers: headers }).pipe(
            take(1),
            switchMap((profile) => {
                if(profile) {
                    this._userProfile.next(profile);
                }
                return of(profile);
            }),
            catchError(() => {
                return of(null);
            })
        );
    }
}
