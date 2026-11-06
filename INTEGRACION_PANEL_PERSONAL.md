# Integración del panel de personal

Los archivos `google-sheets/Code.gs` y `google-sheets/Admin.html` forman un panel interno que usa la misma hoja de Google del portal del paciente.

## Instalación en Apps Script

1. Abrir la hoja de Google que ya contiene las pestañas `Citas`, `Turnos` y `Encuestas`.
2. Elegir **Extensiones > Apps Script**.
3. Reemplazar el contenido de `Código.gs` por `google-sheets/Code.gs`.
4. Crear un archivo HTML nuevo con el nombre exacto `Admin` y pegar `google-sheets/Admin.html`.
5. En **Configuración del proyecto > Propiedades de secuencia de comandos**, crear la propiedad `SJD_ADMIN_PASSWORD` y definir una contraseña exclusiva para recepción. Esta contraseña no debe escribirse en los archivos públicos de GitHub.
6. Ejecutar una vez `setupSheet` para crear las tres columnas nuevas de `Citas`: comentario, fecha de actualización y personal responsable.
7. En **Implementar > Administrar implementaciones**, editar la aplicación web, crear una versión nueva e implementar.

El acceso interno queda en la misma URL de Apps Script agregando `?view=personal` al final. El personal inicia sesión con su nombre y la contraseña configurada en la propiedad del proyecto.

## Flujo de uso

- **Llamar:** cambia el turno a `Llamando` y permite indicar consultorio. La pantalla grande de turnos se actualiza sola.
- **Atendida:** cambia la cita a `Atendida` y el turno a `Atendido`.
- **Cancelar:** exige un motivo y cambia ambos estados a `Cancelada`.
- **Reprogramar:** exige nueva especialidad, profesional, fecha, hora y explicación. Actualiza la misma cita y crea un nuevo código de turno.

El panel administrativo se debe usar desde Apps Script, no desde GitHub Pages, porque allí se valida la contraseña y se protege la información de los pacientes.
