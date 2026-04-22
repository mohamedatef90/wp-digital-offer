import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useProposalStore = create(
  persist(
    (set) => ({
      proposal: null,
      loading: true,
      error: null,

      setProposal: (proposal) => set({ proposal, loading: false }),
      updateProposal: (partial) =>
        set((state) => ({ proposal: state.proposal ? { ...state.proposal, ...partial } : partial })),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error, loading: false }),
    }),
    {
      name: 'offerEdge-proposal',
      // Only persist the proposal data, not loading/error state
      partialize: (state) => ({ proposal: state.proposal }),
      // After rehydration, set loading to false if we have a proposal
      onRehydrateStorage: () => (state) => {
        if (state?.proposal) {
          state.loading = false
        }
      },
    }
  )
)

export default useProposalStore
