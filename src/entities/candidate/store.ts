import { writable } from "svelte/store";
import type { Candidate, FilterOptions } from "../../shared/types";
import { storage } from "../../shared/lib/storage";
import { mockCandidates } from "../../shared/config/data";

export interface CandidateState {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  shortlist: string[]; // Array of candidate IDs
}

const initialState: CandidateState = {
  candidates: [],
  loading: false,
  error: null,
  filters: {},
  shortlist: [],
};

function createCandidateStore() {
  const { subscribe, set, update } = writable<CandidateState>(initialState);

  return {
    subscribe,

    // Load candidates from cache or mock data
    loadCandidates: async () => {
      update((state) => ({ ...state, loading: true, error: null }));

      try {
        // Try to load from cache first
        const cachedCandidates = storage.getItem<Candidate[]>("candidates");
        const cachedShortlist = storage.getItem<string[]>("shortlist", []) || [];

        if (cachedCandidates && cachedCandidates.length > 0) {
          update((state) => ({
            ...state,
            candidates: cachedCandidates,
            shortlist: cachedShortlist,
            loading: false,
          }));

          // Load fresh data in background
          setTimeout(() => {
            update((state) => ({ ...state, candidates: mockCandidates }));
            storage.setItem("candidates", mockCandidates);
          }, 100);
        } else {
          // Load from mock data
          update((state) => ({
            ...state,
            candidates: mockCandidates,
            shortlist: cachedShortlist,
            loading: false,
          }));
          storage.setItem("candidates", mockCandidates);
        }
      } catch (error) {
        update((state) => ({
          ...state,
          error:
            error instanceof Error
              ? error.message
              : "Failed to load candidates",
          loading: false,
        }));
      }
    },

    // Set filters
    setFilters: (filters: FilterOptions) => {
      update((state) => ({ ...state, filters }));
    },

    // Get filtered candidates
    getFilteredCandidates: (): Candidate[] => {
      let filteredCandidates: Candidate[] = [];

      update((state) => {
        filteredCandidates = state.candidates.filter((candidate) => {
          // Search filter
          if (state.filters.search) {
            const searchTerm = state.filters.search.toLowerCase();
            const searchableText = [
              candidate.firstName,
              candidate.lastName,
              candidate.email,
              candidate.position,
              candidate.skills.join(" "),
            ]
              .join(" ")
              .toLowerCase();

            if (!searchableText.includes(searchTerm)) {
              return false;
            }
          }

          // Stage filter
          if (state.filters.stage && candidate.stage !== state.filters.stage) {
            return false;
          }

          // Experience filter
          if (state.filters.experience) {
            const { min, max } = state.filters.experience;
            if (candidate.experience < min || candidate.experience > max) {
              return false;
            }
          }

          return true;
        });

        return state;
      });

      return filteredCandidates;
    },

    // Get candidate by ID
    getCandidateById: (id: string): Candidate | undefined => {
      let candidate: Candidate | undefined;

      update((state) => {
        candidate = state.candidates.find((c) => c.id === id);
        return state;
      });

      return candidate;
    },

    // Add candidate
    addCandidate: (
      candidate: Omit<Candidate, "id" | "createdAt" | "updatedAt">,
    ) => {
      const newCandidate: Candidate = {
        ...candidate,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      update((state) => {
        const updatedCandidates = [...state.candidates, newCandidate];
        storage.setItem("candidates", updatedCandidates);
        return { ...state, candidates: updatedCandidates };
      });

      return newCandidate;
    },

    // Update candidate
    updateCandidate: (id: string, updates: Partial<Candidate>) => {
      update((state) => {
        const updatedCandidates = state.candidates.map((candidate) =>
          candidate.id === id
            ? { ...candidate, ...updates, updatedAt: new Date().toISOString() }
            : candidate,
        );
        storage.setItem("candidates", updatedCandidates);
        return { ...state, candidates: updatedCandidates };
      });
    },

    // Delete candidate
    deleteCandidate: (id: string) => {
      update((state) => {
        const updatedCandidates = state.candidates.filter((c) => c.id !== id);
        const updatedShortlist = state.shortlist.filter(
          (candidateId) => candidateId !== id,
        );
        storage.setItem("candidates", updatedCandidates);
        storage.setItem("shortlist", updatedShortlist);
        return {
          ...state,
          candidates: updatedCandidates,
          shortlist: updatedShortlist,
        };
      });
    },

    // Toggle shortlist
    toggleShortlist: (candidateId: string) => {
      update((state) => {
        const isInShortlist = state.shortlist.includes(candidateId);
        const updatedShortlist = isInShortlist
          ? state.shortlist.filter((id) => id !== candidateId)
          : [...state.shortlist, candidateId];

        storage.setItem("shortlist", updatedShortlist);
        return { ...state, shortlist: updatedShortlist };
      });
    },

    // Check if candidate is in shortlist
    isInShortlist: (candidateId: string): boolean => {
      let isInShortlist = false;

      update((state) => {
        isInShortlist = state.shortlist.includes(candidateId);
        return state;
      });

      return isInShortlist;
    },

    // Get shortlisted candidates
    getShortlistedCandidates: (): Candidate[] => {
      let shortlistedCandidates: Candidate[] = [];

      update((state) => {
        shortlistedCandidates = state.candidates.filter((candidate) =>
          state.shortlist.includes(candidate.id),
        );
        return state;
      });

      return shortlistedCandidates;
    },

    // Clear cache
    clearCache: () => {
      storage.removeItem("candidates");
      storage.removeItem("shortlist");
      update((state) => ({ ...state, candidates: [], shortlist: [] }));
    },

    // Reset to initial state
    reset: () => {
      set(initialState);
    },
  };
}

export const candidateStore = createCandidateStore();
