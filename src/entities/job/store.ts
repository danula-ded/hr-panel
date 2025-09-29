import { get, writable } from "svelte/store";
import type { Job, FilterOptions } from "../../shared/types";
import { storage } from "../../shared/lib/storage";
import { mockJobs } from "../../shared/mocks/data";

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
      update((state) => {
        const same = JSON.stringify(state.filters) === JSON.stringify(filters);
        if (same) return state;
        return { ...state, filters };
      });
    },

    // Get filtered jobs
    getFilteredJobs: (): Job[] => {
      const state = get({ subscribe });
      return state.jobs.filter((job) => {
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
          if (!searchableText.includes(searchTerm)) return false;
        }
        if (state.filters.grade && job.grade !== state.filters.grade) return false;
        if (state.filters.salary) {
          const { min, max } = state.filters.salary;
          const jobMin = job.salary.min;
          const jobMax = job.salary.max;
          if (min !== undefined && jobMax < min) return false;
          if (max !== undefined && jobMin > max) return false;
        }
        if (state.filters.skills && state.filters.skills.length > 0) {
          const skillsLower = state.filters.skills.map((s) => s.toLowerCase());
          const jobReqLower = job.requirements.map((r) => r.toLowerCase());
          const hasAll = skillsLower.every((s) => jobReqLower.some((r) => r.includes(s)));
          if (!hasAll) return false;
        }
        return true;
      });
    },

    // Get job by ID
    getJobById: (id: string): Job | undefined => {
      const state = get({ subscribe });
      return state.jobs.find((j) => j.id === id);
    },

    // Add new job
    addJob: (
      job: Omit<Job, "id" | "createdAt" | "updatedAt">,
    ): Job => {
      const newJob: Job = {
        ...job,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      update((state) => {
        const updated = [...state.jobs, newJob];
        storage.setItem("jobs", updated);
        return { ...state, jobs: updated };
      });
      return newJob;
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
