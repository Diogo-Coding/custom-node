<!-- README.md -->

> [!CAUTION]
> ***WORK IN PROGRESS PROJECT | No es funcional todavia. No recomiendo usar este proyecto en producción.***

> [!IMPORTANT]
> ***¡Este proyecto sirve como plantilla para crear un servidor API, pero no es un proyecto completo ni funcional de base. Debes configurarlo y adaptarlo segun tus necesidades!***

# Plantilla Servidor API Node

Plantilla de proyecto de una api o servidor hecho en node.js, con modulos de autenticación y autorización, con conexión a bases de datos, y API REST modular.

> **En el archivo configuracion del proyecto se puede agregar o quitar modulos.**

## Contenido
- Servicio de autenticación de usuario (JWT Tokens)
- Modulo de permisos de usuario
- Middlewares de autenticacion y autorización
- Servicio de encriptado con Bcrypt
- Servicio de correos
- Servicio de notificaciones
- API REST
- Certificado HTTPS
- Modulo de Control
- Conexión MySQL con Pool Connection
- Base de datos de prueba

## Configuración

- Instalar dependencias con `npm install`
- Crear un archivo `.env` en la raíz del proyecto copiando el archivo `.env.example` y agregando las credenciales de acceso a la base de datos.
- Configurar los valores de configuración en el archivo `auth/config.js`.