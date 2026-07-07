export interface CVData {
  personal_info: {
    name: string;
    address: string;
    email: string;
    dob: string;
    nationality: string;
    phone: string[];
    objective: string;
    github?: string;
    linkedin?: string;
  };
  summary: string[];
  education: Array<{
    institution: string;
    degree: string;
    period: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    period: string;
    responsibilities: string[];
  }>;
  skills: {
    languages: Array<{ name: string; level: string }>;
    technology: Array<{ name: string; level: string }>;
    administrative: Array<{ name: string; level: string }>;
  };
  projects_disclaimer?: string;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
}
