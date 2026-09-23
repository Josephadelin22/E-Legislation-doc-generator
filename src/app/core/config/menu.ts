/**
 * Configuration centralisée du menu de navigation.
 *
 * - route       : chemin Angular (routerLink)
 * - icon        : identifiant d'icône (classe CSS, SVG sprite, etc.)
 * - children    : sous-menus
 * - permissions : l'utilisateur doit posséder au moins une de ces permissions
 * - roles       : l'utilisateur doit posséder au moins un de ces rôles
 * - exact       : correspondance stricte de la route pour le lien actif
 *
 * Le lien actif est calculé à l'exécution via isMenuItemActive() / MenuService.
 */
export interface MenuItem {
  id: string;
  title: string;
  route?: string;
  icon?: string;
  permissions?: string[];
  roles?: string[];
  children?: MenuItem[];
  exact?: boolean;
}

/** Menu principal de l'application — personnalisez cette liste selon vos features. */
export const APP_MENU: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Tableau de bord',
    route: '/dashboard',
    icon: 'bi bi-house',
  },
  {
    id: 'administration',
    title: 'Administration',
    icon: 'bi bi-gear',
    roles: ['admin'],
    permissions: ['admin.access'],
    children: [
      {
        id: 'users-list',
        title: 'Utilisateurs',
        route: '/admin/users',
        icon: 'bi bi-people',
        permissions: ['users.read'],
      },
      {
        id: 'users-create',
        title: 'Créer un utilisateur',
        route: '/admin/users/create',
        icon: 'bi bi-person-plus',
        permissions: ['users.create'],
      },
    ],
  },
];

/** Normalise l'URL courante (sans query ni hash). */
export function normalizeMenuUrl(url: string): string {
  return url.split('?')[0].split('#')[0];
}

/** Indique si un item (avec route) correspond à l'URL courante. */
export function isMenuItemActive(item: MenuItem, currentUrl: string): boolean {
  if (!item.route) {
    return false;
  }

  const normalized = normalizeMenuUrl(currentUrl);
  const route = item.route.endsWith('/') && item.route.length > 1
    ? item.route.slice(0, -1)
    : item.route;

  if (item.exact) {
    return normalized === route || normalized === route + '/';
  }

  return normalized === route || normalized.startsWith(route + '/');
}

/** Indique si un item ou l'un de ses descendants est actif. */
export function isMenuBranchActive(item: MenuItem, currentUrl: string): boolean {
  if (isMenuItemActive(item, currentUrl)) {
    return true;
  }

  return item.children?.some(child => isMenuBranchActive(child, currentUrl)) ?? false;
}

/** Vérifie si l'utilisateur peut voir un item de menu. */
export function canAccessMenuItem(
  item: MenuItem,
  userRoles: string[] = [],
  userPermissions: string[] = []
): boolean {
  const hasRoleConstraint = !!item.roles?.length;
  const hasPermissionConstraint = !!item.permissions?.length;

  if (!hasRoleConstraint && !hasPermissionConstraint) {
    return true;
  }

  const roleOk = !hasRoleConstraint || item.roles!.some(role => userRoles.includes(role));
  const permOk = !hasPermissionConstraint || item.permissions!.some(p => userPermissions.includes(p));

  if (hasRoleConstraint && hasPermissionConstraint) {
    return roleOk && permOk;
  }

  return hasRoleConstraint ? roleOk : permOk;
}

/** Filtre récursivement le menu selon les rôles et permissions de l'utilisateur. */
export function filterMenuByAccess(
  items: MenuItem[],
  userRoles: string[] = [],
  userPermissions: string[] = []
): MenuItem[] {
  return items
    .filter(item => canAccessMenuItem(item, userRoles, userPermissions))
    .map(item => ({
      ...item,
      children: item.children
        ? filterMenuByAccess(item.children, userRoles, userPermissions)
        : undefined,
    }))
    .filter(item => !!item.route || (item.children?.length ?? 0) > 0);
}
