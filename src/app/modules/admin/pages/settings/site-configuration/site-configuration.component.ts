import { SiteConfigService } from './../../../../../core/site-config/site-config.service';
import { Country } from './../../../../auth/account-setup/account-setup.types';
import { countries } from './../settings.types';
import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, ViewChildren, ElementRef, QueryList, Renderer2 } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { SmtpConfig, SmsConfig, CompanyInfo } from 'app/core/site-config/site-config.types';

@Component({
  selector: 'site-configuration',
  templateUrl: './site-configuration.component.html'
})
export class SettingsSiteConfigurationComponent implements OnInit, AfterViewInit {
  @ViewChild('smtpConfigNgForm') smtpConfigNgForm = NgForm;
  @ViewChild('smsConfigNgForm') smsConfigNgForm = NgForm;
  @ViewChild('companyInfoNgForm') companyInfoNgForm = NgForm;

  @ViewChildren('smtpSaveSuccessAlert', { read: ElementRef }) private _smtpSaveSuccessAlert: QueryList<ElementRef>;
  @ViewChildren('smtpSaveFailedAlert', { read: ElementRef }) private _smtpSaveFailedAlert: QueryList<ElementRef>;

  @ViewChildren('smsSaveSuccessAlert', { read: ElementRef }) private _smsSaveSuccessAlert: QueryList<ElementRef>;
  @ViewChildren('smsSaveFailedAlert', { read: ElementRef }) private _smsSaveFailedAlert: QueryList<ElementRef>;

  @ViewChildren('companyInfoSaveSuccessAlert', { read: ElementRef }) private _companyInfoSaveSuccessAlert: QueryList<ElementRef>;
  @ViewChildren('companyInfoSaveFailedAlert', { read: ElementRef }) private _companyInfoSaveFailedAlert: QueryList<ElementRef>;

  smtpConfigForm: FormGroup;
  smtpConfig: SmtpConfig;
  smtpPasswordEyeOn: boolean = true;
  smtpConfigEditStatus: string = 'none';

  smsConfigForm: FormGroup;
  smsConfig: SmsConfig;
  smsConfigApiKeyEyeOn: boolean = true;
  smsConfigSigningKeyEyeOn: boolean = true;
  smsConfigEditStatus: string = 'none';

  companyInfoForm: FormGroup;
  companyInfo: CompanyInfo;
  companyInfoEditStatus: string = 'none';
  logoEditMode: boolean = false;
  logoDataURL: string = null;
  invalidLogoErr: string = null;
  countryList: Country[] = countries;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _formBuilder: FormBuilder,
    private _renderer: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef,
    private _siteConfigService: SiteConfigService
  ) { }


  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {

    /**
     * Initialize smtp config
     */
    this._siteConfigService.getSmtpConfig().pipe(take(1)).subscribe();
    this._siteConfigService.smtpConfig$.pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe((config) => {
      this.smtpConfig = config;

      //Initialize the smtp form
      this.initSmtpForm(this.smtpConfig);
      this.smtpConfigEditStatus = 'none';
    });
  

    /**
     * Initialize the SMS config
     */
    this._siteConfigService.getSmsConfig().pipe(take(1)).subscribe();
    this._siteConfigService.smsConfig$.pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe((config) => {
      this.smsConfig = config;

      //Initialize the sms config form
      this.initSmsForm(this.smsConfig);
      this.smsConfigEditStatus = 'none';
    });

   


    /**
     * Initialize company info
     */

    this._siteConfigService.getCompanyInfo().pipe(take(1)).subscribe();
    this._siteConfigService.companyInfo$.pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe((info) => {
      this.companyInfo = info;

      //Initialize the company info form
      this.initCompanyInfoForm(this.companyInfo);
      this.companyInfoEditStatus = 'none';
      this.logoDataURL = this.companyInfo.logoImageBase64;
    });
  }

  /**
   * After view init
   */
  ngAfterViewInit(): void {

    /*
     * Set save success alert dismiss button's 'type' attribute to button to prevent form submit, in smtpConfigForm
     */
    this._smtpSaveSuccessAlert.changes.pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe((elRefList: QueryList<ElementRef>) => {
      if (elRefList && elRefList.length >= 1) {
        let nativeEl = elRefList.last.nativeElement;
        let dismissBtn = nativeEl.querySelector('button');
        this._renderer.setAttribute(dismissBtn, 'type', 'button');

      }
    });

    /*
     * Set save fail alert dismiss button's 'type' attribute to button to prevent form submit, in smtpConfigForm
     */
    this._smtpSaveFailedAlert.changes.pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe((elRefList: QueryList<ElementRef>) => {
      if (elRefList && elRefList.length >= 1) {
        let nativeEl = elRefList.last.nativeElement;
        let dismissBtn = nativeEl.querySelector('button');
        this._renderer.setAttribute(dismissBtn, 'type', 'button');

      }
    });


    /*
    * Set save success alert dismiss button's 'type' attribute to button to prevent form submit, in smtpConfigForm
    */
    this._smsSaveSuccessAlert.changes.pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe((elRefList: QueryList<ElementRef>) => {
      if (elRefList && elRefList.length >= 1) {
        let nativeEl = elRefList.last.nativeElement;
        let dismissBtn = nativeEl.querySelector('button');
        this._renderer.setAttribute(dismissBtn, 'type', 'button');

      }
    });

    /*
     * Set save fail alert dismiss button's 'type' attribute to button to prevent form submit, in smtpConfigForm
     */
    this._smsSaveFailedAlert.changes.pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe((elRefList: QueryList<ElementRef>) => {
      if (elRefList && elRefList.length >= 1) {
        let nativeEl = elRefList.last.nativeElement;
        let dismissBtn = nativeEl.querySelector('button');
        this._renderer.setAttribute(dismissBtn, 'type', 'button');

      }
    });


    /*
    * Set save success alert dismiss button's 'type' attribute to button to prevent form submit, in companyInfoForm
    */
    this._companyInfoSaveSuccessAlert.changes.pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe((elRefList: QueryList<ElementRef>) => {
      if (elRefList && elRefList.length >= 1) {
        let nativeEl = elRefList.last.nativeElement;
        let dismissBtn = nativeEl.querySelector('button');
        this._renderer.setAttribute(dismissBtn, 'type', 'button');

      }
    });

     /*
     * Set save fail alert dismiss button's 'type' attribute to button to prevent form submit, in companyInfoForm
     */
     this._companyInfoSaveFailedAlert.changes.pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe((elRefList: QueryList<ElementRef>) => {
      if (elRefList && elRefList.length >= 1) {
        let nativeEl = elRefList.last.nativeElement;
        let dismissBtn = nativeEl.querySelector('button');
        this._renderer.setAttribute(dismissBtn, 'type', 'button');

      }
    });

  }

  /**
  * On destroy
  */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks end
  // -----------------------------------------------------------------------------------------------------

  /**
     * Initialize smtp config form
  */
  private initSmtpForm(config: SmtpConfig): void {
    this.smtpConfigForm = this._formBuilder.group({
      id: [config.id, [Validators.required]],
      server: [config.server, [Validators.required, Validators.maxLength(200)]],
      username: [config.username, [Validators.maxLength(200)]],
      password: [config.password, [Validators.maxLength(200)]],
      fromName: [config.fromName, [Validators.required, Validators.maxLength(100)]],
      fromAddress: [config.fromAddress, [Validators.required, Validators.maxLength(320)]],
      port: [config.port.toString(), [Validators.required]],
      useAuthentication: [config.useAuthentication],
      useSecureConnection: [config.useSecureConnection]
    });
  }

  /**
   * Cancel smtp config save operation
   */
  cancelSmtpConfigSave(): void {
    this.initSmtpForm(this.smtpConfig);
    this.smtpConfigEditStatus = 'none';
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Save smtp config
   */
  saveSmtpConfig(): void {
    if (this.smtpConfigForm.valid) {
      this._siteConfigService.updateSmtpConfig(this.smtpConfigForm.value).pipe(
        take(1)
      ).subscribe((config) => {
        if(config) {
          this.smtpConfigEditStatus = 'success';
        }
        else {
          this.smtpConfigEditStatus = 'failed';
          this.initSmtpForm(this.smtpConfig);
        }
        this._changeDetectorRef.markForCheck();
      });
    }
    else {
      this.smtpConfigForm.markAllAsTouched();
    }
  }

  /**
    * Initialize sms config form
 */
  private initSmsForm(config: SmsConfig): void {
    this.smsConfigForm = this._formBuilder.group({
      id: [config.id.toString(), [Validators.required]],
      originator: [config.originator, [Validators.required, Validators.maxLength(200)]],
      apiAccessKey: [config.apiAccessKey, [Validators.required, Validators.maxLength(500)]],
      apiSigningKey: [config.apiSigningKey, [Validators.required, Validators.maxLength(500)]]
    });
  }

  /**
   * Cancel sms config save operation
   */
  cancelSmsConfigSave(): void {
    this.initSmsForm(this.smsConfig);
    this.smsConfigEditStatus = 'none';
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Save smtp config
   */
  saveSmsConfig(): void {
    if (this.smsConfigForm.valid) {
      this._siteConfigService.updateSmsConfig(this.smsConfigForm.value).pipe(
        take(1)
      ).subscribe((config) => {
        if(config) {
          this.smsConfigEditStatus = 'success';
        }
        else {
          this.smsConfigEditStatus = 'failed';
          this.initSmsForm(this.smsConfig);
        }
        this._changeDetectorRef.markForCheck();
      });
    }
    else {
      this.smtpConfigForm.markAllAsTouched();
    }
  }

  /**
   * Init company info form
   */
  initCompanyInfoForm(company: CompanyInfo): void {
    // Create the form
    this.companyInfoForm = this._formBuilder.group({
      id: [company.id, [Validators.required]],
      logoImageBase64: [company.logoImageBase64],
      logoImage: [null],
      name: [company.name, [Validators.required, Validators.maxLength(100)]],
      addressLine1: [company.addressLine1, [Validators.required, Validators.maxLength(50)]],
      addressLine2: [company.addressLine2, [Validators.required, Validators.maxLength(50)]],
      email: [company.email, [Validators.required, Validators.email, Validators.maxLength(255)]],
      email2: [company.email2, [Validators.email, Validators.maxLength(255)]],
      phoneNumber: [company.phoneNumber, [Validators.required, Validators.maxLength(20)]],
      phoneNumber2: [company.phoneNumber2, [Validators.maxLength(20)]]
    });
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
   * Upload logo
   *
   * @param fileList
   */
  processLogo(fileList: FileList): void {
    // Return if canceled
    if (!fileList.length) {
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'image/gif'];
    const file = fileList[0];

    // Return if the file is not allowed
    if (!allowedTypes.includes(file.type)) {
      this.invalidLogoErr = "Only jpg, jpeg, png, gif and tiff image formats are allowed";
      return;
    }
    else if (file.size / (1024 * 1024) > 3.0) {
      this.invalidLogoErr = "The image is too big, maximum allowed size is 3 MB";
      return;
    }

    this.invalidLogoErr = null;

    //Set the file to form
    this.companyInfoForm.get('logoImage').setValue({
      name: file.name,
      file: file
  });

    // Preview logo
    this._readAsDataURL(file).then((data) => {

      this.logoDataURL = data;
      this._changeDetectorRef.markForCheck();
    });

    // Upload the logo service call

  }

  /**
    * Cancel logo change
    */
  cancelLogoChange(): void {
    this.logoDataURL = this.companyInfoForm.get('logoImageBase64')?.value;
    this.logoEditMode = false;
    this.invalidLogoErr = null;
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
   * Cancel company info save operation
   */
  cancelCompanyInfoSave(): void {
    this.initCompanyInfoForm(this.companyInfo);
    this.companyInfoEditStatus = 'none';
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Save company info
   */
  saveCompanyInfo(): void {
    if (this.companyInfoForm.valid) {
      this._siteConfigService.updateCompanyInfo(this.companyInfoForm.value).pipe(
        take(1)
      ).subscribe((info) => {
        if(info) {
          this.companyInfoEditStatus = 'success';
        }
        else {
          this.companyInfoEditStatus = 'failed';
          this.initCompanyInfoForm(this.companyInfo);
        }
        this._changeDetectorRef.markForCheck();
      });
    }
    else {
      this.smtpConfigForm.markAllAsTouched();
    }
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
