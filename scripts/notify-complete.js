// Task completion notification
import { notifyDevOnComplete } from "./src/config/devNotify.js";

// Send notification that the task is complete
(async () => {
  const success = await notifyDevOnComplete(
    "✅ GitHub Copilot: Tarea completada! \n\n- Errores de iconos corregidos ✅\n- Error boundary agregado ✅\n- Validaciones mejoradas ✅\n- Notificaciones WhatsApp implementadas ✅\n\nLa web debería cargar correctamente ahora."
  );
  console.log(
    "WhatsApp notification sent:",
    success ? "✅ Success" : "❌ Failed (check env vars)"
  );
})();
