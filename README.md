# Foro Regional Inmobiliario Bajío 2026

Landing page de venta de boletos para el Foro Regional Inmobiliario del Bajío,
AMPI Aguascalientes. Sitio en vivo: https://foroampiags.com.mx

Next.js 15 (App Router), React 19, TypeScript. Una sola página con secciones,
más dos rutas de API para el registro de asistentes.

## Requisitos

Node.js 18.18 o superior. Probado con Node 24 LTS.

## Arrancar en local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre http://localhost:3000

`.env.local` define `EXPORT_ACCESS_KEY`, la clave que protege la descarga del
Excel de registros. Para desarrollo sirve cualquier valor. El archivo está en
`.gitignore` y nunca se sube.

## Comandos

```bash
npm run dev      # servidor de desarrollo en localhost:3000
npm run build    # compilación de producción
npm start        # sirve la compilación de producción
```

No hay linter ni suite de pruebas configurados.

**Cuidado:** no corras `npm run build` mientras `npm run dev` está activo sobre
esta misma carpeta. La compilación sobrescribe el directorio `.next/` que el
servidor de desarrollo está usando y lo deja devolviendo errores 500 hasta que
lo reinicies.

## Registros de asistentes

Cada registro se guarda como una fila por boleto en un libro de Excel por día,
en `data/exports/registros_AAAA-MM-DD.xlsx`. No hay base de datos.

Esa carpeta contiene datos personales reales y está excluida de git. Nunca la
subas al repositorio.

Para descargar el archivo de un día:

```
/api/registro/export?date=AAAA-MM-DD&key=TU_EXPORT_ACCESS_KEY
```

## Publicar

El sitio corre en el hosting Node.js de Hostinger, conectado por la integración
de Git de hPanel al repositorio `sempagni/foroampi7`, rama `main`, con
despliegue automático.

**Un push a `main` publica el sitio.** Todos los recursos que la aplicación usa
viven en `public/` y están versionados, así que no hay que subir nada a mano por
el File Manager de Hostinger.

## Estructura

```
app/
  layout.tsx        navbar, fondos, fuentes y Meta Pixel
  page.tsx          orden de las secciones
  globals.css       tokens de diseño y reset
  components/       las secciones de la página
  api/registro/     alta de registros y exportación a Excel
public/             imágenes, logos y videos del sitio
```

Para el detalle de arquitectura y las decisiones de implementación, lee
`CLAUDE.md`.
