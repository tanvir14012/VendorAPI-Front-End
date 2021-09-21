/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        subtitle: 'Track, analyze, and display key performance indicators, metrics, and data',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'dashboards.project',
                title: 'Project',
                type : 'basic',
                icon : 'heroicons_outline:clipboard-check',
                link : '/dashboards/project'
            },
            {
                id   : 'dashboards.analytics',
                title: 'Analytics',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/dashboards/analytics'
            },
            {
                id   : 'dashboards.finance',
                title: 'Finance',
                type : 'basic',
                icon : 'heroicons_outline:cash',
                link : '/dashboards/finance'
            }
        ]
    },
    {
        id  : 'divider-1',
        type: 'divider'
    },
    {
        id: 'activity',
        title: 'Activity',
        subtitle: 'Perform day to day activities',
        type: 'group',
        icon: '',
        children: [
            {
                id   : 'activity.approvals',
                title: 'Account approvals',
                type : 'basic',
                icon : 'supervisor_account',
                link : '/approve-accounts'
            },
            {
                id   : 'activity.tasks',
                title: 'Tasks',
                type : 'basic',
                icon : 'heroicons_outline:check-circle',
                link : '/tasks'
            }
        ]
    },

    {
        id  : 'divider-1',
        type: 'divider'
    },

    {   id: 'manage',
        title   : 'Manage',
        subtitle: 'Manage your account',
        type    : 'group',
        icon    : 'heroicons_outline:cog',
        children: [
            {
                id   : 'manage.example',
                title: 'Example',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/example'
            },
            {
                id      : 'manage.help-center',
                title   : 'Help Center',
                type    : 'collapsable',
                icon    : 'heroicons_outline:support',
                link    : '/help-center',
                children: [
                    {
                        id        : 'manage.help-center.home',
                        title     : 'Home',
                        type      : 'basic',
                        link      : '/help-center',
                        exactMatch: true
                    },
                    {
                        id   : 'manage.help-center.faqs',
                        title: 'FAQs',
                        type : 'basic',
                        link : '/help-center/faqs'
                    },
                    {
                        id   : 'manage.help-center.guides',
                        title: 'Guides',
                        type : 'basic',
                        link : '/help-center/guides'
                    },
                    {
                        id   : 'manage.help-center.support',
                        title: 'Support',
                        type : 'basic',
                        link : '/help-center/support'
                    }
                ]
            },
            {
                id   : 'manage.settings',
                title: 'Settings',
                type : 'basic',
                icon : 'heroicons_outline:cog',
                link : '/settings'
            }
        ]
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
