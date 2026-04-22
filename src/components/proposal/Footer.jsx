function Footer({ companyName, proposalNumber }) {
  return (
    <footer className="px-7 py-6 border-t border-white/[0.07] flex justify-between items-center text-[11px] text-text-muted">
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded-[3px] bg-brand-green flex items-center justify-center text-[8px] font-extrabold text-white">
          O
        </div>
        Powered by OfferEdge
      </div>
      <span>
        {companyName} &middot; {proposalNumber}
      </span>
    </footer>
  )
}

export default Footer
