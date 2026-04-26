import { Routes } from '@angular/router';
import { Index } from './module/visitor/index';
import { About } from './module/visitor/about/about';
import { Events } from './module/visitor/events/events';
import { Downloads } from './module/visitor/downloads/downloads';
import { Explore } from './module/visitor/explore/explore';
import { Login } from './module/auth/login/login';
import { ForgetPass } from './module/auth/forget-pass/forget-pass';

export const routes: Routes = 
[
    {path : '',component :Index},
    {path : 'about',component : About},
    {path : 'events',component:Events},
    {path: 'download',component:Downloads},
    {path : 'explore',component:Explore},
    {path: 'login',component:Login},
    {path : 'forget-pass',component:ForgetPass}
];
