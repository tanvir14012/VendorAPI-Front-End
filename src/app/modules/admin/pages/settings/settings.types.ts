import { AccountStatus, UserType } from './../../../../core/auth/auth-types';


export interface AccountSecurity 
{
    id: string; //user Id
    emailChangeInProgress: boolean;
    emailChangeSuccess?: boolean | null;
    passwordChangeSuccess?: boolean | null;
    phoneChangeInProgress: boolean;
    phoneChangeSuccess?: boolean | null;
    twoFA?: any;
}

export interface Country
{
    id: string;
    iso: string;
    name: string;
    code: string;
    flagImagePos: string;
}

export interface UserPrivilegeInfo {
    accountStatus: AccountStatus,
    userType: UserType
}

export const countries = [
    {
        id          : '19430ee3-b0fe-4987-a7c8-74453ad5504d',
        iso         : 'af',
        name        : 'Afghanistan',
        code        : '+93',
        flagImagePos: '-1px -3180px'
    },
    {
        id          : '6c6b5c5c-97d5-4881-b5e1-e05b8f739ee7',
        iso         : 'al',
        name        : 'Albania',
        code        : '+355',
        flagImagePos: '-1px -1310px'
    },
    {
        id          : 'd1f3941f-075e-4777-a5fd-8b196d98cd5a',
        iso         : 'dz',
        name        : 'Algeria',
        code        : '+213',
        flagImagePos: '-1px -681px'
    },
    {
        id          : '0dc3d1b8-f7f3-4c3d-8493-0d8b5a679910',
        iso         : 'as',
        name        : 'American Samoa',
        code        : '+1',
        flagImagePos: '-1px -2058px'
    },
    {
        id          : 'e2e88578-b410-499f-aa59-9bb8da13c781',
        iso         : 'ad',
        name        : 'Andorra',
        code        : '+376',
        flagImagePos: '-1px -766px'
    },
    {
        id          : '4446885b-b391-4b84-866f-2b36603053c4',
        iso         : 'ao',
        name        : 'Angola',
        code        : '+244',
        flagImagePos: '-1px -2636px'
    },
    {
        id          : '07024099-a3db-4881-a628-24e8c0ba2508',
        iso         : 'ai',
        name        : 'Anguilla',
        code        : '+1',
        flagImagePos: '-1px -2687px'
    },
    {
        id          : '26be08bc-d87a-4134-9fb0-73b6a5b47cea',
        iso         : 'ag',
        name        : 'Antigua & Barbuda',
        code        : '+1',
        flagImagePos: '-1px -1140px'
    },
    {
        id          : '53c77399-494e-49df-9e3a-587b536c033e',
        iso         : 'ar',
        name        : 'Argentina',
        code        : '+54',
        flagImagePos: '-1px -3282px'
    },
    {
        id          : '9f5753c4-e9e4-4975-86b4-9eb9f4f484de',
        iso         : 'am',
        name        : 'Armenia',
        code        : '+374',
        flagImagePos: '-1px -205px'
    },
    {
        id          : 'f1bbb833-5c47-4e17-b8c3-1d492107dc86',
        iso         : 'aw',
        name        : 'Aruba',
        code        : '+297',
        flagImagePos: '-1px -1021px'
    },
    {
        id          : 'dc7e3322-8bd5-4c49-932d-a8e50bd1f9ad',
        iso         : 'ac',
        name        : 'Ascension Island',
        code        : '+247',
        flagImagePos: '-1px -86px'
    },
    {
        id          : '4505ba35-afa5-47ef-a6c7-9b57f1dcd187',
        iso         : 'au',
        name        : 'Australia',
        code        : '+61',
        flagImagePos: '-1px -2279px'
    },
    {
        id          : '57b3cd1f-d5d6-403b-8137-fbeeacaf136a',
        iso         : 'at',
        name        : 'Austria',
        code        : '+43',
        flagImagePos: '-1px -1735px'
    },
    {
        id          : '11cbde08-3c33-422c-bf4b-85561595ffb5',
        iso         : 'az',
        name        : 'Azerbaijan',
        code        : '+994',
        flagImagePos: '-1px -1599px'
    },
    {
        id          : '48c1e060-e685-4e91-8de8-725f42576e6c',
        iso         : 'bs',
        name        : 'Bahamas',
        code        : '+1',
        flagImagePos: '-1px -460px'
    },
    {
        id          : 'ee23ffb8-9540-4630-948e-ceba52fa54ce',
        iso         : 'bh',
        name        : 'Bahrain',
        code        : '+973',
        flagImagePos: '-1px -1956px'
    },
    {
        id          : 'b5f37cb6-7870-4ed9-8f92-3864bd870062',
        iso         : 'bd',
        name        : 'Bangladesh',
        code        : '+880',
        flagImagePos: '-1px -2364px'
    },
    {
        id          : '92de9080-f709-493e-a9fa-d23b3d4093d4',
        iso         : 'bb',
        name        : 'Barbados',
        code        : '+1',
        flagImagePos: '-1px -2075px'
    },
    {
        id          : 'a2f4ff04-86b8-4bc0-952f-686bfe99c07f',
        iso         : 'by',
        name        : 'Belarus',
        code        : '+375',
        flagImagePos: '-1px -1412px'
    },
    {
        id          : '2025b6b3-1287-4b4c-8b13-36deb44e5751',
        iso         : 'be',
        name        : 'Belgium',
        code        : '+32',
        flagImagePos: '-1px -1px'
    },
    {
        id          : '70d82950-3eca-496f-866d-d99c136260e5',
        iso         : 'bz',
        name        : 'Belize',
        code        : '+501',
        flagImagePos: '-1px -613px'
    },
    {
        id          : 'dc0bedf5-e197-46b4-af21-c2e495b15768',
        iso         : 'bj',
        name        : 'Benin',
        code        : '+229',
        flagImagePos: '-1px -1684px'
    },
    {
        id          : 'aeee4f9d-99a1-4c6b-826c-f3c0ff707dce',
        iso         : 'bm',
        name        : 'Bermuda',
        code        : '+1',
        flagImagePos: '-1px -2585px'
    },
    {
        id          : '73b80fa7-50d0-4fd5-8d26-24baade525a2',
        iso         : 'bt',
        name        : 'Bhutan',
        code        : '+975',
        flagImagePos: '-1px -2483px'
    },
    {
        id          : '571bf396-810b-4fc4-9ffc-c9e4db9d3bef',
        iso         : 'bo',
        name        : 'Bolivia',
        code        : '+591',
        flagImagePos: '-1px -2177px'
    },
    {
        id          : 'cbfbf28b-b79b-4b7d-a2e9-37a2000aa15b',
        iso         : 'ba',
        name        : 'Bosnia & Herzegovina',
        code        : '+387',
        flagImagePos: '-1px -2092px'
    },
    {
        id          : 'f929da82-915c-4ac8-ba13-aa1b44174c71',
        iso         : 'bw',
        name        : 'Botswana',
        code        : '+267',
        flagImagePos: '-1px -3724px'
    },
    {
        id          : '2dea0689-0548-400c-a58f-ebcd6373cd07',
        iso         : 'br',
        name        : 'Brazil',
        code        : '+55',
        flagImagePos: '-1px -1004px'
    },
    {
        id          : 'd2c2c16f-15f8-467b-8c42-a02babe5362b',
        iso         : 'io',
        name        : 'British Indian Ocean Territory',
        code        : '+246',
        flagImagePos: '-1px -86px'
    },
    {
        id          : '1d90db23-ca7c-4d23-a995-9b2a8021f4ad',
        iso         : 'vg',
        name        : 'British Virgin Islands',
        code        : '+1',
        flagImagePos: '-1px -1854px'
    },
    {
        id          : 'f16aebb2-cdae-4af2-aba5-f66f34d6ac3a',
        iso         : 'bn',
        name        : 'Brunei',
        code        : '+673',
        flagImagePos: '-1px -2228px'
    },
    {
        id          : '499d6ee6-8f8b-4a5b-bb92-9cce9d1c6546',
        iso         : 'bg',
        name        : 'Bulgaria',
        code        : '+359',
        flagImagePos: '-1px -3537px'
    },
    {
        id          : '67e2986b-98d0-44c3-b08f-6cbba8b14ff8',
        iso         : 'bf',
        name        : 'Burkina Faso',
        code        : '+226',
        flagImagePos: '-1px -953px'
    },
    {
        id          : 'fea611f2-4aa3-427f-86e1-657e8aef24a8',
        iso         : 'bi',
        name        : 'Burundi',
        code        : '+257',
        flagImagePos: '-1px -2551px'
    },
    {
        id          : '3b959360-3d04-4018-afdf-a392afa1881d',
        iso         : 'kh',
        name        : 'Cambodia',
        code        : '+855',
        flagImagePos: '-1px -290px'
    },
    {
        id          : '9336ba3b-01be-4b84-82b5-f02395856ac5',
        iso         : 'cm',
        name        : 'Cameroon',
        code        : '+237',
        flagImagePos: '-1px -2806px'
    },
    {
        id          : '36a159b0-f33e-4481-85b0-751bdd9ea79d',
        iso         : 'ca',
        name        : 'Canada',
        code        : '+1',
        flagImagePos: '-1px -1803px'
    },
    {
        id          : 'a3038010-382e-436e-b61d-e4b923aa1cb3',
        iso         : 'cv',
        name        : 'Cape Verde',
        code        : '+238',
        flagImagePos: '-1px -3639px'
    },
    {
        id          : 'dd898165-12a9-4c90-a3e4-012149c0feac',
        iso         : 'bq',
        name        : 'Caribbean Netherlands',
        code        : '+599',
        flagImagePos: '-1px -3741px'
    },
    {
        id          : 'a1f30091-26da-481a-a84f-2638b2d7c14d',
        iso         : 'ky',
        name        : 'Cayman Islands',
        code        : '+1',
        flagImagePos: '-1px -375px'
    },
    {
        id          : '469b4a79-8a1a-4428-b7bd-4665202b7292',
        iso         : 'cf',
        name        : 'Central African Republic',
        code        : '+236',
        flagImagePos: '-1px -2466px'
    },
    {
        id          : 'a9c2fa4b-c22a-41bd-9735-b4adeadab7f7',
        iso         : 'td',
        name        : 'Chad',
        code        : '+235',
        flagImagePos: '-1px -1055px'
    },
    {
        id          : 'f0825f0d-e086-49e0-846e-9e4784bf872c',
        iso         : 'cl',
        name        : 'Chile',
        code        : '+56',
        flagImagePos: '-1px -1752px'
    },
    {
        id          : '89d3f07d-446e-459d-b168-595af96d708f',
        iso         : 'cn',
        name        : 'China',
        code        : '+86',
        flagImagePos: '-1px -1072px'
    },
    {
        id          : '903801ce-2f83-4df8-a380-9dc6df6c35cf',
        iso         : 'co',
        name        : 'Colombia',
        code        : '+57',
        flagImagePos: '-1px -409px'
    },
    {
        id          : '55d7d2be-8273-4770-844c-1ef87524cd27',
        iso         : 'km',
        name        : 'Comoros',
        code        : '+269',
        flagImagePos: '-1px -1871px'
    },
    {
        id          : 'a5b00b2f-01de-4c0d-914f-fe05c92c8f43',
        iso         : 'cg',
        name        : 'Congo - Brazzaville',
        code        : '+242',
        flagImagePos: '-1px -2398px'
    },
    {
        id          : '58e07572-21b9-4630-a17c-a51c0ade4b8a',
        iso         : 'cd',
        name        : 'Congo - Kinshasa',
        code        : '+243',
        flagImagePos: '-1px -1990px'
    },
    {
        id          : '5a09d08e-b6ab-4084-8350-1d97d504c222',
        iso         : 'ck',
        name        : 'Cook Islands',
        code        : '+682',
        flagImagePos: '-1px -3112px'
    },
    {
        id          : '760f2b33-0822-4ad9-83cf-b497dcf273bb',
        iso         : 'cr',
        name        : 'Costa Rica',
        code        : '+506',
        flagImagePos: '-1px -2857px'
    },
    {
        id          : '489db55f-6316-4f43-a1c7-a0921e16743a',
        iso         : 'ci',
        name        : 'Côte d’Ivoire',
        code        : '+225',
        flagImagePos: '-1px -2194px'
    },
    {
        id          : '398c1d99-7ee4-44cd-9c2a-067acba2c8fb',
        iso         : 'hr',
        name        : 'Croatia',
        code        : '+385',
        flagImagePos: '-1px -1174px'
    },
    {
        id          : '572da7dc-8463-4797-ad84-7fcf8f53bb80',
        iso         : 'cu',
        name        : 'Cuba',
        code        : '+53',
        flagImagePos: '-1px -987px'
    },
    {
        id          : '572674e5-b0d4-4206-8310-70f4656e65e2',
        iso         : 'cw',
        name        : 'Curaçao',
        code        : '+599',
        flagImagePos: '-1px -3758px'
    },
    {
        id          : 'ac1e2a9d-a888-427e-9ad3-a0cbb27e603a',
        iso         : 'cy',
        name        : 'Cyprus',
        code        : '+357',
        flagImagePos: '-1px -732px'
    },
    {
        id          : '075ce3fd-83e7-472a-89cb-8b5e224102c4',
        iso         : 'cz',
        name        : 'Czechia',
        code        : '+420',
        flagImagePos: '-1px -3095px'
    },
    {
        id          : '4cde631a-97e9-4fc2-9465-9d9a433ca5c1',
        iso         : 'dk',
        name        : 'Denmark',
        code        : '+45',
        flagImagePos: '-1px -1820px'
    },
    {
        id          : '1b9c40a6-bf03-4759-b6ab-8edefafd8b44',
        iso         : 'dj',
        name        : 'Djibouti',
        code        : '+253',
        flagImagePos: '-1px -2874px'
    },
    {
        id          : 'f5eec2ba-1a0b-465c-b3e5-9bd8458d0704',
        iso         : 'dm',
        name        : 'Dominica',
        code        : '+1',
        flagImagePos: '-1px -3350px'
    },
    {
        id          : 'cb6921fc-df2a-4a97-8a34-4d901ac1e994',
        iso         : 'do',
        name        : 'Dominican Republic',
        code        : '+1',
        flagImagePos: '-1px -2007px'
    },
    {
        id          : '7d6641f1-ef97-4bee-b1b8-0f54fea35aeb',
        iso         : 'ec',
        name        : 'Ecuador',
        code        : '+593',
        flagImagePos: '-1px -1531px'
    },
    {
        id          : 'dfeb30b9-b4b8-4931-9334-c3961b7843a6',
        iso         : 'eg',
        name        : 'Egypt',
        code        : '+20',
        flagImagePos: '-1px -3027px'
    },
    {
        id          : '7d9f7158-7206-491f-a614-6a3e7e6af354',
        iso         : 'sv',
        name        : 'El Salvador',
        code        : '+503',
        flagImagePos: '-1px -2160px'
    },
    {
        id          : 'bcdbebc2-a51d-4891-93b0-52b463d0841d',
        iso         : 'gq',
        name        : 'Equatorial Guinea',
        code        : '+240',
        flagImagePos: '-1px -1973px'
    },
    {
        id          : '53c2c225-f321-406f-b377-7c8b6720bcb4',
        iso         : 'er',
        name        : 'Eritrea',
        code        : '+291',
        flagImagePos: '-1px -936px'
    },
    {
        id          : 'ba0e995a-17a8-48ff-88e6-54ff8207b038',
        iso         : 'ee',
        name        : 'Estonia',
        code        : '+372',
        flagImagePos: '-1px -3333px'
    },
    {
        id          : 'abe9af9b-91da-4bba-9adf-a496bf414719',
        iso         : 'sz',
        name        : 'Eswatini',
        code        : '+268',
        flagImagePos: '-1px -3129px'
    },
    {
        id          : 'e993ecc8-732a-4446-8ab1-144c084f3192',
        iso         : 'et',
        name        : 'Ethiopia',
        code        : '+251',
        flagImagePos: '-1px -3367px'
    },
    {
        id          : '6c7aae9d-e18d-4d09-8467-7bb99d925768',
        iso         : 'fk',
        name        : 'Falkland Islands (Islas Malvinas)',
        code        : '+500',
        flagImagePos: '-1px -3809px'
    },
    {
        id          : '92e704eb-9573-4d91-b932-2b1eddaacb3e',
        iso         : 'fo',
        name        : 'Faroe Islands',
        code        : '+298',
        flagImagePos: '-1px -1429px'
    },
    {
        id          : '561c079c-69c2-4e62-b947-5cd76783a67c',
        iso         : 'fj',
        name        : 'Fiji',
        code        : '+679',
        flagImagePos: '-1px -2500px'
    },
    {
        id          : '3f31a88e-c7ed-47fa-9aae-2058be7cbe09',
        iso         : 'fi',
        name        : 'Finland',
        code        : '+358',
        flagImagePos: '-1px -2568px'
    },
    {
        id          : '4c8ba1fc-0203-4a8f-8321-4dda4a0c6732',
        iso         : 'fr',
        name        : 'France',
        code        : '+33',
        flagImagePos: '-1px -324px'
    },
    {
        id          : '198074d5-67a2-4fd3-b13d-429a394b6371',
        iso         : 'gf',
        name        : 'French Guiana',
        code        : '+594',
        flagImagePos: '-1px -324px'
    },
    {
        id          : '2f5ff3d1-745e-48a1-b4e8-a377b22af812',
        iso         : 'pf',
        name        : 'French Polynesia',
        code        : '+689',
        flagImagePos: '-1px -2262px'
    },
    {
        id          : 'a8b80121-5529-4cfe-83fb-6b1f6c81abcb',
        iso         : 'ga',
        name        : 'Gabon',
        code        : '+241',
        flagImagePos: '-1px -1157px'
    },
    {
        id          : 'c9bc7d57-7883-4f63-bc6e-5dcc3db8612d',
        iso         : 'gm',
        name        : 'Gambia',
        code        : '+220',
        flagImagePos: '-1px -817px'
    },
    {
        id          : '1fc146d8-cebe-4ef1-bb0f-30bd0870ccf9',
        iso         : 'ge',
        name        : 'Georgia',
        code        : '+995',
        flagImagePos: '-1px -1123px'
    },
    {
        id          : 'e74ac4b1-0b4b-4630-bac0-2e53e270b363',
        iso         : 'de',
        name        : 'Germany',
        code        : '+49',
        flagImagePos: '-1px -3452px'
    },
    {
        id          : 'adda89c9-4b47-4552-85c4-668f2cef2dbd',
        iso         : 'gh',
        name        : 'Ghana',
        code        : '+233',
        flagImagePos: '-1px -2891px'
    },
    {
        id          : '962a059b-a5ac-4e2f-9405-5c418cadb6b0',
        iso         : 'gi',
        name        : 'Gibraltar',
        code        : '+350',
        flagImagePos: '-1px -341px'
    },
    {
        id          : '0acd0dae-0f39-4c23-be1d-c0295539d8c4',
        iso         : 'gr',
        name        : 'Greece',
        code        : '+30',
        flagImagePos: '-1px -188px'
    },
    {
        id          : '7529a6e4-8a6a-4c27-885e-ff0c5e15e515',
        iso         : 'gl',
        name        : 'Greenland',
        code        : '+299',
        flagImagePos: '-1px -2347px'
    },
    {
        id          : '416ba85d-f860-48dc-9c60-32602c07e266',
        iso         : 'gd',
        name        : 'Grenada',
        code        : '+1',
        flagImagePos: '-1px -3316px'
    },
    {
        id          : 'f43f1f96-1fb1-4e5e-b818-71e60e501fd4',
        iso         : 'gp',
        name        : 'Guadeloupe',
        code        : '+590',
        flagImagePos: '-1px -511px'
    },
    {
        id          : 'e29122da-20cf-4d24-bc68-93f9c3296730',
        iso         : 'gu',
        name        : 'Guam',
        code        : '+1',
        flagImagePos: '-1px -3265px'
    },
    {
        id          : '8a24ff28-dcae-4846-b0c1-18cfcb04de06',
        iso         : 'gt',
        name        : 'Guatemala',
        code        : '+502',
        flagImagePos: '-1px -1208px'
    },
    {
        id          : 'b617a005-be15-49c8-9533-c0376681a564',
        iso         : 'gn',
        name        : 'Guinea',
        code        : '+224',
        flagImagePos: '-1px -3520px'
    },
    {
        id          : 'd9913e74-e340-4a4f-bf4b-aaaf1747364b',
        iso         : 'gw',
        name        : 'Guinea-Bissau',
        code        : '+245',
        flagImagePos: '-1px -2602px'
    },
    {
        id          : 'c8245da4-cd4f-4818-a41e-42afec6faa9a',
        iso         : 'gy',
        name        : 'Guyana',
        code        : '+592',
        flagImagePos: '-1px -1038px'
    },
    {
        id          : 'c598961d-3040-4dbb-8934-6d8eb4b9be97',
        iso         : 'ht',
        name        : 'Haiti',
        code        : '+509',
        flagImagePos: '-1px -392px'
    },
    {
        id          : 'f51aadf1-3c7a-4d24-b8fb-69c7e05243e4',
        iso         : 'hn',
        name        : 'Honduras',
        code        : '+504',
        flagImagePos: '-1px -2959px'
    },
    {
        id          : 'a621dbe5-fb11-4f7f-9a8d-2330bd20c563',
        iso         : 'hk',
        name        : 'Hong Kong',
        code        : '+852',
        flagImagePos: '-1px -3707px'
    },
    {
        id          : 'a113fe26-d409-4ab7-b27c-0e8ac112071f',
        iso         : 'hu',
        name        : 'Hungary',
        code        : '+36',
        flagImagePos: '-1px -902px'
    },
    {
        id          : '6430b612-4071-4614-bfdb-408fbb0b8fa4',
        iso         : 'is',
        name        : 'Iceland',
        code        : '+354',
        flagImagePos: '-1px -2704px'
    },
    {
        id          : '4cce1334-df1f-4b11-9f15-a4faaac3d0db',
        iso         : 'in',
        name        : 'India',
        code        : '+91',
        flagImagePos: '-1px -2245px'
    },
    {
        id          : '54969b2f-6aa9-4a58-850d-b4779ef3038e',
        iso         : 'id',
        name        : 'Indonesia',
        code        : '+62',
        flagImagePos: '-1px -2653px'
    },
    {
        id          : 'cb631628-5854-44d2-9dbc-47cdf9c9ea5e',
        iso         : 'ir',
        name        : 'Iran',
        code        : '+98',
        flagImagePos: '-1px -2738px'
    },
    {
        id          : '21a50cc1-954c-49c2-8296-696f1f57b79e',
        iso         : 'iq',
        name        : 'Iraq',
        code        : '+964',
        flagImagePos: '-1px -851px'
    },
    {
        id          : '3e17cb8a-9c44-4c75-b417-556546ceebff',
        iso         : 'ie',
        name        : 'Ireland',
        code        : '+353',
        flagImagePos: '-1px -2670px'
    },
    {
        id          : '0a15f5a3-7571-478a-9fcd-6cbd6563e08c',
        iso         : 'il',
        name        : 'Israel',
        code        : '+972',
        flagImagePos: '-1px -426px'
    },
    {
        id          : '2cbab786-d79b-4ea1-ab26-0553c5e423d3',
        iso         : 'it',
        name        : 'Italy',
        code        : '+39',
        flagImagePos: '-1px -154px'
    },
    {
        id          : '33a67cd8-0858-46c3-b833-4fd395d2daa4',
        iso         : 'jm',
        name        : 'Jamaica',
        code        : '+1',
        flagImagePos: '-1px -2296px'
    },
    {
        id          : '5edf8bb6-6a29-44ee-b5f2-7d7cbf61f971',
        iso         : 'jp',
        name        : 'Japan',
        code        : '+81',
        flagImagePos: '-1px -528px'
    },
    {
        id          : '879b69bb-3f8f-484f-a767-7fdeef6bae15',
        iso         : 'jo',
        name        : 'Jordan',
        code        : '+962',
        flagImagePos: '-1px -1905px'
    },
    {
        id          : '4217e52c-2835-4c7b-87d3-e290c4fa6074',
        iso         : 'kz',
        name        : 'Kazakhstan',
        code        : '+7',
        flagImagePos: '-1px -1565px'
    },
    {
        id          : '934b172d-4427-47f6-8648-6411652be23d',
        iso         : 'ke',
        name        : 'Kenya',
        code        : '+254',
        flagImagePos: '-1px -3605px'
    },
    {
        id          : '2358e177-3956-4bcf-a954-56275e90e28d',
        iso         : 'ki',
        name        : 'Kiribati',
        code        : '+686',
        flagImagePos: '-1px -477px'
    },
    {
        id          : '98e8fae8-cd1b-419f-813b-ee348b51d843',
        iso         : 'xk',
        name        : 'Kosovo',
        code        : '+383',
        flagImagePos: '-1px -3860px'
    },
    {
        id          : '5376f774-4fcb-47dc-b118-e48d34b030ef',
        iso         : 'kw',
        name        : 'Kuwait',
        code        : '+965',
        flagImagePos: '-1px -3435px'
    },
    {
        id          : '9bc380c4-5840-4d26-a615-310cd817ae94',
        iso         : 'kg',
        name        : 'Kyrgyzstan',
        code        : '+996',
        flagImagePos: '-1px -2143px'
    },
    {
        id          : '3278e7f0-176b-4352-9e38-df59b052b91f',
        iso         : 'la',
        name        : 'Laos',
        code        : '+856',
        flagImagePos: '-1px -562px'
    },
    {
        id          : 'e2ba5fad-f531-467c-b195-a6cd90136e19',
        iso         : 'lv',
        name        : 'Latvia',
        code        : '+371',
        flagImagePos: '-1px -2619px'
    },
    {
        id          : '49f74ca5-9ff1-44af-8e9c-59e1c4704e83',
        iso         : 'lb',
        name        : 'Lebanon',
        code        : '+961',
        flagImagePos: '-1px -1616px'
    },
    {
        id          : 'd94b6d96-17c1-4de8-abc3-3e14873b62c0',
        iso         : 'ls',
        name        : 'Lesotho',
        code        : '+266',
        flagImagePos: '-1px -3010px'
    },
    {
        id          : 'e35005f8-285e-4fe5-9cda-def721d9cc7b',
        iso         : 'lr',
        name        : 'Liberia',
        code        : '+231',
        flagImagePos: '-1px -2823px'
    },
    {
        id          : '60788779-78f0-4b2b-8ad8-c7e4bbde10b5',
        iso         : 'ly',
        name        : 'Libya',
        code        : '+218',
        flagImagePos: '-1px -137px'
    },
    {
        id          : 'f24ad4ea-454a-4d40-a1f1-db188ec0b75e',
        iso         : 'li',
        name        : 'Liechtenstein',
        code        : '+423',
        flagImagePos: '-1px -1276px'
    },
    {
        id          : 'f6709b72-4150-4cde-a37b-e6eb95f5bd1d',
        iso         : 'lt',
        name        : 'Lithuania',
        code        : '+370',
        flagImagePos: '-1px -1446px'
    },
    {
        id          : '0d0c1a84-f645-4ffe-87d2-9a7bb4f88bbc',
        iso         : 'lu',
        name        : 'Luxembourg',
        code        : '+352',
        flagImagePos: '-1px -1922px'
    },
    {
        id          : '5b3fdebe-a4ed-47c6-88c3-d867d3a79bf0',
        iso         : 'mo',
        name        : 'Macao',
        code        : '+853',
        flagImagePos: '-1px -3554px'
    },
    {
        id          : '6a84f456-bc77-4b76-8651-e2a0994f3278',
        iso         : 'mg',
        name        : 'Madagascar',
        code        : '+261',
        flagImagePos: '-1px -1667px'
    },
    {
        id          : '2a5d5baf-1db7-4606-a330-227834c77098',
        iso         : 'mw',
        name        : 'Malawi',
        code        : '+265',
        flagImagePos: '-1px -2942px'
    },
    {
        id          : 'f2b32090-6d8d-40db-ba50-a63037926508',
        iso         : 'my',
        name        : 'Malaysia',
        code        : '+60',
        flagImagePos: '-1px -2517px'
    },
    {
        id          : '51c7830c-0c76-44ed-bcdf-be75688e1d0c',
        iso         : 'mv',
        name        : 'Maldives',
        code        : '+960',
        flagImagePos: '-1px -800px'
    },
    {
        id          : 'ea7a2274-0542-4bbb-b629-aa63bef97442',
        iso         : 'ml',
        name        : 'Mali',
        code        : '+223',
        flagImagePos: '-1px -3469px'
    },
    {
        id          : '6f70796e-8f64-4a1a-ac2a-990d7d502db3',
        iso         : 'mt',
        name        : 'Malta',
        code        : '+356',
        flagImagePos: '-1px -2041px'
    },
    {
        id          : 'c60f429e-0d4f-42cf-96f9-e7dc4fdcd5ee',
        iso         : 'mh',
        name        : 'Marshall Islands',
        code        : '+692',
        flagImagePos: '-1px -1463px'
    },
    {
        id          : 'e8afae89-e5b0-4551-bbd4-bbfcee50c8ad',
        iso         : 'mq',
        name        : 'Martinique',
        code        : '+596',
        flagImagePos: '-1px -239px'
    },
    {
        id          : '361afc7c-ee94-464b-b5cb-f059ecd79e99',
        iso         : 'mr',
        name        : 'Mauritania',
        code        : '+222',
        flagImagePos: '-1px -307px'
    },
    {
        id          : 'bce43b5e-d2f7-47ca-b5c9-9ae72ba67bda',
        iso         : 'mu',
        name        : 'Mauritius',
        code        : '+230',
        flagImagePos: '-1px -2993px'
    },
    {
        id          : 'd153dc32-4821-4f05-a5c8-564d003da5e1',
        iso         : 'mx',
        name        : 'Mexico',
        code        : '+52',
        flagImagePos: '-1px -2755px'
    },
    {
        id          : '80f9f386-231f-4d96-b950-5f6b6edbeb63',
        iso         : 'fm',
        name        : 'Micronesia',
        code        : '+691',
        flagImagePos: '-1px -2313px'
    },
    {
        id          : 'a1d89e32-4b91-4519-b0d9-7d61299394ef',
        iso         : 'md',
        name        : 'Moldova',
        code        : '+373',
        flagImagePos: '-1px -3690px'
    },
    {
        id          : '0afeb22c-c106-479b-af45-1380fb8b404c',
        iso         : 'mc',
        name        : 'Monaco',
        code        : '+377',
        flagImagePos: '-1px -1191px'
    },
    {
        id          : 'a18d0204-7c4a-425c-a33e-cbfac01be162',
        iso         : 'mn',
        name        : 'Mongolia',
        code        : '+976',
        flagImagePos: '-1px -3503px'
    },
    {
        id          : '260479fc-0410-4ccd-a963-e06c9f059bdb',
        iso         : 'me',
        name        : 'Montenegro',
        code        : '+382',
        flagImagePos: '-1px -2976px'
    },
    {
        id          : 'a66872f1-ba90-420f-8f55-f0fbb10abce1',
        iso         : 'ms',
        name        : 'Montserrat',
        code        : '+1',
        flagImagePos: '-1px -749px'
    },
    {
        id          : '8fd1ba13-cb1a-488d-b715-01724d56d9dd',
        iso         : 'ma',
        name        : 'Morocco',
        code        : '+212',
        flagImagePos: '-1px -3214px'
    },
    {
        id          : '5d26fba4-6d15-4cd4-a23f-9034d952e580',
        iso         : 'mz',
        name        : 'Mozambique',
        code        : '+258',
        flagImagePos: '-1px -834px'
    },
    {
        id          : 'f9c12031-14dc-495f-b150-28dddce17e3f',
        iso         : 'mm',
        name        : 'Myanmar (Burma)',
        code        : '+95',
        flagImagePos: '-1px -18px'
    },
    {
        id          : '6e21e956-2740-4058-a758-3b249f628a7b',
        iso         : 'na',
        name        : 'Namibia',
        code        : '+264',
        flagImagePos: '-1px -2534px'
    },
    {
        id          : '4a07dd5a-9341-4b06-969f-4bcd9c32e2a0',
        iso         : 'nr',
        name        : 'Nauru',
        code        : '+674',
        flagImagePos: '-1px -2330px'
    },
    {
        id          : '9d7121ce-1445-4c84-9401-ddc703d9dedb',
        iso         : 'np',
        name        : 'Nepal',
        code        : '+977',
        flagImagePos: '-1px -120px'
    },
    {
        id          : '31fbb24d-7c38-4ca8-b385-48d76a0685e3',
        iso         : 'nl',
        name        : 'Netherlands',
        code        : '+31',
        flagImagePos: '-1px -1888px'
    },
    {
        id          : '18071cc2-c457-4b4f-9217-2519a0b52c25',
        iso         : 'nc',
        name        : 'New Caledonia',
        code        : '+687',
        flagImagePos: '-1px -1650px'
    },
    {
        id          : 'c4b0e7d1-08b2-421b-8ff6-913020cbf271',
        iso         : 'nz',
        name        : 'New Zealand',
        code        : '+64',
        flagImagePos: '-1px -2024px'
    },
    {
        id          : '25719230-2c64-4525-96c4-d4427dd2e40b',
        iso         : 'ni',
        name        : 'Nicaragua',
        code        : '+505',
        flagImagePos: '-1px -171px'
    },
    {
        id          : 'a1090a0b-7f89-4d75-8c92-e460da9103ab',
        iso         : 'ne',
        name        : 'Niger',
        code        : '+227',
        flagImagePos: '-1px -715px'
    },
    {
        id          : '6869e4bb-32b8-43ff-84d1-67d9ee832e1f',
        iso         : 'ng',
        name        : 'Nigeria',
        code        : '+234',
        flagImagePos: '-1px -3418px'
    },
    {
        id          : '52b3ae35-196a-4e22-81e2-67b816a32d0e',
        iso         : 'nu',
        name        : 'Niue',
        code        : '+683',
        flagImagePos: '-1px -2840px'
    },
    {
        id          : '9f4e45d4-c7e1-4ba9-84d0-e712e7213c95',
        iso         : 'nf',
        name        : 'Norfolk Island',
        code        : '+672',
        flagImagePos: '-1px -256px'
    },
    {
        id          : '2db1b02c-631e-40a0-94d8-f1e567b1f705',
        iso         : 'kp',
        name        : 'North Korea',
        code        : '+850',
        flagImagePos: '-1px -2415px'
    },
    {
        id          : '92621b3f-55f5-42bb-8604-d0302e355e31',
        iso         : 'mk',
        name        : 'North Macedonia',
        code        : '+389',
        flagImagePos: '-1px -1769px'
    },
    {
        id          : '3cee8ab2-5cb3-43ea-b8ab-7016187d33e9',
        iso         : 'mp',
        name        : 'Northern Mariana Islands',
        code        : '+1',
        flagImagePos: '-1px -919px'
    },
    {
        id          : '77683fad-f106-4a94-a629-9562650edb35',
        iso         : 'no',
        name        : 'Norway',
        code        : '+47',
        flagImagePos: '-1px -1089px'
    },
    {
        id          : '09090411-ef9b-44f3-aeb9-65b5e338b8d6',
        iso         : 'om',
        name        : 'Oman',
        code        : '+968',
        flagImagePos: '-1px -3384px'
    },
    {
        id          : '18d4f06b-233b-4398-a9f8-6b4a4eaf6c71',
        iso         : 'pk',
        name        : 'Pakistan',
        code        : '+92',
        flagImagePos: '-1px -2772px'
    },
    {
        id          : 'b1da5023-aab9-431c-921c-4f3e12b1aa7a',
        iso         : 'pw',
        name        : 'Palau',
        code        : '+680',
        flagImagePos: '-1px -273px'
    },
    {
        id          : 'e6442ab2-ac99-4a02-9d7c-fd878e50de8a',
        iso         : 'ps',
        name        : 'Palestine',
        code        : '+970',
        flagImagePos: '-1px -1548px'
    },
    {
        id          : '6bb10fb5-8b4a-4136-a82e-6be6c017ab76',
        iso         : 'pa',
        name        : 'Panama',
        code        : '+507',
        flagImagePos: '-1px -1106px'
    },
    {
        id          : 'b070a014-2ce4-4939-a868-951bd1e70923',
        iso         : 'pg',
        name        : 'Papua New Guinea',
        code        : '+675',
        flagImagePos: '-1px -1939px'
    },
    {
        id          : '5e23c743-ce7d-4abc-9dd4-44a700b29090',
        iso         : 'py',
        name        : 'Paraguay',
        code        : '+595',
        flagImagePos: '-1px -3231px'
    },
    {
        id          : '1a83f99d-91b3-438d-a576-5bf0f05fdd12',
        iso         : 'pe',
        name        : 'Peru',
        code        : '+51',
        flagImagePos: '-1px -1225px'
    },
    {
        id          : '667c9699-46b9-40f9-a41f-2c52826bb3cb',
        iso         : 'ph',
        name        : 'Philippines',
        code        : '+63',
        flagImagePos: '-1px -2432px'
    },
    {
        id          : 'b84030ab-3193-4aa2-aef2-d4d21997e536',
        iso         : 'pl',
        name        : 'Poland',
        code        : '+48',
        flagImagePos: '-1px -1514px'
    },
    {
        id          : 'e26d0064-6173-42ab-b761-bf8c639199fa',
        iso         : 'pt',
        name        : 'Portugal',
        code        : '+351',
        flagImagePos: '-1px -664px'
    },
    {
        id          : '0fd9770d-2a91-4b81-8633-f465bc151e16',
        iso         : 'pr',
        name        : 'Puerto Rico',
        code        : '+1',
        flagImagePos: '-1px -596px'
    },
    {
        id          : 'f866eeeb-e64f-4123-ab63-c16e0a00d029',
        iso         : 'qa',
        name        : 'Qatar',
        code        : '+974',
        flagImagePos: '-1px -579px'
    },
    {
        id          : 'c3a3fb54-5731-4a28-96bd-4190cfeeaff0',
        iso         : 're',
        name        : 'Réunion',
        code        : '+262',
        flagImagePos: '-1px -324px'
    },
    {
        id          : 'a6a48809-7e33-42c8-a25a-56ccdd7ccdfe',
        iso         : 'ro',
        name        : 'Romania',
        code        : '+40',
        flagImagePos: '-1px -885px'
    },
    {
        id          : '9556d1e9-3d02-4c5b-a0ce-97a2fd55c74a',
        iso         : 'ru',
        name        : 'Russia',
        code        : '+7',
        flagImagePos: '-1px -868px'
    },
    {
        id          : '6f7f0a97-e8b5-455d-bace-6953de7324eb',
        iso         : 'rw',
        name        : 'Rwanda',
        code        : '+250',
        flagImagePos: '-1px -3673px'
    },
    {
        id          : 'e251cad5-7655-48f7-9892-6edf04a14fd7',
        iso         : 'ws',
        name        : 'Samoa',
        code        : '+685',
        flagImagePos: '-1px -3163px'
    },
    {
        id          : 'f1cfec8c-a960-43b3-8e11-2cad72b4fff8',
        iso         : 'sm',
        name        : 'San Marino',
        code        : '+378',
        flagImagePos: '-1px -2908px'
    },
    {
        id          : 'c5301260-13dc-4012-9678-2b57a5e409ae',
        iso         : 'st',
        name        : 'São Tomé & Príncipe',
        code        : '+239',
        flagImagePos: '-1px -3299px'
    },
    {
        id          : '02599f80-225a-451b-8c25-03b8993f88ac',
        iso         : 'sa',
        name        : 'Saudi Arabia',
        code        : '+966',
        flagImagePos: '-1px -52px'
    },
    {
        id          : 'a54c3469-9668-4063-bfa0-04c450b43d3e',
        iso         : 'sn',
        name        : 'Senegal',
        code        : '+221',
        flagImagePos: '-1px -2925px'
    },
    {
        id          : '687ea07b-a7df-4778-b802-b040676fa56c',
        iso         : 'rs',
        name        : 'Serbia',
        code        : '+381',
        flagImagePos: '-1px -3401px'
    },
    {
        id          : 'd010fb25-7044-4055-9c60-25bc89d83f64',
        iso         : 'sc',
        name        : 'Seychelles',
        code        : '+248',
        flagImagePos: '-1px -1327px'
    },
    {
        id          : '0c46a1e9-fcd8-4e7e-bbb1-ef3bfa83539b',
        iso         : 'sl',
        name        : 'Sierra Leone',
        code        : '+232',
        flagImagePos: '-1px -970px'
    },
    {
        id          : 'e724edb6-9df4-42fb-bc1e-417996aa3020',
        iso         : 'sg',
        name        : 'Singapore',
        code        : '+65',
        flagImagePos: '-1px -35px'
    },
    {
        id          : '7478814a-dc3f-41ff-9341-da7e07ba8499',
        iso         : 'sx',
        name        : 'Sint Maarten',
        code        : '+1',
        flagImagePos: '-1px -3826px'
    },
    {
        id          : 'b1a34e32-38dd-4a38-b63a-7133baf1417a',
        iso         : 'sk',
        name        : 'Slovakia',
        code        : '+421',
        flagImagePos: '-1px -3044px'
    },
    {
        id          : '1c1689a5-580b-411f-9283-b1e8333b351e',
        iso         : 'si',
        name        : 'Slovenia',
        code        : '+386',
        flagImagePos: '-1px -1582px'
    },
    {
        id          : '4b1c6a42-90b0-49ea-b968-8c95b871f0ec',
        iso         : 'sb',
        name        : 'Solomon Islands',
        code        : '+677',
        flagImagePos: '-1px -1361px'
    },
    {
        id          : '7ec9fdff-8ae6-4a14-b55e-6262d46bc3ef',
        iso         : 'so',
        name        : 'Somalia',
        code        : '+252',
        flagImagePos: '-1px -1786px'
    },
    {
        id          : '5e62f404-3e2c-4d63-ad7b-ab0755903842',
        iso         : 'za',
        name        : 'South Africa',
        code        : '+27',
        flagImagePos: '-1px -3248px'
    },
    {
        id          : '31966c2a-7d24-4ebc-8e02-392e4f04f12b',
        iso         : 'kr',
        name        : 'South Korea',
        code        : '+82',
        flagImagePos: '-1px -3078px'
    },
    {
        id          : '1b7ba825-bf7d-42c0-bb73-81f10a4009bf',
        iso         : 'ss',
        name        : 'South Sudan',
        code        : '+211',
        flagImagePos: '-1px -3775px'
    },
    {
        id          : '55c4137b-e437-4e80-bc8f-7857cd7c9364',
        iso         : 'es',
        name        : 'Spain',
        code        : '+34',
        flagImagePos: '-1px -1480px'
    },
    {
        id          : 'fce4c284-e6a1-4e8c-96ca-6edf09e8a401',
        iso         : 'lk',
        name        : 'Sri Lanka',
        code        : '+94',
        flagImagePos: '-1px -3622px'
    },
    {
        id          : '0ae719a5-ae43-45d0-b669-66976a050ef1',
        iso         : 'bl',
        name        : 'St. Barthélemy',
        code        : '+590',
        flagImagePos: '-1px -324px'
    },
    {
        id          : 'a588cc85-32a4-45ff-ba69-627105dab27a',
        iso         : 'sh',
        name        : 'St. Helena',
        code        : '+290',
        flagImagePos: '-1px -630px'
    },
    {
        id          : 'f065aa7c-8d9e-419c-bbf0-9a97011cf272',
        iso         : 'kn',
        name        : 'St. Kitts & Nevis',
        code        : '+1',
        flagImagePos: '-1px -103px'
    },
    {
        id          : '9ea73bcc-2bf5-4ad9-9b39-de33de125f98',
        iso         : 'lc',
        name        : 'St. Lucia',
        code        : '+1',
        flagImagePos: '-1px -1837px'
    },
    {
        id          : '86a5a0e8-bfd4-480e-9bc0-7b88b2248a57',
        iso         : 'mf',
        name        : 'St. Martin',
        code        : '+590',
        flagImagePos: '-1px -86px'
    },
    {
        id          : '540857ba-923a-4656-a19f-cb3914825ecc',
        iso         : 'pm',
        name        : 'St. Pierre & Miquelon',
        code        : '+508',
        flagImagePos: '-1px -1378px'
    },
    {
        id          : 'd381eb44-e77a-4dbd-abbb-224d7158e96d',
        iso         : 'vc',
        name        : 'St. Vincent & Grenadines',
        code        : '+1',
        flagImagePos: '-1px -3588px'
    },
    {
        id          : '7015db62-072d-49a2-8320-7587ec8b952f',
        iso         : 'sd',
        name        : 'Sudan',
        code        : '+249',
        flagImagePos: '-1px -443px'
    },
    {
        id          : 'd7bbb285-aa4e-4a92-8613-8d2645c351ee',
        iso         : 'sr',
        name        : 'Suriname',
        code        : '+597',
        flagImagePos: '-1px -3656px'
    },
    {
        id          : '78978092-7be3-4ec8-b201-068089035cff',
        iso         : 'se',
        name        : 'Sweden',
        code        : '+46',
        flagImagePos: '-1px -494px'
    },
    {
        id          : '9f3fbec3-b58a-4b5a-9c4b-3997398c4148',
        iso         : 'ch',
        name        : 'Switzerland',
        code        : '+41',
        flagImagePos: '-1px -1718px'
    },
    {
        id          : '7ce0562c-fdc4-444c-bba3-02239c3c17da',
        iso         : 'sy',
        name        : 'Syria',
        code        : '+963',
        flagImagePos: '-1px -2449px'
    },
    {
        id          : '2d57a4a1-3f5a-41a2-a320-74a8f0db92e5',
        iso         : 'tw',
        name        : 'Taiwan',
        code        : '+886',
        flagImagePos: '-1px -647px'
    },
    {
        id          : 'e1f747c5-4e91-487b-8265-8f70b3430849',
        iso         : 'tj',
        name        : 'Tajikistan',
        code        : '+992',
        flagImagePos: '-1px -222px'
    },
    {
        id          : 'f07e257c-e049-4046-b031-f4348fb1734a',
        iso         : 'tz',
        name        : 'Tanzania',
        code        : '+255',
        flagImagePos: '-1px -3146px'
    },
    {
        id          : '684a0dde-5b5f-4072-98a4-46fc8de09556',
        iso         : 'th',
        name        : 'Thailand',
        code        : '+66',
        flagImagePos: '-1px -1242px'
    },
    {
        id          : '0376e29f-d9dd-4449-aa4e-d47353c16873',
        iso         : 'tl',
        name        : 'Timor-Leste',
        code        : '+670',
        flagImagePos: '-1px -3843px'
    },
    {
        id          : 'fd647814-fc64-4724-bba7-4cd4da26c11e',
        iso         : 'tg',
        name        : 'Togo',
        code        : '+228',
        flagImagePos: '-1px -783px'
    },
    {
        id          : 'ed271b14-39ee-4403-9be6-b54ac89b0ed3',
        iso         : 'tk',
        name        : 'Tokelau',
        code        : '+690',
        flagImagePos: '-1px -3792px'
    },
    {
        id          : 'e2b83ecb-5a79-4ca0-9860-4baeae0380bb',
        iso         : 'to',
        name        : 'Tonga',
        code        : '+676',
        flagImagePos: '-1px -1395px'
    },
    {
        id          : '33bca09c-cc33-4680-929b-191ccbbc959a',
        iso         : 'tt',
        name        : 'Trinidad & Tobago',
        code        : '+1',
        flagImagePos: '-1px -545px'
    },
    {
        id          : 'ab25c5da-7698-4b96-af34-5d20523915d9',
        iso         : 'tn',
        name        : 'Tunisia',
        code        : '+216',
        flagImagePos: '-1px -698px'
    },
    {
        id          : '784ac645-bc50-4b35-b5fb-effd72f99749',
        iso         : 'tr',
        name        : 'Turkey',
        code        : '+90',
        flagImagePos: '-1px -2126px'
    },
    {
        id          : '9a3b8bd3-bc73-4251-a068-a4842365e91a',
        iso         : 'tm',
        name        : 'Turkmenistan',
        code        : '+993',
        flagImagePos: '-1px -3486px'
    },
    {
        id          : '361bcad4-44d1-41fb-9bbf-39ea0fb87d49',
        iso         : 'tc',
        name        : 'Turks & Caicos Islands',
        code        : '+1',
        flagImagePos: '-1px -1701px'
    },
    {
        id          : '26fb1484-c756-4592-8523-99af9c870bb5',
        iso         : 'tv',
        name        : 'Tuvalu',
        code        : '+688',
        flagImagePos: '-1px -358px'
    },
    {
        id          : 'cdb8455e-4eda-48f7-b30a-63c20838a364',
        iso         : 'vi',
        name        : 'U.S. Virgin Islands',
        code        : '+1',
        flagImagePos: '-1px -2381px'
    },
    {
        id          : 'f47476cc-3da6-4377-83c9-33ab9f5293d1',
        iso         : 'ug',
        name        : 'Uganda',
        code        : '+256',
        flagImagePos: '-1px -1497px'
    },
    {
        id          : '5fcb791a-91be-416a-895d-0502fc509838',
        iso         : 'ua',
        name        : 'Ukraine',
        code        : '+380',
        flagImagePos: '-1px -2721px'
    },
    {
        id          : '7c8e1ced-0dd7-42b6-880b-19b3486d11e5',
        iso         : 'ae',
        name        : 'United Arab Emirates',
        code        : '+971',
        flagImagePos: '-1px -3061px'
    },
    {
        id          : '9f1362e7-e87c-4123-ade8-e5cfa6e99c09',
        iso         : 'gb',
        name        : 'United Kingdom',
        code        : '+44',
        flagImagePos: '-1px -86px'
    },
    {
        id          : 'f9033267-9df0-46e4-9f79-c8b022e5c835',
        iso         : 'us',
        name        : 'United States',
        code        : '+1',
        flagImagePos: '-1px -69px'
    },
    {
        id          : '2cab7122-ec9a-48ac-8415-392b4f67ae51',
        iso         : 'uy',
        name        : 'Uruguay',
        code        : '+598',
        flagImagePos: '-1px -3571px'
    },
    {
        id          : 'f442740c-94c3-4f2f-afb2-c7c279224b5f',
        iso         : 'uz',
        name        : 'Uzbekistan',
        code        : '+998',
        flagImagePos: '-1px -1293px'
    },
    {
        id          : 'e6774547-6ab1-41a2-8107-201f913937b2',
        iso         : 'vu',
        name        : 'Vanuatu',
        code        : '+678',
        flagImagePos: '-1px -1633px'
    },
    {
        id          : 'd600d6b0-e21f-4b6e-9036-0435a6ac2ea6',
        iso         : 'va',
        name        : 'Vatican City',
        code        : '+39',
        flagImagePos: '-1px -3197px'
    },
    {
        id          : 'b8e0072d-498b-4bb4-a5b6-354d4200f882',
        iso         : 've',
        name        : 'Venezuela',
        code        : '+58',
        flagImagePos: '-1px -1344px'
    },
    {
        id          : '15dc081a-4690-42e9-a40d-b3bcea3173fc',
        iso         : 'vn',
        name        : 'Vietnam',
        code        : '+84',
        flagImagePos: '-1px -1259px'
    },
    {
        id          : '4452a787-5f31-4eb7-b14c-ae3175564ae5',
        iso         : 'wf',
        name        : 'Wallis & Futuna',
        code        : '+681',
        flagImagePos: '-1px -324px'
    },
    {
        id          : '237c9f8d-3b6c-4b70-af72-8a58a7154144',
        iso         : 'ye',
        name        : 'Yemen',
        code        : '+967',
        flagImagePos: '-1px -2211px'
    },
    {
        id          : '02a76f62-3078-472a-bd42-edb759cf3079',
        iso         : 'zm',
        name        : 'Zambia',
        code        : '+260',
        flagImagePos: '-1px -2109px'
    },
    {
        id          : '10e8e117-6832-4d3f-9b05-f66832c2f5ec',
        iso         : 'zw',
        name        : 'Zimbabwe',
        code        : '+263',
        flagImagePos: '-1px -2789px'
    }
];