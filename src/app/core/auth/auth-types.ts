import { User } from 'app/core/user/user.types';
export enum SignInStatus
{
    Unauthenticated,
    Authenticated,
    RequiresTwoFactor,
    SessionLocked
}

export enum UserType {
    SystemAdmin,
    SystemUser,
    Customer,
    CustomerClient
}

export enum AccountStatus {
    Active,
    Banned,
    Disabled,
    PendingEmailVerification,
    PendingManualVerification,
    VerificationFailed,
    VerificationFailedMaxLimitExceeded,
    Limited
}

export interface AuthStatus
{
    userId?: number | null;
    userEmail?: string;
    userPhone?: string | null;
    signInStatus: SignInStatus;
    TwoFactor?: any | null;
    rememberMe?: boolean | null;
    roles?: string[] | null;
    claims?: string[] | null;
    sessionLockEnabled?: boolean | null;
    userType?: UserType | null;
    accountStatus?: AccountStatus | null;
    isSessionLocked?: boolean | null;
}