import { useEffect } from 'react'
import useProposalStore from '../store/useProposalStore'
import sampleProposal from '../data/sampleProposal'
import { useTheme } from '../hooks/useTheme'
import { resolveCompanyLogoUrl } from '../lib/companyLogo'
import Navbar from '../components/proposal/Navbar'
import HeroSection from '../components/proposal/HeroSection'
import TrustedBy from '../components/proposal/TrustedBy'
import DatesBar from '../components/proposal/DatesBar'
import AboutSection from '../components/proposal/AboutSection'
import ProductDetails from '../components/proposal/ProductDetails'
import CommitmentSection from '../components/proposal/CommitmentSection'
import SalesContact from '../components/proposal/SalesContact'
import QuoteDetails from '../components/proposal/QuoteDetails'
import AddOns from '../components/proposal/AddOns'
import NegotiateButton from '../components/proposal/NegotiateButton'
import SignSection from '../components/proposal/SignSection'
import Footer from '../components/proposal/Footer'
import ChatButton from '../components/proposal/ChatButton'
import { ScrollProgress } from '../components/proposal/ScrollProgress'
import { RevealSection } from '../components/proposal/RevealSection'
import { StickySignCTA } from '../components/proposal/StickySignCTA'

function ProposalPage() {
  const { proposal, loading, setProposal } = useProposalStore()
  const { resolved, preference, cycleTheme } = useTheme(proposal?.theme ?? 'dark')

  useEffect(() => {
    // Only seed with sample data if the store is empty (no admin save yet).
    // TODO: Replace with API call using the route param id
    // const { id } = useParams()
    // axios.get(`/api/proposals/${id}`).then(res => setProposal(res.data))
    if (!proposal) {
      setProposal(sampleProposal)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || !proposal) {
    return (
      <div className="min-h-dvh bg-dark-900 flex items-center justify-center">
        <div className="text-text-secondary text-sm">Loading proposal...</div>
      </div>
    )
  }

  const s = proposal.sections ?? {}

  return (
    <>
      {/* Navbar is outside the theme wrapper so its always-dark styles are unaffected */}
      <Navbar
        companyName={proposal.company.name}
        recipientName={proposal.recipientName}
        themePreference={preference}
        onCycleTheme={cycleTheme}
      />

      <div data-theme={resolved} className="bg-dark-900 min-h-dvh text-text-primary">

        {/* Reading progress bar — sits just below the fixed navbar */}
        <ScrollProgress />

        <div className="pt-[54px]">

          {/* ── Hero ── already has its own framer-motion animation */}
          <HeroSection
            proposalNumber={proposal.proposalNumber}
            clientName={proposal.clientName}
            clientLogo={proposal.clientLogo}
            companyName={proposal.company.name}
            companyLogo={resolveCompanyLogoUrl(proposal.company.logo, resolved)}
            isDark={resolved === 'dark'}
          />

          {/* ── Social proof: logos ── */}
          {s.trustedBy !== false && proposal.company.trustedLogos.length > 0 && (
            <RevealSection>
              <TrustedBy
                companyName={proposal.company.name}
                logos={proposal.company.trustedLogos}
              />
            </RevealSection>
          )}

          {/* ── Urgency: validity window ── */}
          {s.datesBar !== false && (
            <RevealSection>
              <DatesBar
                createdAt={proposal.createdAt}
                validUntil={proposal.validUntil}
              />
            </RevealSection>
          )}

          {/* ── Credibility: about the company ── */}
          {s.about !== false && (
            <RevealSection>
              <AboutSection company={proposal.company} />
            </RevealSection>
          )}

          {/* ── Value: what they get ── */}
          {s.productDetails !== false && (
            <RevealSection>
              <ProductDetails products={proposal.products} />
            </RevealSection>
          )}

          {/* ── Risk reduction: guarantees ── */}
          {s.commitments !== false && (
            <RevealSection>
              <CommitmentSection commitments={proposal.commitments} />
            </RevealSection>
          )}

          {/* ── The number: pricing ── */}
          {s.quoteDetails !== false && (
            <RevealSection>
              <QuoteDetails
                lineItems={proposal.lineItems}
                termMonths={proposal.termMonths}
                currency={proposal.currency}
                taxNote={proposal.taxNote}
              />
            </RevealSection>
          )}

          {/* ── More value: add-ons ── */}
          {s.addOns !== false && (
            <RevealSection>
              <AddOns addOns={proposal.addOns} />
            </RevealSection>
          )}

          {/* ── Escape valve: counter-offer ── */}
          {s.negotiateButton !== false && (
            <RevealSection>
              <NegotiateButton />
            </RevealSection>
          )}

          {/* ── Human connection: sales contact ── */}
          {s.salesContact !== false && (
            <RevealSection>
              <SalesContact contact={proposal.salesContact} />
            </RevealSection>
          )}

          {/* ── The destination: signature ── */}
          <RevealSection>
            <SignSection />
          </RevealSection>

          <RevealSection>
            <Footer
              companyName={proposal.company.name}
              proposalNumber={proposal.proposalNumber}
            />
          </RevealSection>

        </div>

        {/* Sticky sign CTA — appears mid-scroll, hides near the sign section */}
        <StickySignCTA />

        {s.chatButton !== false && <ChatButton />}
      </div>
    </>
  )
}

export default ProposalPage
