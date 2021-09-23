import { AuthStatus } from './../../../../../core/auth/auth-types';
import { fuseAnimations } from './../../../../../../@fuse/animations/public-api';
import { FuseAlertType } from '@fuse/components/alert';
import { take, takeUntil } from 'rxjs/operators';
import { UserProfileService } from 'app/core/user-profile/user-profile.service';
import { UserProfile } from '../../../../../core/user-profile/user-profile.types';
import { Country, countries } from '../settings.types';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { UserType } from 'app/core/auth/auth-types';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'settings-account',
    templateUrl: './profile.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class SettingsProfileComponent implements OnInit {
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('profileNgForm') profileNgForm: NgForm;
    
    profileForm: FormGroup;
    userProfile: UserProfile = 
    {
        userId: 1,
        firstName: '',
        lastName: '',
        avatar:'',
        avatarBase64: '',
        company: '',
        jobTitle: '',
        countryCode: 'us',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zip: '',
        website: '',
        businessOptionId: 1
    }; 
    editMode: boolean = false;
    avatarEditMode: boolean = false;
    invalidAvatarErr: string = null;
    countryList: Country[] = countries;
    businessTypeOptions: any[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    alert: { type: FuseAlertType; message: string } = {
        type: 'error',
        message: 'Save failed! Please try again later.'
    };
    showAlert: boolean = false;
    authStatus: AuthStatus;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _activatedRoute: ActivatedRoute,
        private _userProfileService: UserProfileService,
        private _authService: AuthService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        //Get the profile info from route data
        const profile = this._activatedRoute.snapshot.data['accountSettings'].profile;
        this.userProfile = profile.info;
        this.businessTypeOptions = profile.businessTypeOptions;
        this.populateForm(profile.info);

        //Subscribe to the observable in the service
        this._userProfileService.userProfile$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((profile: UserProfile) => {
            this.userProfile = profile;
            this._activatedRoute.snapshot.data['accountSettings'].profile.info = profile;
            this._changeDetectorRef.markForCheck();
        });  

        //Auth status
        this._authService.authStatus.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((authStatus: AuthStatus) => {
            this.authStatus = authStatus
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


    /**
     * 
     * Populate the form with data from router snapsort
     */
    private populateForm(profile: UserProfile) {
        // Create the form
        this.profileForm = this._formBuilder.group({
            avatar: [null],
            avatarBase64: [profile.avatarBase64],
            firstName: [profile.firstName, [Validators.required, Validators.maxLength(25),
                 Validators.pattern("^(?<firstchar>(?=[A-Za-z]))((?<alphachars>[A-Za-z])|(?<specialchars>[A-Za-z]['-](?=[A-Za-z]))|(?<spaces> (?=[A-Za-z])))*$")]],
            lastName: [profile.lastName, [Validators.required, Validators.maxLength(25), 
                Validators.pattern("^(?<firstchar>(?=[A-Za-z]))((?<alphachars>[A-Za-z])|(?<specialchars>[A-Za-z]['-](?=[A-Za-z]))|(?<spaces> (?=[A-Za-z])))*$")]],
            jobTitle: [profile.jobTitle, [Validators.required, Validators.maxLength(50)]],
            company: [profile.company, [Validators.required, Validators.maxLength(50)]],
            addressLine1: [profile.addressLine1, [Validators.required, Validators.maxLength(100)]],
            addressLine2: [profile.addressLine2, [Validators.required, Validators.maxLength(100)]],
            country: [this.getCountry(profile.countryCode), [Validators.required]],
            city: [profile.city, [Validators.required, Validators.maxLength(50)]],
            state: [profile.state, [Validators.required, Validators.maxLength(50)]],
            zip: [profile.zip, [Validators.required, Validators.maxLength(20)]],
            website: [profile.website, [Validators.maxLength(50)]],
            businessOptionId: [profile.businessOptionId, []]
        });

        if(profile.userType === UserType.SystemAdmin || profile.userType === UserType.SystemUser) {
            this.profileForm.get('website').setValue('');
            this.profileForm.get('businessOptionId').setValue(0);
        }

    }

    /**
     * Compares two country object
     * @param a: first country
     * @param b: second country
     * @returns boolean indicating if they are equal
     */
    compareCountries(a: Country, b: Country): boolean {
        return  a && b && a.id === b.id;
    }


    /**
     * Read the given file for showing preview
     *
     * @param file
     */
     private _readAsDataURL(file: File): Promise<any>
     {
         // Return a new promise
         return new Promise((resolve, reject) => {
 
             // Create a new reader
             const reader = new FileReader();
 
             // Resolve the promise on success
             reader.onload = (): void => {
                 resolve(reader.result);
             };
 
             // Reject the promise on error
             reader.onerror = (e): void => {
                 reject(e);
             };
 
             // Read the file as the
             reader.readAsDataURL(file);
         });
     }

    /**
     * Process avatar for upload
     *
     * @param fileList
     */
     processAvatar(fileList: FileList): void
     {
         // Return if canceled
         if ( !fileList.length )
         {
             return;
         }
 
         const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/tiff'];
         const file = fileList[0];
 
         // Return if the file is not allowed
         if ( !allowedTypes.includes(file.type) )
         {
             this.invalidAvatarErr = "Only jpg, png, gif and tiff image formats are allowed";
             return;
         }
         else if(file.size/ (1024 * 1024) > 3.0) {
            this.invalidAvatarErr = "The image is too big, maximum allowed size is 3 MB";
            return;
         }

         this.invalidAvatarErr = null;

         //Set the file to form
         this.profileForm.get('avatar').setValue({
             name: file.name,
             file: file
         });

         // Preview avatar
         this._readAsDataURL(file).then((data) => {

            this.profileForm.get('avatarBase64').setValue(data);
            this._changeDetectorRef.markForCheck();
        });
 
         // Upload the avatar service call
         
     }
 
     /**
      * Remove the avatar
      */
     removeAvatar(): void
     {
         // Get the form control for 'avatar'
         const avatarFormControl = this.profileForm.get('avatar');
 
         // Set the avatar as null
         avatarFormControl.setValue(null);
 
         // Set the file input value as null
         this._avatarFileInput.nativeElement.value = null;
 
         // Update the base64
         this.profileForm.get('avatarBase64').setValue(null);
     }

     /**
      * Cancel avatar change
      */
     cancelAvatarChange(): void 
     {
         this.profileForm.get('avatar').setValue(null);
         this.profileForm.get('avatarBase64').setValue(this.userProfile.avatarBase64);
         this.invalidAvatarErr = null;
         this.avatarEditMode = false;
     }

     /**
      * Cancels edit mode and reset form data.
      */
     cancelEditMode(): void {
        this.profileNgForm.resetForm();
        this.populateForm(this.userProfile);
        this.editMode = false;
        this.showAlert = false;
        this._changeDetectorRef.markForCheck();
     }

     /**
      * Get country name from iso code
      */
     getCountryName(iso: string): string {
         iso = !iso ? this.userProfile.countryCode: iso;
         const name = this.countryList.find(c => c.iso === iso)?.name;
         return name ? name: 'US';
     }

     /**
      * Get country object from iso code
      */
      getCountry(iso: string): Country {
        iso = !iso ? this.userProfile.countryCode: iso;
        return this.countryList.find(c => c.iso === iso);
    }

     /**
      * Get BusinessTypeOption's name from id
      */
      getBusinessTypeOptionName(id: number = -1): string {
        id = id === -1 ? (this.userProfile.businessOptionId ? this.userProfile.businessOptionId: 3) : id;
        return this.businessTypeOptions.find(op => op.id === id)?.name;
    }

    /**
     * Save profile data
     */
    save(): void {

        //Return if form is invalid
        if(this.profileForm.invalid) {
            this.profileForm.markAllAsTouched();
            return;
        }

         // Disable the form
         this.profileForm.disable();

         // Hide the alert
         this.showAlert = false;

         //Save info
         this._userProfileService.update(this.profileForm.value).pipe(
             take(1)
         ).subscribe((updatedProfile) => {
            if(updatedProfile) {
                this.editMode = false;
            }
            else {
                this.showAlert = true;
            }
            this.profileForm.enable();
            this.avatarEditMode = false;
         });

    }

    /**
     * Enable profile info edit mode
     */
    enableEditMode(): void {
        this.editMode = true;
    }
}
