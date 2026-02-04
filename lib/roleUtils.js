export function isAdmin(role) {
  return role === "admin" || role === "superadmin" || role === "org:admin";
}

export function isEditor(role) {
  return role === "editor";
}

export function isUser(role) {
  return role === "user";
}

/** Panel / edit yetkisi: admin veya editor */
export function canAccessPanel(role) {
  return isAdmin(role) || isEditor(role);
}
