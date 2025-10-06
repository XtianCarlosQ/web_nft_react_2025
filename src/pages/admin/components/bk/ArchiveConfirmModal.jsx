import React from "react";
import { RenderIcon } from "./common/IconUtils";
import { ServiceCard } from "../../../components/sections/Services";

export default function ArchiveConfirmModal({
  open,
  onClose,
  onConfirm,
  service,
  activeCount = 0,
}) {
  if (!open || !service) return null;
  const isArchived = !!service.archived;
  const actionTitle = isArchived ? "Restaurar" : "Archivar";
  const [restoreOrder, setRestoreOrder] = React.useState(1);
  React.useEffect(() => {
    if (open) {
      const max = Math.max(1, Number(activeCount) + 1 || 1);
      setRestoreOrder(max);
    }
  }, [open, activeCount]);
  const toCardProps = (s) => ({
    icon: s.icon,
    title: s.title?.es || "Título del Servicio",
    description: s.description?.es || "Descripción del servicio",
    features: (s.features?.es || []).filter(Boolean).length
      ? s.features.es
      : ["Característica de ejemplo"],
    whatsapp: s.whatsapp || "51988496839",
  });

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{actionTitle} servicio</h3>
          <button
            className="text-gray-500"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <div className="p-6 space-y-4">
          {/* Vista previa completa del card */}
          <div className="max-w-md mx-auto">
            <ServiceCard service={toCardProps(service)} />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              {isArchived
                ? "Al restaurar, podrás elegir un nuevo orden y se reordenará el resto sin huecos."
                : "Al archivar, se eliminará su orden y los servicios posteriores se compactarán."}
            </p>
            {isArchived && (
              <div className="flex items-center gap-3">
                <label
                  className="text-sm text-gray-700"
                  htmlFor="restore-order"
                >
                  Nuevo orden
                </label>
                <input
                  id="restore-order"
                  type="number"
                  min={1}
                  max={Math.max(1, Number(activeCount) + 1 || 1)}
                  value={restoreOrder}
                  onChange={(e) =>
                    setRestoreOrder(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-24 border rounded px-2 py-1"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t">
          <button
            className="flex-1 px-4 py-2 rounded-lg border"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded-lg text-white ${
              isArchived
                ? "bg-green-600 hover:bg-green-700"
                : "bg-yellow-600 hover:bg-yellow-700"
            }`}
            onClick={() => onConfirm?.(isArchived ? restoreOrder : undefined)}
          >
            {actionTitle}
          </button>
        </div>
      </div>
    </div>
  );
}
