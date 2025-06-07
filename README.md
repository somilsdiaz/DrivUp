# DrivUp

<div align="center">
  <img src="https://github.com/user-attachments/assets/1aae18a1-12c5-4b98-934d-94517974cbb5" alt="DrivUp Logo" width="400px" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
  
  ### *Conectando pasajeros y conductores de manera inteligente*
  
  [![Version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)](https://github.com/somilsdiaz/DrivUp)
  [![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
</div>

## 🚀 Enlaces Rápidos

[![Frontend](https://img.shields.io/badge/Frontend-DrivUp-blue?style=for-the-badge&logo=react)](https://drivup.onrender.com)
[![Backend](https://img.shields.io/badge/Backend-API-green?style=for-the-badge&logo=node.js)](https://drivup-backend.onrender.com)
[![Repo Backend](https://img.shields.io/badge/Repo-Backend-yellow?style=for-the-badge&logo=github)](https://github.com/somilsdiaz/DrivUp-backend)

## 📋 Índice

- [Descripción General](#descripción-general)
- [Tecnologías](#tecnologías)
- [Demostración](#demostración)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [Comunicación en Tiempo Real](#comunicación-en-tiempo-real)
- [Nuevas Implementaciones](#nuevas-implementaciones)
- [Contribuir](#contribuir)
- [Licencia](#licencia)
- [Equipo de Desarrollo](#equipo-de-desarrollo)
- [Contacto](#contacto)

## 📝 Descripción General

DrivUp es una aplicación web moderna que facilita la conexión entre pasajeros y conductores para compartir viajes. La plataforma ofrece interfaces dedicadas para ambos roles, un sistema de mensajería en tiempo real, visualización de rutas mediante mapas interactivos y gestión de viajes programados, todo enfocado en proporcionar una experiencia de usuario intuitiva y segura.

### ✨ Características Principales

- **Roles diferenciados**: Interfaces específicas para conductores y pasajeros
- **Autenticación y autorización**: Sistema seguro de registro e inicio de sesión
- **Chat en tiempo real**: Comunicación directa entre usuarios
- **Visualización geoespacial**: Mapas interactivos para seguimiento de viajes
- **Gestión de rutas**: Programación y seguimiento de viajes
- **Comunicación en tiempo real**: Notificaciones instantáneas y actualizaciones de estado mediante WebSockets
- **Diseño responsive**: Experiencia optimizada en cualquier dispositivo

## 🖼️ Demostración

<div align="center">
  <img src="https://github.com/user-attachments/assets/5b122011-8246-4f36-b621-5243a759b0e4" alt="Demostración de DrivUp" width="80%" style="border-radius: 8px; margin: 20px 0; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
  
  <p><em>Interfaz principal de la aplicación DrivUp</em></p>
</div>

### 🚘 Dashboard Conductor

<div align="center">
  <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 15px; margin-bottom: 30px;">
    <img src="https://github.com/user-attachments/assets/8f88a5b4-1b73-44a1-bc2f-72c47c360c60" alt="Dashboard del Conductor" width="80%" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    <p><em>Panel principal del conductor</em></p>
  </div>
  
  <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
    <div style="flex: 1; min-width: 45%;">
      <img src="https://github.com/user-attachments/assets/113e29b1-3033-48c6-a3a8-cf4525ddb0dd" alt="Detalles de Viaje" width="80%" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <p><em>Vista detallada de viaje</em></p>
    </div>
    <div style="flex: 1; min-width: 45%;">
      <img src="https://github.com/user-attachments/assets/969a9565-4984-41f9-9d07-abf762b04bb2" alt="Lista de Viajes" width="80%" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <p><em>Listado de viajes disponibles</em></p>
    </div>
  </div>
</div>

### 👤 Dashboard Pasajero

<div align="center">
  <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 15px; margin-bottom: 30px;">
    <img src="https://github.com/user-attachments/assets/27349655-efb7-469d-9b03-e4d4ec5d2316" alt="Dashboard del Pasajero" width="80%" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    <p><em>Panel principal del pasajero</em></p>
  </div>
  
  <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
    <div style="flex: 1; min-width: 45%;">
      <img src="https://github.com/user-attachments/assets/e46f0ab0-a691-443d-b3b4-9605ab573011" alt="Solicitar Viaje" width="80%" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <p><em>Interfaz para solicitar un viaje</em></p>
    </div>
    <div style="flex: 1; min-width: 45%;">
      <img src="https://github.com/user-attachments/assets/ba992017-9173-4609-aa5b-c3bcf02cfc34" alt="Contactar Conductor" width="80%" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <p><em>Interfaz para contactar al conductor</em></p>
    </div>
  </div>
</div>

## 🛠️ Tecnologías

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0.0-38B2AC?style=flat-square&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF?style=flat-square&logo=vite)
![Socket.io](https://img.shields.io/badge/Socket.io--010101?style=flat-square&logo=socket.io)
![React Router](https://img.shields.io/badge/React_Router-7.1.3-CA4245?style=flat-square&logo=react-router)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=flat-square&logo=leaflet)

### Stack Completo:

- **Frontend Core**:
  - React 18.2.0
  - TypeScript 5.6.2
  - React Router 7.1.3
  - React Hook Form 7.54.2

- **Estilizado**:
  - Tailwind CSS 4.0.0
  - Framer Motion 12.0.6
  - Lucide React (Iconos)
  - React Icons 5.4.0

- **Comunicación**:
  - Axios 1.7.9
  - Socket.io-client 4.8.1

- **Mapas y Geolocalización**:
  - Leaflet 1.9.4
  - React Leaflet 4.2.1

- **Desarrollo**:
  - Vite 6.0.5
  - ESLint 9.17.0
  - TypeScript 5.6.2

### Requisitos Previos

- Node.js >= 18.x
- npm, yarn o pnpm

## 🚀 Instalación

Sigue estos pasos para configurar el proyecto en tu entorno local:

1. **Clona el repositorio**:

```bash
git clone https://github.com/somilsdiaz/DrivUp
cd DrivUp
```

2. **Instala las dependencias**:

```bash
npm install
# O si prefieres usar yarn
yarn install
```

3. **Configura las variables de entorno**:

```bash
cp .env
```

4. **Inicia el servidor de desarrollo**:

```bash
npm run dev
# O con yarn
yarn dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

## 💻 Uso

### Pasajeros

Los pasajeros pueden:

- Registrarse e iniciar sesión
- Buscar conductores disponibles
- Solicitar viajes especificando origen y destino en el mapa interactivo
- Visualizar la ruta y detalles del viaje
- Comunicarse mediante el chat con conductores
- Ver y gestionar su historial de viajes
- Actualizar su perfil
- Recibir notificaciones en tiempo real sobre el estado de sus solicitudes y viajes

### Conductores

Los conductores pueden:

- Registrarse como conductores (necesario registro previo como pasajero)
- Gestionar solicitudes de viaje
- Visualizar rutas en el mapa interactivo
- Ver detalles completos de los viajes asignados
- Crear y gestionar rutas programadas
- Comunicarse con los pasajeros
- Ver estadísticas de sus viajes
- Recibir notificaciones en tiempo real de nuevas solicitudes de viaje

## 📁 Estructura del Proyecto

```
DrivUp/
├── src/
│   ├── api/              # Configuración de API y endpoints
│   ├── assets/           # Recursos estáticos (imágenes, iconos)
│   ├── components/       # Componentes reutilizables
│   │   ├── listaViajes/      # Componentes para listar viajes
│   │   ├── solicitarViaje/   # Componentes para solicitar viaje
│   │   └── ...
│   ├── core/             # Funcionalidades core de la aplicación
│   ├── hooks/            # Hooks personalizados
│   ├── layouts/          # Layouts de la aplicación
│   ├── pages/            # Páginas principales
│   ├── routes/           # Configuración de rutas
│   ├── services/         # Servicios de API
│   ├── types/            # Tipos de TypeScript
│   └── utils/            # Utilidades y helpers
│       ├── socket.ts         # Configuración de WebSockets
│       ├── auth.ts           # Utilidades de autenticación
│       └── ...
├── public/               # Archivos estáticos
├── index.html            # Punto de entrada HTML
├── vite.config.ts        # Configuración de Vite
└── package.json          # Dependencias y scripts
```

## ⭐ Funcionalidades

### Sistema de Autenticación

DrivUp implementa un sistema de autenticación robusto con roles diferenciados:
- Rutas públicas: accesibles sin autenticación
- Rutas protegidas: requieren autenticación
- Rutas basadas en roles: accesibles según el rol del usuario (conductor/pasajero)

## 🔄 Comunicación en Tiempo Real

La aplicación implementa un avanzado sistema de comunicación en tiempo real basado en Socket.io que proporciona:

### Arquitectura de WebSockets

- **Conexión centralizada**: Implementación singleton en `socket.ts` que facilita la comunicación bidireccional con el servidor
- **Reconexión automática**: Configuración robusta para mantener la conexión activa incluso en condiciones de red inestables
- **Salas de usuario**: Sistema de "salas" para comunicación directa con usuarios específicos

### Notificaciones y Eventos Principales

- **Asignación de conductores**: Notificación instantánea cuando un conductor acepta un viaje (`conductor_asignado`)
- **Cancelaciones de viaje**: Alertas en tiempo real cuando un viaje es cancelado (`viaje_cancelado`)
- **Seguimiento del conductor**: Actualizaciones en tiempo real de la ubicación del conductor durante el viaje
- **Cambios de estado**: Notificaciones inmediatas sobre cualquier cambio en el estado del viaje

### Sistema de Salas

- **Salas privadas por usuario**: Cada usuario tiene su propia sala para recibir notificaciones personalizadas
- **Salas de viaje**: Comunicación específica entre pasajeros y conductores durante un viaje activo

### Ventajas del Sistema

- **Experiencia fluida**: Eliminación de la necesidad de refrescar la página para obtener actualizaciones
- **Menor carga en el servidor**: Reducción de consultas continuas al servidor mediante polling
- **Comunicación instantánea**: Notificaciones y actualizaciones de estado en cuestión de milisegundos

### Visualización de Mapas y Rutas

Utilizando Leaflet y React Leaflet, DrivUp ofrece:
- Mapas interactivos para selección de ubicaciones
- Visualización de rutas entre origen y destino
- Marcadores personalizados para conductores, pasajeros y destinos
- Vista detallada del recorrido para todos los usuarios
- Actualización en tiempo real de la posición del conductor en el mapa

### Gestión de Perfiles

Los usuarios pueden:
- Actualizar su información personal
- Gestionar imágenes de perfil
- Configurar preferencias de viaje

### Diseño Responsive
Mejoramos la experiencia en dispositivos móviles:
- Componentes que se ajustan automáticamente al tamaño de pantalla
- Interacciones optimizadas para dispositivos táctiles

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Realiza tus cambios y haz commit (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

### Guías de Contribución

- Sigue los estándares de código del proyecto
- Asegúrate de que tu código pase las pruebas
- Documenta adecuadamente los cambios realizados
- Actualiza el README si es necesario

## 📄 Licencia

Este proyecto está licenciado bajo [MIT](LICENSE)

## 👨‍💻 Equipo de Desarrollo

El proyecto DrivUp ha sido desarrollado por un equipo comprometido de profesionales:

| Desarrollador | Rol | Contacto |
|---------------|-----|----------|
| **Somil Sandoval Diaz** | Desarrollador Full-stack | [GitHub](https://github.com/somilsdiaz) |
| **Julian Coll** | Desarrollador Full-stack | [GitHub](https://github.com/juliancoll) |
| **Julian Alamario** | Desarrollador Full-stack | [GitHub](https://github.com/julianalamario) |

---

<div align="center">
  <p>Desarrollado con ❤️ por el equipo de DrivUp</p>
</div>
