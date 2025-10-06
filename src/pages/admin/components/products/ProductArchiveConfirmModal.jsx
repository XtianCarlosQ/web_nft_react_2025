import React, { useState, useMemo } from "react";

export default function ProductArchiveConfirmModal({ open, product, activeCount = 0, onClose, onConfirm }) {
  const isOpen = !!open;
  const willArchive = !!product && !product.archived;
  const [restoreAt, setRestoreAt] = useState(() => (activeCount || 0) + 1);
  const clamped = useMemo(() => Math.max(1, Math.min(restoreAt || 1, (activeCount || 0) + 1)), [restoreAt, activeCount]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{willArchive ? "Archivar producto" : "Restaurar producto"}</h3>
        </div>
        <div className="p-6 space-y-4">
          {willArchive ? (
            <p className="text-gray-700">¿Seguro que deseas archivar "{product.name?.es || product.name}"? Podrás restaurarlo después.</p>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-700">Indica la posición donde deseas restaurarlo (1..{(activeCount || 0) + 1}).</p>
              <input type="number" min={1} max={(activeCount || 0) + 1} value={clamped} onChange={(e) => setRestoreAt(Number(e.target.value))} className="w-24 border rounded px-3 py-2" />
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 border rounded">Cancelar</button>
          <button onClick={() => onConfirm?.(clamped)} className={`px-4 py-2 rounded text-white ${willArchive ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"}`}>
            {willArchive ? "Archivar" : "Restaurar"}
          </button>
        </div>
      </div>
    </div>
  );
}
