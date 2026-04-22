import { Mail, Phone, MessageCircle } from 'lucide-react'

function SalesContact({ contact }) {
  return (
    <section className="animate-fade-up-delay1 max-w-[900px] mx-auto px-5 py-10">
      <div className="flex items-center gap-2.5 mb-3.5">
        <div className="w-[30px] h-0.5 bg-brand-blue" />
        <h2 className="text-[11px] font-bold text-brand-blue uppercase tracking-[0.1em]">
          Your Sales Contact
        </h2>
      </div>

      <div className="bg-dark-800 border border-white/[0.07] rounded-[14px] px-[26px] py-[22px] flex items-center gap-[18px] flex-wrap">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center text-[22px] font-extrabold text-white shrink-0">
          {contact.initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-[160px]">
          <div className="text-[15px] font-bold text-text-primary">
            {contact.name}
          </div>
          <div className="text-xs text-text-muted mt-0.5">{contact.title}</div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-dark-700 border border-white/[0.07] rounded-lg text-text-primary no-underline text-xs font-semibold transition-colors hover:border-white/20"
          >
            <Mail size={13} />
            {contact.email}
          </a>
          <a
            href={`tel:${contact.phone}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-dark-700 border border-white/[0.07] rounded-lg text-text-primary no-underline text-xs font-semibold"
          >
            <Phone size={13} />
            {contact.phone}
          </a>
          <a
            href={`https://wa.me/${contact.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-whatsapp/10 border border-whatsapp/40 rounded-lg text-whatsapp no-underline text-xs font-bold"
          >
            <MessageCircle size={13} />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

export default SalesContact
