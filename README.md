# React + TypeScript + Vite (Base Starter Template)#

Esta es una plantilla base estructurada para iniciar nuevos proyectos en React de forma rápida, ordenada y con soporte para componentes de interfaz modernos y enrutamiento dinámico.

## 🚀 Tecnologías Incluidas

- **React 19 & TypeScript**: Desarrollo rápido con tipado estático seguro.
- **Vite**: Servidor de desarrollo ultrarrápido.
- **React Router v7**: Enrutamiento nativo para React.
- **Tailwind CSS v4 & @tailwindcss/vite**: Framework de CSS moderno integrado directamente mediante el compilador de Vite.
- **shadcn/ui**: Componentes de interfaz altamente personalizables y accesibles.

---

## 📁 Estructura del Proyecto

El proyecto sigue una estructura limpia orientada a la separación de conceptos globales y específicos:

```text
my-react-app/
├── src/
│   ├── app/                  # Configuraciones y proveedores globales del sistema
│   │   └── router/
│   │       └── router.tsx    # Declaración de rutas y layouts
│   │
│   ├── components/           # Componentes GLOBALES y reutilizables
│   │   └── ui/               # Componentes atómicos (shadcn: button, badge, etc.)
│   │
│   ├── lib/                  # Funciones de utilidad comunes (ej. cn para clases de Tailwind)
│   │   └── utils.ts
│   │
│   ├── index.css             # Estilos globales y configuración de variables CSS de Tailwind v4
│   ├── main.tsx              # Punto de entrada de la aplicación
│   └── vite-env.d.ts
│
├── components.json           # Configuración del CLI de shadcn/ui
├── tsconfig.json             # Configuraciones de TypeScript
└── vite.config.ts            # Configuración de Vite y alias de ruta (@)
```

---

## 🏗️ Convenciones de Desarrollo

### 1. Componentes Genéricos vs. Componentes de Features
- **Componentes Globales**: Van en `src/components/` (por ejemplo, botones genéricos, modales globales, campos de formulario estándar). Los componentes que agregues con **shadcn/ui** se crearán automáticamente aquí.
- **Componentes Específicos (Features)**: Cuando desarrolles una funcionalidad compleja (ej. login, dashboard, perfil), crea una carpeta `src/features/[feature-name]/`. Guarda sus componentes exclusivos en `src/features/[feature-name]/components/`.

### 2. Alias de Ruta (`@`)
Se ha configurado un alias para simplificar las importaciones y evitar rutas relativas largas como `../../../`.
- El prefijo `@/` equivale a la carpeta `src/`.
- **Ejemplo**: `import { Button } from "@/components/ui/button"` en lugar de `import { Button } from "../../components/ui/button"`.

---

## 🛠️ Comandos Útiles

### Servidor de Desarrollo
Para arrancar el entorno local de desarrollo:
```bash
npm run dev
```

### Compilar para Producción
Para compilar y minificar el código listo para subir a producción:
```bash
npm run build
```

### Agregar Componentes de shadcn/ui
Para agregar nuevos componentes visuales a la carpeta `src/components/ui/`:
```bash
npx shadcn add <nombre-del-componente>
# Ejemplo: npx shadcn add input
```
