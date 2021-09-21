import { SystemUserService } from './../../../../../core/admin/system-user.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { Role, SystemUser } from './../../../../../core/admin/system-user.types';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgForm, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Country, countries } from '../settings.types';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseValidators } from '@fuse/validators';
import { CountryAndPhonePrefixErrorStateMatcher } from './team-error-state-matcher';
import { take, takeUntil } from 'rxjs/operators';
import { FuseAlertType } from '@fuse/components/alert';
import { fuseAnimations } from '@fuse/animations';
import { Subject } from 'rxjs';

@Component({
    selector: 'settings-team',
    templateUrl: './team.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsTeamComponent implements OnInit {
    @ViewChild('addUserNgForm') addUserNgForm: NgForm;
    @ViewChild('editUserNgForm') editUserNgForm: NgForm;
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('avatarFileInput2') private _avatarFileInput2: ElementRef;
    members: SystemUser[];
    roles: any[];
    createMode: boolean = false;
    editMode: boolean = false;
    addUserForm: FormGroup;
    editUserForm: FormGroup;
    countryList: Country[] = countries;
    avatarEditMode: boolean = false;
    avatarDataURL: string = null;
    invalidAvatarErr: string = null;
    roleEditInProgress: boolean = false;
    selectedRoles: number[] = [];
    alert: { type: FuseAlertType; message: string } = {
        type: 'error',
        message: 'Something went wrong! Please try again later.'
    };
    showAlert: boolean = false;
    loading: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    private _countryAndPhonePrefixCheck: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        const countryPhoneCode = control.get('country').value?.code;
        const phonePrefix = control.get('phoneNumber').get('countryCode').value;
        return (countryPhoneCode === phonePrefix) ? null : { phonePrefixAndCountryMismatch: true}
    }

    countryAndPhonePrefixErrorStateMatcher: CountryAndPhonePrefixErrorStateMatcher = new 
        CountryAndPhonePrefixErrorStateMatcher();
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _activatedRoute: ActivatedRoute,
        private _systemUserService: SystemUserService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loading = true;
        this._systemUserService.getUsers().pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((systemUsers: SystemUser[]) => {
            this.members = systemUsers;
            this.loading = false;

            //Initialize selection model with default role
            this.selectedRoles = [this.members.length];
            this.members.forEach((member, index) => {
            this.selectedRoles[member.userId] = member.role 

            this._changeDetectorRef.markForCheck();
            });
        });

        // Setup the roles
        this.roles = [
            {
                label: 'System Admin',
                value: Role.SystemAdmin,
                description: 'Have access to all available settings in the system.'
            },
            {
                label: 'System User',
                value: Role.SystemUser,
                description: 'Can approve registration requests, reply to support tickets etc.'
            }
        ];
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * 
     *   Get role label from value
     */
    getRoleLabel(value: number): string {
        return this.roles.find(r => r.value === value)?.label;
    }


    /**
     * Read the given file for showing preview
     *
     * @param file
     */
    private _readAsDataURL(file: File): Promise<any> {
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
     * Upload avatar
     *
     * @param fileList
     */
    processAvatar(fileList: FileList): void {
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


        if(this.createMode) {
            //Set the file to form
            this.addUserForm.get('avatar').setValue({
                name: file.name,
                file: file
            });
        }
        else if(this.editMode) {
            //Set the file to form
            this.editUserForm.get('avatar').setValue({
                name: file.name,
                file: file
            });
        }
       

        // Preview avatar
        this._readAsDataURL(file).then((data) => {
            if(this.createMode) {
                this.addUserForm.get('avatarBase64').setValue(data);
            } 
            else if(this.editMode) {
                this.editUserForm.get('avatarBase64').setValue(data);
            }
           
            this._changeDetectorRef.markForCheck();
        });

        // Upload the avatar service call

    }

    /**
     * Remove the avatar
     */
    removeAvatar(): void {
        if(this.createMode) {
            // Get the form control for 'avatar'
            this.addUserForm.get('avatar').setValue(null);

            // Set the file input value as null
            this._avatarFileInput.nativeElement.value = null;
            // Update the base64
            this.addUserForm.get('avatarBase64').setValue(null);
        }
        else if(this.editMode) {
            // Get the form control for 'avatar'
            this.editUserForm.get('avatar').setValue(null);

            // Set the file input value as null
            this._avatarFileInput2.nativeElement.value = null;
            // Update the base64
            this.editUserForm.get('avatarBase64').setValue(null);
        }
        
    }

    /**
      * Cancel avatar change
      */
    cancelAvatarChange(): void {
        if(this.createMode) {
            this.addUserForm.get('avatar').setValue(null);
            this.addUserForm.get('avatarBase64').setValue(null);
        }
        else if(this.editMode) {
            this.editUserForm.get('avatar').setValue(null);
            const userId = this.editUserForm.get('userId').value;
            const avatarBase64 = this.members.find(m => m.userId === userId)?.avatarBase64;
            this.editUserForm.get('avatarBase64').setValue(avatarBase64);
        }
         
         this.invalidAvatarErr = null;
         this.avatarEditMode = false;
    }


    /**
     * Get country info by code
     *
     * @param code
     */
    getCountryByPhoneCode(code: string): Country {
        //Default is USA for +1
        if (code === '+1') {
            return this.countryList[224];
        }
        return this.countryList.find(country => country.code === code);
    }

    /**
     * Get country info by code
     *
     * @param code
     */
     getPhonePrefixByCountryCode(iso: string): string {
        return this.countryList.find(country => country.iso === iso)?.code;
    }

    /**
     * Compares two country object
     * @param a: first country
     * @param b: second country
     * @returns boolean indicating if they are equal
     */
    compareCountries(a: Country, b: Country): boolean {
        return a && b && a.id === b.id;
    }

    /**
     *  Save a new user
     */
    saveUser(): void {
        if (this.addUserForm.invalid) {
            this.addUserForm.markAllAsTouched();
            return;
        }

        //Disable the form
        this.addUserForm.disable;

        // Hide the alert
        this.showAlert = false;

        this._systemUserService.addSystemUser(this.addUserForm.value).pipe(
            take(1)
        ).subscribe((savedUser) => {
            if(savedUser) {
                this.createMode = false;
                this.addUserNgForm.resetForm();
                this.selectedRoles[savedUser.userId] = savedUser.role;
            }
            else {
                this.addUserForm.enable;
                this.alert.message = "Something went wrong! Please try again later.";
                this.showAlert = true;
            }
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * 
     *  Toggle create mode
     */
    toggleCreateMode(): void {
        this.createMode = !this.createMode;

        //Hide any alerts
        this.showAlert = false;

        if(this.createMode) {
            // Create the form
            this.addUserForm = this._formBuilder.group({
                avatar: [null],
                firstName: ['', [Validators.required, Validators.maxLength(25)]],
                lastName: ['', [Validators.required, Validators.maxLength(25)]],
                jobTitle: ['', [Validators.required, Validators.maxLength(50)]],
                role: [1, [Validators.required]],
                email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
                password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(64),
                    Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).*$")]],
                passwordConfirm: ['', [Validators.required]],
                addressLine1: ['', [Validators.required, Validators.maxLength(100)]],
                addressLine2: ['', [Validators.required, Validators.maxLength(100)]],
                phoneNumber: this._formBuilder.group({
                    countryCode: ['+1', [Validators.required, Validators.maxLength(3)]],
                    number: ['', [Validators.required, Validators.maxLength(15), 
                        Validators.minLength(4), Validators.pattern('^[0-9]*$')]]
                }),
                country: [this.countryList[224], [Validators.required]],
                city: ['', [Validators.required, Validators.maxLength(50)]],
                state: ['', [Validators.required, Validators.maxLength(50)]],
                zip: ['', [Validators.required, Validators.maxLength(50)]],
                avatarBase64: [null]
            },
            {
                validators: [this._countryAndPhonePrefixCheck, FuseValidators.mustMatch('password', 'passwordConfirm')]
            });
        }
    }

    /**
     * Enable edit mode for editing user details
     */
    enableEditMode(user: SystemUser): void {
        this.editMode = true;

        //Hide any alerts
        this.showAlert = false;
        
        // Create the form
        this.editUserForm = this._formBuilder.group({
            userId: [user.userId, [Validators.required]],
            avatar: [null],
            firstName: [user.firstName, [Validators.required, Validators.maxLength(25)]],
            lastName: [user.lastName, [Validators.required, Validators.maxLength(25)]],
            jobTitle: [user.jobTitle, [Validators.required, Validators.maxLength(50)]],
            role: [user.role, [Validators.required]],
            email: [user.email, [Validators.required, Validators.email, Validators.maxLength(255)]],
            password: ['', [Validators.minLength(6), Validators.maxLength(64),
                Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).*$")]],
            passwordConfirm: ['', []],
            addressLine1: [user.addressLine1, [Validators.required, Validators.maxLength(100)]],
            addressLine2: [user.addressLine2, [Validators.required, Validators.maxLength(100)]],
            phoneNumber: this._formBuilder.group({
                countryCode: [this.getPhonePrefixByCountryCode(user.countryCode), [Validators.required, Validators.maxLength(3)]],
                number: [user.phone, [Validators.required, Validators.maxLength(15), 
                    Validators.minLength(4), Validators.pattern('^[0-9]*$')]]
            }),
            country: [this.countryList.find(c => c.iso === user.countryCode), [Validators.required]],
            city: [user.city, [Validators.required, Validators.maxLength(50)]],
            state: [user.state, [Validators.required, Validators.maxLength(50)]],
            zip: [user.zip, [Validators.required, Validators.maxLength(50)]],
            avatarBase64: [user.avatarBase64]
        },
        {
            validators: [this._countryAndPhonePrefixCheck, FuseValidators.mustMatch('password', 'passwordConfirm')]
        });

        this._changeDetectorRef.markForCheck();
    }

    /**
     * Update a user
     */
    updateUser(): void {
        if (this.editUserForm.invalid) {
            this.editUserForm.markAllAsTouched();
            return;
        }

        //Disable the form
        this.editUserForm.disable;

        // Hide the alert
        this.showAlert = false;

        this._systemUserService.updateSystemUser(this.editUserForm.value).pipe(
                take(1)
            ).subscribe((updatedUser) => {
                if(updatedUser) {
                    this.editMode = false;
                    this.editUserNgForm.resetForm();
                    this.selectedRoles[updatedUser.userId] = updatedUser.role;
                }
                else {
                    this.editUserForm.disable;
                    this.alert.message = "Something went wrong! Please try again later."
                    this.showAlert = true;
                }
                this._changeDetectorRef.markForCheck();
            });

    }

    /**
     * Remove a user
     */
    deleteUser(id: number): void {
        this.showAlert = false;
        this._fuseConfirmationService.open({
            title: "Confirm delete action",
            message: "Are you sure you want to remove that user from the system?",
            icon: {
                name: "heroicons_outline:exclamation-circle",
                color: "warn",
                show: true
            },
            actions: {
                confirm: {
                    label: "OK",
                    color: "warn",
                    show: true
                },
                cancel: {
                    label: "Cancel",
                    show: true
                }
            },
            dismissible: false
        }).afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._systemUserService.removeSystemUser(id).pipe(
                    take(1)
                ).subscribe((isDeleted) => {
                    if(!isDeleted) {
                        this.alert.message = "Something went wrong! Please try again later";
                        this.showAlert = true;
                    }
                    this._changeDetectorRef.markForCheck();
                });
                
            }
        });
    }

    /**
     * Cancel update and reset form
     */
    cancelUpdate(): void {
        this.showAlert = false;
        this.editUserNgForm.resetForm();
    }

    /**
     * 
     *Cancel save and reset form
     */
    cancelSave(): void {
        this.showAlert = false;
        this.addUserNgForm.resetForm();
    }

    /**
     * Discards the edit mode
     */
    discardEdit(): void {
        this.editMode = false;
        this.showAlert = false;
    }

    /**
     *  Update the role for a user
     */
    updateRole(member: any, newRole: number): void {
        this.showAlert = false;
        this.roleEditInProgress = true;
        this._fuseConfirmationService.open({
            title: "Confirm role change",
            message: "Are you sure you want to update role for the selected user?",
            icon: {
                name: "heroicons_outline:exclamation-circle",
                color: "primary",
                show: true
            },
            actions: {
                confirm: {
                    label: "OK",
                    color: "primary",
                    show: true
                },
                cancel: {
                    label: "Cancel",
                    show: true
                }
            },
            dismissible: false
        }).afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._systemUserService.updateSystemUserRole(member, newRole).pipe(
                    take(1)
                ).subscribe((updatedUser) => {
                    if(updatedUser) {
                        member.role = updatedUser.role;
                        this.selectedRoles[member.userId] = updatedUser.role;
                    }
                    else {
                        this.selectedRoles[member.userId] = member.role;
                        this.alert.message = "Role change failed! Please" 
                        + "try again later";
                        this.showAlert = true;
                    }
                    this.roleEditInProgress = false;
                    this._changeDetectorRef.markForCheck();
                });
                
            }
            else {
                this.selectedRoles[member.userId] = member.role;
                this.roleEditInProgress = false;
                this._changeDetectorRef.markForCheck();
            }
            
        });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
