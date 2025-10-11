/** Team model */
export function normalizeTeamMember(m) {
  const roleRaw = m?.role ?? m?.position ?? "";
  const role =
    typeof roleRaw === "object" ? roleRaw.es || roleRaw.en || "" : roleRaw;
  const nameRaw = m?.name ?? "";
  const name =
    typeof nameRaw === "object" ? nameRaw.es || nameRaw.en || "" : nameRaw;
  const photo = m?.photo ?? m?.image ?? "";
  const skills = Array.isArray(m?.skills)
    ? m.skills.map((s) => String(s))
    : typeof m?.skills === "string"
    ? m.skills
        .split(/\r?\n|,/) // allow comma or newline separated
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  return {
    id: m?.id || `team-${Math.random().toString(36).slice(2, 8)}`,
    name: String(name || ""),
    role: String(role || ""),
    bio:
      typeof m?.bio === "object"
        ? String(m.bio.es || m.bio.en || "")
        : String(m?.bio || ""),
    photo: String(photo || ""),
    skills,
    order: Number(m?.order) > 0 ? Number(m.order) : 9999,
    archived: !!m?.archived,
  };
}
export function compareByOrder(a, b) {
  if (!!a.archived && !b.archived) return 1;
  if (!a.archived && !!b.archived) return -1;
  return (a.order ?? 9999) - (b.order ?? 9999);
}
export function normalizeTeamOrder(list) {
  const arr = Array.isArray(list) ? [...list] : [];
  const actives = arr
    .filter((x) => !x.archived)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Create updated active items WITHOUT MUTATION
  const updatedActives = actives.map((it, i) => ({
    ...it,
    order: i + 1,
  }));

  const map = new Map(updatedActives.map((x) => [x.id, x]));
  return arr.map((x) => (x.archived ? x : map.get(x.id) || x));
}
