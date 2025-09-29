import { writable } from "svelte/store";
import type { Job, FilterOptions } from "../../shared/types";
import { storage } from "../../shared/lib/storage";
import { mockJobs } from "../../shared/config/data";

export interface JobState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
}

const initialState: JobState = {
  jobs: [],
  loading: false,
  error: null,
  filters: {},
};

function createJobStore() {
  const { subscribe, set, update } = writable<JobState>(initialState);

  return {
    subscribe,

    // Load jobs from cache or mock data
    loadJobs: async () => {
      update((state) => ({ ...state, loading: true, error: null }));

      try {
        // Try to load from cache first
        const cachedJobs = storage.getItem<Job[]>("jobs");

        if (cachedJobs && cachedJobs.length > 0) {
          update((state) => ({ ...state, jobs: cachedJobs, loading: false }));

          // Load fresh data in background
          setTimeout(() => {
            update((state) => ({ ...state, jobs: mockJobs }));
            storage.setItem("jobs", mockJobs);
          }, 100);
        } else {
          // Load from mock data
          update((state) => ({ ...state, jobs: mockJobs, loading: false }));
          storage.setItem("jobs", mockJobs);
        }
      } catch (error) {
        update((state) => ({
          ...state,
          error: error instanceof Error ? error.message : "Failed to load jobs",
          loading: false,
        }));
      }
    },

    // Set filters
    setFilters: (filters: FilterOptions) => {
      update((state) => ({ ...state, filters }));
    },

    // Get filtered jobs
    getFilteredJobs: (): Job[] => {
      let filteredJobs: Job[] = [];

      update((state) => {
        filteredJobs = state.jobs.filter((job) => {
          // Search filter
          if (state.filters.search) {
            const searchTerm = state.filters.search.toLowerCase();
            const searchableText = [
              job.title,
              job.company,
              job.location,
              job.description,
            ]
              .join(" ")
              .toLowerCase();

            if (!searchableText.includes(searchTerm)) {
              return false;
            }
          }

          // Grade filter
          if (state.filters.grade && job.grade !== state.filters.grade) {
            return false;
          }

          return true;
        });

        return state;
      });

      return filteredJobs;
    },

    // Get job by ID
    getJobById: (id: string): Job | undefined => {
      let job: Job | undefined;

      update((state) => {
        job = state.jobs.find((j) => j.id === id);
        return state;
      });

      return job;
    },

    // Clear cache
    clearCache: () => {
      storage.removeItem("jobs");
      update((state) => ({ ...state, jobs: [] }));
    },

    // Reset to initial state
    reset: () => {
      set(initialState);
    },
  };
}

export const jobStore = createJobStore();
