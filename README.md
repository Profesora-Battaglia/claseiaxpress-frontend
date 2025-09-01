<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ClaseIaXpress - Asistente Pedagógico

Una aplicación de asistente pedagógico inteligente para docentes, que ofrece herramientas para la planificación de clases, generación de rúbricas, ideas de proyectos y más.

## 🚀 Configuración y Despliegue

### Arquitectura
- **Frontend**: React + TypeScript + Vite (desplegado en Hostinger)
- **Backend**: Node.js + Express + Gemini API (desplegado en Vercel)

### Configuración Local

**Prerequisites:** Node.js 18+

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   Edita `.env` con las URLs correctas de tu backend en Hostinger.

3. **Instalar dependencias de Tailwind:**
   ```bash
   npm install @tailwindcss/typography
   ```

4. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

### Configuración de Producción

- **Frontend**: Las variables `VITE_BACKEND_URL` y `VITE_BACKEND_CHAT_URL` deben apuntar a tu backend en Hostinger
- **Backend**: Las API keys de Gemini deben estar configuradas en las variables de entorno de Vercel

## 🛠️ Tecnologías

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Gemini AI API
