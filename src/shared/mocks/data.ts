import type { Job, Candidate } from "../types";

// Expanded mock datasets for development and testing
export const mockJobs: Job[] = Array.from({ length: 25 }).map((_, idx) => {
  const id = String(idx + 1);
  const grades = ["junior", "middle", "senior", "lead"] as const;
  const locations = ["Moscow", "Saint Petersburg", "Remote", "Kazan", "Novosibirsk"];
  const titles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "QA Engineer",
    "UI/UX Designer",
  ];
  const title = titles[idx % titles.length];
  const grade = grades[idx % grades.length];
  const location = locations[idx % locations.length];
  const min = 70000 + idx * 5000;
  const max = min + 60000;
  return {
    id,
    title: `${title} ${grade.toUpperCase()}`,
    company: `Company ${id}`,
    location,
    grade,
    salary: { min, max, currency: "RUB" },
    description: `${title} working on modern web applications and tooling`,
    requirements: [
      "JavaScript/TypeScript",
      "Git",
      "REST/GraphQL",
      idx % 2 ? "Docker" : "Testing",
    ],
    benefits: ["Remote", "Insurance", "Education budget"],
    status: "active",
    createdAt: new Date(2024, (idx % 12), (idx % 28) + 1).toISOString(),
    updatedAt: new Date(2024, (idx % 12), (idx % 28) + 1).toISOString(),
  } as Job;
});

export const mockCandidates: Candidate[] = Array.from({ length: 40 }).map((_, idx) => {
  const id = String(idx + 1);
  const stages = [
    "applied",
    "screening",
    "interview",
    "technical",
    "final",
    "offered",
    "hired",
    "rejected",
  ] as const;
  const positions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "QA Engineer",
    "UI/UX Designer",
  ];
  const firstNames = ["Алексей", "Мария", "Дмитрий", "Анна", "Сергей", "Елена", "Игорь", "Ольга"];
  const lastNames = ["Петров", "Сидорова", "Козлов", "Морозова", "Волков", "Новикова", "Соколов", "Кузнецова"];
  const stage = stages[idx % stages.length];
  const position = positions[idx % positions.length];
  const firstName = firstNames[idx % firstNames.length];
  const lastName = lastNames[idx % lastNames.length];
  const skillsPool = [
    "React",
    "Vue",
    "Svelte",
    "Node.js",
    "PostgreSQL",
    "Docker",
    "AWS",
    "Kubernetes",
    "TypeScript",
    "CSS",
    "HTML",
    "Jest",
  ];
  const skills = [skillsPool[idx % skillsPool.length], skillsPool[(idx + 3) % skillsPool.length], skillsPool[(idx + 6) % skillsPool.length]];
  return {
    id,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${id}@email.com`,
    phone: "+7 (999) 123-45-67",
    position,
    experience: (idx % 10),
    skills,
    stage,
    rating: ((idx % 50) / 10),
    notes: "Автосгенерированная заметка для проверки UI",
    jobId: String((idx % 25) + 1),
    createdAt: new Date(2024, (idx % 12), (idx % 28) + 1).toISOString(),
    updatedAt: new Date(2024, (idx % 12), (idx % 28) + 1).toISOString(),
  } as Candidate;
});


