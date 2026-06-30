/** A LearnCity bootcamp as returned by the backend. */
export interface Bootcamp {
  id: string;
  name: string | null;
  bootcampType: string; // e.g. "Online", "Onsite", "Hybrid"
  bootcampCourse: string; // e.g. "VirtualAssistant"
  startDate: string; // ISO
  endDate: string; // ISO
  createdAt: string; // ISO
}

/** Laravel-style pagination envelope used by the list endpoint. */
export interface PageMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PageLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface Paginated<T> {
  data: T[];
  meta: PageMeta;
  links: PageLinks;
}
