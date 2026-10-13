# Registro de citas en Google Sheets

Esta conexión es para una demostración. Antes de usarla con pacientes reales, el centro debe revisar la protección de datos y el acceso a la hoja.

1. Crea una hoja nueva en Google Sheets con la cuenta del centro.
2. En la hoja, abre **Extensiones > Apps Script**.
3. Borra el contenido inicial y pega el contenido de `google-sheets/Code.gs`.
4. Guarda el proyecto y ejecuta `setupSheet` una vez. Google pedirá autorización para crear la pestaña **Citas**.
5. Abre **Implementar > Nueva implementación > Aplicación web**.
6. Selecciona **Ejecutar como: Yo** y permite el acceso que corresponda a tu sitio. Copia la URL que termina en `/exec`.
7. Abre `js/google-sheets-config.js` y pega esa URL entre las comillas de `SJDD_GOOGLE_SHEETS_URL`.

La hoja recibirá: fecha de registro, código de solicitud, nombre, DNI, especialidad, profesional, fecha, hora y estado. No se envía el motivo de consulta para reducir los datos sensibles almacenados.

## Actualización: cancelaciones y reprogramaciones

Para activar la actualización del estado, copia nuevamente el contenido actual de `google-sheets/Code.gs` en Apps Script, guárdalo y abre **Implementar > Administrar implementaciones**. Edita la aplicación web, selecciona una nueva versión y vuelve a implementar. Conserva la misma URL terminada en `/exec`.

Las citas nuevas reciben un código aleatorio único. Ese código permite cancelar o reprogramar solamente la cita creada desde ese portal. Las citas registradas antes de esta actualización deben marcarse manualmente en la hoja.
