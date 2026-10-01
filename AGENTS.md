# Agent notes

This project lives at https://github.com/JuanLpz29/minimalist-cv-builder.

It is **not** connected to Lovable. Push to `origin` (`minimalist-cv-builder`), never to the old
`lovable` remote (`mica-resume-flow`).

## Convenciones de PR (mismas del dev-kit de Mitrilo, adaptadas a este repo)

Mismo estándar que `dev-kit-mitrilo/4-ejecucion/mitrilo_implementar_feature.md`. Dos adaptaciones,
no omisiones silenciosas:

- **Detección de repos (Paso 0 del dev-kit):** el dev-kit busca subcarpetas API/ADMIN en el
  directorio padre porque asume monorepo separado en dos repos. Acá no hay que detectar nada — este
  repo es mono-repo de un solo frontend, así que `API = ADMIN = CURRENT` siempre (mismo caso que
  TuVigía en el dev-kit original). Todo el flujo corre en este único repo.
- **Gestor de paquetes:** el dev-kit asume `pnpm`. Este repo usa `npm` (ver `README.md` /
  `netlify.toml`) — migrar a `pnpm` es una mejora futura pendiente, no algo a forzar ahora. Usar
  `npm run <script>` en todos los comandos hasta que se migre.

- **Rama por cambio es el default.** Nunca commitear directo a `main` salvo que el usuario lo pida
  explícitamente en el chat para ese cambio puntual — ahí sí, commit directo sin rama ni PR. Sin esa
  instrucción explícita, siempre:
  `git checkout main && git pull origin main && git checkout -b <nombre-rama>`.
- **Staging explícito**: `git add <archivo1> <archivo2> ...`, nunca `git add -A` ni `git add .`.
- **Commit semántico**: `<tipo>: <descripción concisa en infinitivo>` — tipos válidos `feat`, `fix`,
  `refactor`, `test`, `docs`. Describe el QUÉ y el POR QUÉ en términos que alguien sin leer el código
  entienda (el comportamiento o pantalla afectada), no el nombre interno de la función.
- **Antes de commitear**: `npm run lint`. Este repo no tiene script de `type-check` todavía — si se
  agrega uno (`tsc --noEmit`), sumarlo a este paso.
- **Abrir PR** con `gh pr create --base main --title "<título>" --body "..."`, cuerpo con:
  ```
  ## Razón del cambio
  <por qué se hizo>

  ## Resumen de cambios
  <qué hace el cambio para quien usa el sitio, no el nombre técnico del archivo/función>

  ## Test plan
  - [ ] <paso concreto de validación>
  - [ ] npm run lint pasa sin errores
  ```
- Un PR por unidad lógica de cambio — no mezclar cosas no relacionadas en el mismo PR.

Business/venture planning (launch post, monetization brainstorm) lives outside this repo, in
`MITRILO/Proyectos/ventures/CV_BUILDER/` (iCloud) — not here. Use `/add-dir` on that path if you
need that context.
