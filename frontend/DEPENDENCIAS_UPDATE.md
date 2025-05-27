# Actualización de Dependencias (Opcional)

## Si quieres eliminar las warnings de dependencias obsoletas:

### 1. Actualizar ESLint a v9:
```bash
npm install eslint@^9.0.0 --save-dev
```

### 2. Actualizar otras dependencias:
```bash
npm update
```

### 3. O crear un nuevo package.json limpio:
```json
{
  "name": "consulta-judicial-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.1",
    "axios": "^1.7.7",
    "lucide-react": "^0.447.0",
    "react-hook-form": "^7.53.0",
    "react-query": "^3.39.3",
    "clsx": "^2.1.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "eslint": "^9.11.1",
    "eslint-plugin-react": "^7.36.1",
    "eslint-plugin-react-hooks": "^4.6.2",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.12",
    "vite": "^5.4.8"
  }
}
```

## ⚠️ Pero por ahora...

**NO es necesario hacer esto**. Las warnings no afectan el funcionamiento de las páginas de autenticación que acabamos de crear.
