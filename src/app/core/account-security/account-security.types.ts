export interface TwoFAStatus {
    twoFAEnabled: boolean,
    twoFactorOption?: number | null,
    hasAuthenticator: boolean
}

export interface TwoFAUpdate {
    TwoFactorOption?: number | null,
    VerificationCode: string 
}

export interface UpdateTwoFAResult {
    succeeded: boolean;
    twoFAEnabled: boolean;
    TwoFactorOption?: number | null,
    needAuthenticatorSetup: boolean,
    qr: string,
    authenticatorSetupKey: string
}

export interface VerifyAuthenticator {
    userId: number,
    verificationCode: string
}