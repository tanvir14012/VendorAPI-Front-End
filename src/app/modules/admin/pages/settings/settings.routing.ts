import { Route } from '@angular/router';
import { SettingsComponent } from 'app/modules/admin/pages/settings/settings.component';
import SettingsDataResolver from './settings.resolver';

export const settingsRoutes: Route[] = [
    {
        path     : '',
        resolve  : {
            accountSettings: SettingsDataResolver
        }, 
        component: SettingsComponent
    }
];
