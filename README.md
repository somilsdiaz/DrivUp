# DrivUp

![DrivUp Logo](https://[URL_PLACEHOLDER_LOGO_PROYECTO])

> Conectando pasajeros y conductores de manera inteligente

## 🚀 Enlaces Rápidos

[![Frontend](https://img.shields.io/badge/Frontend-DrivUp-blue?style=for-the-badge&logo=react)](https://drivup.onrender.com)
[![Backend](https://img.shields.io/badge/Backend-API-green?style=for-the-badge&logo=node.js)](https://drivup-backend.onrender.com)
[![Repo Backend](https://img.shields.io/badge/Repo-Backend-yellow?style=for-the-badge&logo=github)](https://github.com/somilsdiaz/DrivUp-backend)

## 📋 Índice

- [Descripción General](#descripción-general)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [Contribuir](#contribuir)
- [Licencia](#licencia)
- [Equipo de Desarrollo](#equipo-de-desarrollo)
- [Contacto](#contacto)

## 📝 Descripción General

DrivUp es una aplicación web moderna que facilita la conexión entre pasajeros y conductores para compartir viajes. La plataforma ofrece interfaces dedicadas para ambos roles, un sistema de mensajería en tiempo real, y gestión de rutas programadas, todo enfocado en proporcionar una experiencia de usuario intuitiva y segura.

### ✨ Características Principales

- **Roles diferenciados**: Interfaces específicas para conductores y pasajeros
- **Autenticación y autorización**: Sistema seguro de registro e inicio de sesión
- **Chat en tiempo real**: Comunicación directa entre usuarios
- **Gestión de rutas**: Programación y seguimiento de viajes
- **Diseño responsive**: Experiencia optimizada en cualquier dispositivo

![Captura de pantalla de DrivUp](https://[PLACEHOLDER_PARA_SCREENSHOT_O_GIF])

## 🛠️ Tecnologías

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0.0-38B2AC?style=flat-square&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF?style=flat-square&logo=vite)

### Stack Completo:

- **Frontend Core**:
  - React 18.3.1
  - TypeScript 5.6.2
  - React Router 7.1.3
  - React Hook Form 7.54.2

- **Estilizado**:
  - Tailwind CSS 4.0.0
  - Framer Motion 12.0.6
  - Lucide React (Iconos)
  - React Icons

- **Comunicación**:
  - Axios 1.7.9
  - Socket.io-client 4.8.1

- **Desarrollo**:
  - Vite 6.0.5
  - ESLint 9.17.0

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
```

4. **Inicia el servidor de desarrollo**:

```bash
npm run dev
```

## 💻 Uso

### Pasajeros

Los pasajeros pueden:

- Registrarse e iniciar sesión
- Buscar conductores disponibles
- Enviar solicitudes de viaje
- Comunicarse mediante el chat con conductores
- Ver y gestionar su historial de viajes
- Actualizar su perfil

### Conductores

Los conductores pueden:

- Registrarse como conductores (necesario registro previo como pasajero)
- Gestionar solicitudes de viaje
- Crear y gestionar rutas programadas
- Comunicarse con los pasajeros
- Ver estadísticas de sus viajes

## 📁 Estructura del Proyecto

```
DrivUp/
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── RutasProgramadas/
│   │   ├── vistaPasajeros/
│   │   ├── vistaConductores/
│   │   └── ...
│   ├── layouts/            # Layouts de la aplicación
│   ├── pages/              # Páginas principales
│   │   ├── vistaPasajeros/
│   │   ├── vistaConductores/
│   │   └── ...
│   ├── routes/             # Configuración de rutas
│   ├── services/           # Servicios de API
│   ├── types/              # Tipos de TypeScript
│   └── utils/              # Utilidades y helpers
├── public/                 # Archivos estáticos
└── ...
```

## ⭐ Funcionalidades

### Sistema de Autenticación

DrivUp implementa un sistema de autenticación robusto con roles diferenciados:
- Rutas públicas: accesibles sin autenticación
- Rutas protegidas: requieren autenticación
- Rutas basadas en roles: accesibles según el rol del usuario (conductor/pasajero)

### Comunicación en Tiempo Real

La aplicación utiliza Socket.io para proporcionar:
- Chat en tiempo real entre pasajeros y conductores
- Notificaciones instantáneas de solicitudes de viaje
- Actualizaciones de estado de viajes

### Gestión de Perfiles

Los usuarios pueden:
- Actualizar su información personal
- Gestionar imágenes de perfil
- Configurar preferencias

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Realiza tus cambios y haz commit (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request


## 📄 Licencia

Este proyecto está licenciado bajo [MIT]()

## 👨‍💻 Equipo de Desarrollo

El proyecto DrivUp ha sido desarrollado por un equipo comprometido de profesionales:

| Desarrollador | Rol |
|---------------|-----|
| **Somil Sandoval Diaz** | Desarrollador Full-stack |
| **Julian Coll** | Desarrollador Full-stack |
| **Julian Alamario** | Desarrollador Full-stack |

---

Desarrollado con ❤️ por el equipo de DrivUp
