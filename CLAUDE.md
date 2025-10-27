# Momentum AI RE - Generador de Videos con IA

Aplicación web para generar videos animados a partir de imágenes utilizando Google Gemini Veo AI.

## 🏗️ Arquitectura

### Autenticación
- **Supabase Auth** (momentum-auth) - Autenticación unificada con credenciales de Momentum Brain
- Solo empleados de Momentum Brain pueden acceder
- Login con email/password
- Mismo sistema de auth que momentumbrain.com

### Storage
- **Firebase Storage** - Almacenamiento de imágenes y videos
- Estructura: `users/{userId}/images/` y `users/{userId}/videos/`
- Reglas configuradas para permitir lectura pública y escritura autenticada

### Base de Datos
- **Firebase Firestore** - Almacenamiento de proyectos de video
- Colección: `videoProjects`
- Campos: userId, userEmail, userName, imageUrl, videoUrl, prompt, tags, description, configuración de cámara, timestamps

### IA
- **Google Gemini Veo 3.1** - Generación de videos
- API de generación de video desde imagen
- Configuración de movimiento de cámara, velocidad, duración, intensidad

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (CDN)
- **Autenticación**: Supabase (@supabase/ssr, @supabase/supabase-js)
- **Storage/Database**: Firebase (firebase, firestore, storage)
- **IA**: Google Gemini AI SDK
- **Deployment**: Vercel

## ✨ Características Principales

### Generación de Videos
- ✅ Subida de imagen base
- ✅ Prompt personalizado con descripción adicional
- ✅ Presets rápidos de cámara (Cinematic Zoom, Orbital View, Dynamic Pan, Drone Rise, Static Frame)
- ✅ Configuración avanzada: movimiento, velocidad, duración, intensidad
- ✅ Selección de resolución (720p, 1080p)
- ✅ Música de fondo (opcional)
- ✅ Auto-guardado automático al generar
- ✅ Guardado manual con contexto (descripción, tags)

### Galería de Videos
- ✅ Sidebar deslizante con galería de proyectos
- ✅ Filtro "Todos" vs "Mis videos"
- ✅ Búsqueda por texto
- ✅ Filtro por tags
- ✅ Vista previa con hover (reproducción automática)
- ✅ Modal de visualización completa (layout de 2 columnas)
- ✅ Muestra imagen original, prompt, configuración técnica
- ✅ Descarga de videos

### UX/UI
- ✅ Dark mode / Light mode
- ✅ Keyboard shortcuts (⌘+Enter generar, ⌘+S guardar, ⌘⇧G galería)
- ✅ Toast notifications
- ✅ Botón "Nuevo Video" para resetear
- ✅ Logo clickeable para resetear
- ✅ Responsive design
- ✅ Loading states y error handling

## 🔐 Configuración de Entorno

### Variables de Entorno (.env.local)

```bash
# Gemini AI
GEMINI_API_KEY=your_gemini_key

# Supabase Auth (momentum-auth)
VITE_SUPABASE_URL=https://fmmpvkccaiudjfflelxg.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Firebase (Storage + Database)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=momentum-renders.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=momentum-renders
VITE_FIREBASE_STORAGE_BUCKET=momentum-renders.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Configuración de Firebase

#### Storage Rules
```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write, delete: if true;
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

#### Firestore Rules
```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /videoProjects/{projectId} {
      allow read: if true;
      allow create, update, delete: if true;
    }
  }
}
```

**Nota de Seguridad**: Las reglas permiten acceso total porque la seguridad real está en Supabase Auth. Solo usuarios autenticados de Momentum Brain pueden acceder a la aplicación.

### Configuración de Supabase

#### Dominios Autorizados
En Firebase Console → Authentication → Settings → Authorized domains:
- `localhost`
- `renders.momentumbrain.com`
- Dominios `.vercel.app` de preview

## 📁 Estructura del Proyecto

```
/
├── components/
│   ├── Header.tsx              # Navbar con logo clickeable
│   ├── LoginModal.tsx          # Modal de login Supabase
│   ├── ImageUpload.tsx         # Componente de subida de imagen
│   ├── VideoPlayer.tsx         # Reproductor de video
│   ├── VideoConfigPreview.tsx  # Vista previa de configuración
│   ├── CameraPresets.tsx       # Presets rápidos
│   ├── GallerySidebar.tsx      # Galería lateral con filtros
│   ├── VideoModal.tsx          # Modal de visualización (2 columnas)
│   ├── ContextPanel.tsx        # Panel de descripción/tags
│   ├── QuickActions.tsx        # Acciones rápidas (Nuevo, Descargar)
│   ├── KeyboardShortcutsHelp.tsx
│   └── ui/                     # Componentes UI reutilizables
├── services/
│   ├── geminiService.ts        # Integración Gemini Veo AI
│   ├── firebaseService.ts      # Storage + Firestore
│   └── supabaseService.ts      # Autenticación únicamente
├── lib/
│   └── supabase.ts             # Cliente Supabase
├── hooks/
│   └── useTheme.ts             # Hook para dark mode
├── config/
│   └── firebase.ts             # Configuración Firebase
├── App.tsx                     # Componente principal
├── index.html
├── vite.config.ts
└── package.json
```

## 🔄 Flujo de Autenticación

1. Usuario accede a `renders.momentumbrain.com`
2. Si no está autenticado → Modal de login
3. Usuario ingresa email/password de Momentum Brain
4. Supabase Auth valida credenciales
5. Si es válido → Usuario autenticado, puede usar la app
6. Usuario guarda videos → Se usa su `user.id` de Supabase como referencia en Firebase

## 🚀 Deployment

### Vercel

1. **Variables de Entorno** (Vercel Dashboard → Settings → Environment Variables):
   - Agregar todas las variables de `.env.local`
   - Marcar para Production, Preview y Development

2. **Deploy**:
   ```bash
   git push
   ```
   - Auto-deploy en cada push a `main`
   - URL de producción: `renders.momentumbrain.com`

3. **Dominio Personalizado**:
   - Configurado en Vercel: `renders.momentumbrain.com`
   - DNS: CNAME apuntando a `cname.vercel-dns.com`

## 📝 Comandos

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Preview de build
npm run preview

# Linting
npm run lint
```

## 🐛 Debugging Común

### Video no se genera
- **Verificar**: API Key de Gemini válida
- **Verificar**: Logs en consola para errores específicos
- **Causa común**: Contenido bloqueado por filtros de seguridad de Gemini
- **Solución**: Modificar el prompt o imagen

### Error al guardar proyecto
- **Verificar**: Reglas de Firebase Storage y Firestore
- **Verificar**: Usuario autenticado con Supabase
- **Verificar**: Consola del navegador para errores específicos

### Login no funciona
- **Verificar**: Dominio autorizado en Supabase Auth
- **Verificar**: Variables de entorno de Supabase configuradas
- **Verificar**: Credenciales válidas de Momentum Brain

## 🎨 Temas y Personalización

### Dark Mode
- Toggle en navbar
- Persiste en localStorage
- Clases Tailwind: `dark:bg-slate-800`, etc.

### Keyboard Shortcuts
- `⌘ + Enter` (Windows: `Ctrl + Enter`) - Generar video
- `⌘ + S` (Windows: `Ctrl + S`) - Guardar contexto
- `⌘ + Shift + G` (Windows: `Ctrl + Shift + G`) - Toggle galería
- `Esc` - Cerrar modales

## 📊 Datos del Proyecto

### Modelo VideoProject (Firestore)
```typescript
interface VideoProject {
  id?: string
  userId: string
  userEmail: string
  userName?: string
  userPhoto?: string
  imageUrl: string
  videoUrl: string
  prompt: string
  resolution: string
  musicTrack: string
  tags: string[]
  description?: string
  createdAt: Timestamp
  updatedAt?: Timestamp
  cameraMovement?: string
  movementSpeed?: string
  duration?: string
  intensity?: number
}
```

## 🔮 Características Futuras

- [ ] Compartir videos con link público
- [ ] Exportar en diferentes formatos
- [ ] Batch processing (múltiples imágenes)
- [ ] Templates de prompts predefinidos
- [ ] Historial de prompts usados
- [ ] Estadísticas de uso por usuario
- [ ] Integración con otras IAs (Runway, Pika, etc.)

## 📞 Soporte

- **Equipo**: Momentum Brain
- **Contacto**: gregorio.martin@momentumreim.com
- **GitHub Issues**: Reportar bugs y sugerencias

## 📄 Licencia

Uso interno de Momentum Brain. Todos los derechos reservados.

---

Última actualización: 27 de octubre de 2025
Versión: 1.0.0
