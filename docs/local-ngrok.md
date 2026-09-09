# Correr en local y compartir con ngrok

## Requisitos

- Node.js 20+ (el repo usa Vite 8 / TanStack Start)
- [ngrok](https://ngrok.com/download) instalado y con cuenta (free alcanza)

```bash
npm install
npm run dev
```

Anotá el puerto que imprime Vite (suele ser `5173` o el que asigne Lovable/sandbox).

## Exponer a un amigo con ngrok

En otra terminal:

```bash
ngrok http 5173
```

Si Vite usa otro puerto, cambiá el número. ngrok te da una URL tipo:

`https://xxxx.ngrok-free.app`

Compartí esa URL. Tu máquina tiene que seguir prendida con `npm run dev` corriendo.

### Primera visita (plan free de ngrok)

El visitante puede ver una pantalla intermedia “Visit Site” de ngrok: es normal en el plan gratis.

## Límites importantes

| Tema | Qué pasa |
|------|----------|
| Datos | Cada browser guarda CVs en su propio `localStorage`. Vos y tu amigo **no comparten** el mismo CV. |
| Auth | No hay login. Cualquiera con el link entra. |
| AI | Los botones Improve/Generate son stub local (no llaman API). |
| Túnel | Al cerrar la laptop o matar `dev`/`ngrok`, el link muere. |
| HTTPS | ngrok da HTTPS; útil si el browser pide contexto seguro para algunas APIs. |

## Flujo recomendado para probar import

1. `npm run dev` + `ngrok http <puerto>`
2. Abrí el link → **Import PDF/DOCX**
3. Editá campos → **Generate PDF** (diálogo de impresión del browser → Guardar como PDF)

## Alternativa sin ngrok

Si ambos están en la misma red Wi‑Fi:

```bash
npm run dev -- --host
```

Y compartí `http://<tu-ip-local>:<puerto>`. Más frágil con firewalls; ngrok suele ser más simple.
