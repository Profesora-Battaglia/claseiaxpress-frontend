# Guía de Despliegue en Hostinger VPS

## Problemas Solucionados

1. **Rutas absolutas**: Cambiado de rutas absolutas (`/assets/...`) a rutas relativas (`./assets/...`)
2. **Configuración de Vite**: Actualizada para usar `base: './'` para mejor compatibilidad
3. **Router basename**: Configurado con fallback para evitar errores
4. **Archivo .htaccess**: Mejorado con compresión y cache para mejor rendimiento

## Pasos para Desplegar

### 1. Construir la aplicación
```bash
cd claseiaxpress---asistente-pedagógico
npm run build:prod
```

### 2. Subir archivos al VPS
Sube todo el contenido de la carpeta `dist/` a tu directorio web en Hostinger:
- `index.html`
- `favicon.svg`
- Carpeta `assets/` completa
- `.htaccess` (desde la raíz del proyecto, no desde dist)

### 3. Estructura en el servidor
```
tu-dominio.com/
├── index.html
├── favicon.svg
├── .htaccess
└── assets/
    ├── index-CmFfB-qL.css
    ├── index-m_cwdtf7.js
    ├── html2canvas.esm-B0tyYwQk.js
    ├── index.es-mn53vtdd.js
    └── purify.es-CQJ0hv7W.js
```

### 4. Verificaciones Post-Despliegue

1. **Verifica que los estilos cargan**: El menú lateral debería aparecer con fondo azul
2. **Verifica la navegación**: Las rutas del SPA deberían funcionar correctamente
3. **Verifica la API**: Asegúrate de que las llamadas a Vercel funcionen

## Posibles Problemas Adicionales

### Si aún no aparecen los estilos:
1. Verifica que el archivo CSS se esté cargando en las herramientas de desarrollador
2. Revisa la consola del navegador para errores 404
3. Asegúrate de que el archivo `.htaccess` esté en la raíz del dominio

### Si el menú lateral no aparece:
1. Verifica que JavaScript se esté ejecutando (consola del navegador)
2. Revisa si hay errores de CORS o CSP
3. Verifica que las fuentes de Google se estén cargando

### Si las rutas no funcionan:
1. Verifica que el archivo `.htaccess` esté funcionando
2. Asegúrate de que mod_rewrite esté habilitado en Apache
3. Revisa los logs del servidor para errores 500

## Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build:prod

# Preview del build
npm run preview
```

## Variables de Entorno

- `VITE_BASE_URL`: Configurado como `/` para la raíz del dominio
- `VITE_API_URL`: URL de tu backend en Vercel

## Contacto con Soporte

Si persisten los problemas, contacta al soporte de Hostinger con:
1. Los logs de error del servidor
2. Capturas de pantalla de la consola del navegador
3. La URL donde está desplegada la aplicación