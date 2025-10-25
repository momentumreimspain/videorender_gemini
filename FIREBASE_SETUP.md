# 🔥 Firebase Configuration - URGENT FIX

## ⚠️ ERROR: Missing or insufficient permissions

Si ves estos errores en la consola:
```
FirebaseError: Missing or insufficient permissions
CORS policy: Response to preflight request doesn't pass access control check
```

**Necesitas configurar las reglas de Firebase AHORA:**

---

## 🚀 Solución Rápida (5 minutos)

### Paso 1: Configura Firestore

1. Ve a: https://console.firebase.google.com
2. Selecciona tu proyecto: **momentum-renders**
3. Click en **Firestore Database** (menú lateral)
4. Click en la pestaña **Rules**
5. **BORRA todo** y pega esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectId} {
      allow read: if true;
      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null
                    && request.auth.uid == resource.data.userId;
      allow delete: if request.auth != null
                    && request.auth.uid == resource.data.userId;
    }
  }
}
```

6. Click **Publish** (botón azul arriba a la derecha)

---

### Paso 2: Configura Storage

1. En la misma consola de Firebase
2. Click en **Storage** (menú lateral)
3. Click en la pestaña **Rules**
4. **BORRA todo** y pega esto:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.uid == userId;
      allow delete: if request.auth != null
                    && request.auth.uid == userId;
    }
  }
}
```

5. Click **Publish**

---

## ✅ Verificación

Después de aplicar las reglas:

1. Recarga tu app (F5)
2. Inicia sesión con Google
3. Genera un video
4. Debería guardarse automáticamente sin errores

---

## 📋 ¿Qué hacen estas reglas?

### Firestore (Base de datos):
- ✅ **Cualquiera** puede VER proyectos (para la galería pública)
- ✅ Solo usuarios autenticados pueden CREAR proyectos
- ✅ Solo el dueño puede ACTUALIZAR/ELIMINAR sus proyectos

### Storage (Archivos):
- ✅ **Cualquiera** puede VER archivos (imágenes/videos)
- ✅ Solo usuarios autenticados pueden SUBIR a su carpeta
- ✅ Solo el dueño puede ELIMINAR sus archivos

---

## 🆘 Si sigues teniendo problemas

1. Verifica que copiaste las reglas COMPLETAS (desde `rules_version` hasta el final)
2. Asegúrate de hacer click en **Publish** después de pegar
3. Espera 10-30 segundos para que se propaguen
4. Recarga la página (Ctrl+Shift+R / Cmd+Shift+R)

---

## 🔒 Seguridad

Estas reglas son seguras porque:
- Los usuarios solo pueden modificar sus propios datos
- El `userId` se valida contra el usuario autenticado
- La lectura pública permite compartir la galería
- No hay acceso anónimo para escribir datos

---

✅ Una vez configurado, todo debería funcionar perfectamente!
