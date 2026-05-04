import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-services/auth.service';
import { filter, take, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

canActivate(route: any, state: any) {
  console.log('🛡️ Guard checking for:', state.url);
  
  const user = this.authService.getStoredUser();
  console.log('👤 Stored user:', user);

  return this.authService.authReady$.pipe(
    filter(ready => {
      console.log('⏳ Auth ready:', ready);
      return ready;
    }),
    take(1),
    map(() => {
      const currentUser = this.authService.getStoredUser();
      console.log('🔍 Guard decision - User:', currentUser);

      if (!currentUser) {
        console.log('🚫 No user → login');
        this.router.navigate(['/login']);
        return false;
      }

      const requiredRole = route.data?.['role'];
      if (!requiredRole) {
        console.log('✅ No role required');
        return true;
      }

      if (currentUser.role.toLowerCase() === requiredRole.toLowerCase()) {
        console.log('✅ Role match');
        return true;
      }

      console.log('❌ Wrong role');
      this.router.navigate(['/unauthorized']);
      return false;
    })
  );
}
}