import React, { useMemo, useState } from "react";
import { TeamMemberCard } from "../../../../components/sections/Team";

export default function TeamArchiveConfirmModal({
  open,
  member,
  activeCount = 0,
  onClose,
  onConfirm,
}) {
  const [order, setOrder] = useState(1);
  const preview = useMemo(() => {
    if (!member) return null;
    const m = {
      name: member.name,
      position: member.role || member.position,
      image: member.photo || member.image,
      skills: Array.isArray(member.skills) ? member.skills : [],
    };
    return <TeamMemberCard member={m} />;
  }, [member]);

  if (!open || !member) return null;

  const willArchive = !member.archived;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {willArchive ? "Archivar miembro" : "Restaurar miembro"}
          </h3>
          <button className="px-3 py-1 border rounded" onClick={onClose}>
            Cerrar
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 gap-4">
          <div className="max-w-sm mx-auto">{preview}</div>
          {willArchive ? (
            <p className="text-sm text-gray-600">
              Este miembro dejará de mostrarse en la página pública. Podrás
              restaurarlo cuando quieras.
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Elige el orden donde se restaurará. Máximo sugerido: {activeCount + 1}.
              </p>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={order}
                min={1}
                max={Math.max(1, activeCount + 1)}
                onChange={(e) => setOrder(Number(e.target.value) || 1)}
              />
            </div>
          )}
          <div className="pt-2 flex gap-2">
            <button
              className={`${
                willArchive ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
              } text-white px-4 py-2 rounded`}
              onClick={() => onConfirm?.(willArchive ? undefined : order)}
            >
              {willArchive ? "Archivar" : "Restaurar"}
            </button>
            <button className="px-4 py-2 border rounded" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
