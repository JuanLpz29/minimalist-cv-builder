import { Heart } from "lucide-react";

// Donación voluntaria (Mercado Pago, monto libre). Nunca bloquea ni condiciona la descarga.
const DONATE_URL = "https://link.mercadopago.cl/vitaebuilder";

/** Tarjeta para la portada, debajo de la lista de CVs. */
export function DonateCard() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-5 sm:flex-row sm:items-center">
      <Heart className="hidden h-6 w-6 shrink-0 text-blue-600 sm:block" aria-hidden />
      <div className="flex-1">
        <div className="text-sm font-semibold">¿Te sirvió? Invítame un café ☕</div>
        <div className="text-sm text-neutral-500">Tu apoyo me motiva a seguir mejorando.</div>
      </div>
      <a
        href={DONATE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-medium text-white hover:bg-blue-700"
      >
        Donar
      </a>
    </div>
  );
}
