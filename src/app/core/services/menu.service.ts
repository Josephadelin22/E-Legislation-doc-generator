import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from '@/core/services/core.service';
import {
  APP_MENU,
  MenuItem,
  filterMenuByAccess,
  isMenuBranchActive,
  isMenuItemActive,
} from '@/core/config/menu';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private router = inject(Router);
  private coreService = inject(CoreService);

  /** Menu filtré selon les rôles et permissions de l'utilisateur connecté. */
  readonly visibleMenu = computed(() => {
    const user = this.coreService.currentUser();
    return filterMenuByAccess(
      APP_MENU,
      user?.roles ?? [],
      user?.permissions ?? []
    );
  });

  /** Indique si l'item correspond à la route courante. */
  isActive(item: MenuItem): boolean {
    return isMenuItemActive(item, this.router.url);
  }

  /** Indique si l'item ou un de ses sous-menus est actif. */
  isBranchActive(item: MenuItem): boolean {
    return isMenuBranchActive(item, this.router.url);
  }
}
