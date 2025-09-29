export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  grade: JobGrade;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  experience: number;
  skills: string[];
  stage: CandidateStage;
  rating: number;
  notes: string;
  jobId?: string;
  createdAt: string;
  updatedAt: string;
}

export type JobGrade = "junior" | "middle" | "senior" | "lead";

export type JobStatus = "active" | "paused" | "closed";

export type CandidateStage =
  | "applied"
  | "screening"
  | "interview"
  | "technical"
  | "final"
  | "offered"
  | "hired"
  | "rejected";

export interface FilterOptions {
  search?: string;
  grade?: JobGrade;
  stage?: CandidateStage;
  experience?: {
    min: number;
    max: number;
  };
  salary?: {
    min: number;
    max: number;
  };
  skills?: string[];
  jobId?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
