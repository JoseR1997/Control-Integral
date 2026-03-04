# ⚖️ Sistema Integral de Gestión para Bufete de Abogados (Proyecto universitario)

Este sistema permite a un bufete de abogados gestionar de forma eficiente sus procesos legales, clientes, servicios, comunicación y documentación. Incluye una interfaz web moderna y una API robusta basada en Node.js.

---

## 🧩 Módulos Frontend (React)

Cada módulo representa una funcionalidad clave del sistema:

- `Login.jsx` – Inicio de sesión y autenticación.
- `Home.jsx` – Dashboard con acceso rápido a módulos.
- `Clientes.jsx` – Gestión de información de los clientes.
- `Citas.jsx` – Administración de agendas y citas legales.
- `Facturas.jsx` – Gestión de facturación y cobros (úniocamente empotrando la pagina del facturador que ya tiene, no es un modulo de facturación realmente).
- `Gestión de servicios.jsx` – Control de servicios jurídicos ofrecidos.
- `Servicios.jsx` – Listado y edición de servicios legales.
- `Informes.jsx` – Generación de reportes y estadísticas.
- `Perfil.jsx` – Configuración del perfil del usuario.
- `Pdf.jsx` – Generación de documentos PDF.
- `AdminWhatsApp.jsx` – Gestión de mensajes vía WhatsApp.

---

## 🖥️ Estructura del Backend (Node.js)

```bash
/backend/
├── controllers/         # Lógica de negocio y controladores de rutas
├── middleware/          # Middlewares de autenticación, errores, etc.
├── models/              # Definición de esquemas y acceso a la base de datos
├── routes/              # Archivos de rutas para los diferentes módulos
├── tokens/              # Utilidades para JWT u otros sistemas de tokens
├── uploads/             # Almacenamiento de archivos (PDFs, imágenes, etc.)
├── database.js          # Conexión a la base de datos
├── whatsappClient.js    # Cliente de WhatsApp Business (Twilio o Baileys)
├── server.js            # Punto de entrada del servidor Express
└── oficina_virtual      # Archivo relacionado con funciones virtuales (desconocido)
