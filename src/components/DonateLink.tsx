/** Link de donación voluntaria (Mercado Pago, monto libre). Nunca bloquea nada. */
export function DonateLink({ className = "" }: { className?: string }) {
  return (
    <a
      href="https://link.mercadopago.cl/vitaebuilder"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-10 items-center text-sm text-neutral-500 underline-offset-4 hover:text-neutral-900 hover:underline ${className}`}
    >
      ¿Te sirvió? Invítame un café ☕
    </a>
  );
}
