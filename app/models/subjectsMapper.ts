export const SUBJECTS_MAPPER: {[key: number]: { label: string, slug: string }} = {
  125: {
    "label": "Business",
    "slug": "business"
  },
  99: {
    "label": "Psychology",
    "slug": "psychology"
  },
  103: {
    "label": "Biology",
    "slug": "biology"
  },
  120: {
    "label": "Nursing",
    "slug": "nursing"
  },
  98: {
    "label": "Political Science",
    "slug": "political-science"
  },
  96: {
    "label": "History",
    "slug": "history"
  },
  123: {
    "label": "Computing",
    "slug": "computing"
  },
  94: {
    "label": "Anthropology",
    "slug": "anthropology"
  },
  107: {
    "label": "Mathematics",
    "slug": "mathematics"
  },
  95: {
    "label": "Art & Humanities",
    "slug": "art"
  },
  101: {
    "label": "Social Work / Family Therapy / Human Services",
    "slug": "social"
  },
  111: {
    "label": "Medicine",
    "slug": "medicine"
  },
  97: {
    "label": "Philosophy",
    "slug": "philosophy"
  },
  110: {
    "label": "Statistics",
    "slug": "statistics"
  },
  102: {
    "label": "Sociology",
    "slug": "sociology"
  },
  104: {
    "label": "Chemistry",
    "slug": "chemistry"
  },
  115: {
    "label": "Criminal Justice",
    "slug": "criminal"
  },
  106: {
    "label": "Geology/Geography/Oceanography/Atmospheric Sciences",
    "slug": "geology"
  },
  121: {
    "label": "Language",
    "slug": "language"
  },
  108: {
    "label": "Nutrition",
    "slug": "nutrition"
  },
  117: {
    "label": "Education",
    "slug": "education"
  },
  113: {
    "label": "Health & Kinesiology",
    "slug": "health"
  },
  126: {
    "label": "Trade & Technology",
    "slug": "trade"
  },
  112: {
    "label": "English",
    "slug": "english"
  },
  118: {
    "label": "Engineering",
    "slug": "engineering"
  }
}

export function getSubjectIdBySlug(slug?: string) {
  if (!slug) return undefined;
  for (const [key, subj] of Object.entries(SUBJECTS_MAPPER)) {
    if (subj.slug === slug) {
      return key;
    }
  }

  return undefined;
}

export function getSubjectSlugById(id?: number | string) {
  if (!id) return '/';
  const subjId = typeof id === "string" ? Number(id) : id;
  return SUBJECTS_MAPPER?.hasOwnProperty(subjId) ? SUBJECTS_MAPPER[subjId].slug : '/';
}