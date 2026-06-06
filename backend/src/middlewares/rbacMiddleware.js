/**
 * Middleware RBAC — Control de Acceso basado en Roles
 * Soporta tanto role único (string) como array de roles en el JWT
 */
export const requireRole = (requiredRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    const userRoles = req.user?.roles;

    // Soportar single role (nuevo) o array (legacy)
    const roles = userRoles || (userRole ? [userRole] : []);

    if (!roles.length || !roles.some(role => requiredRoles.includes(role))) {
      return res.status(403).json({
        error: 'Acceso denegado: No posee los privilegios suficientes.'
      });
    }

    next();
  };
};
