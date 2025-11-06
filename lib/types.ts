export type ScholarshipLevel =
  | 'Undergraduate'
  | 'Masters'
  | 'PhD'
  | 'Postdoctoral'
  | 'Research'
  | 'Fellowship'
  | 'Postgraduate'
  | 'Professional'
  | 'MBA';

export interface Scholarship {
  id: string;
  name: string;
  countries: string[];
  levelTags: ScholarshipLevel[];
  coverage: string[];
  deadlineLabel: string;
  deadlineDate: string | null;
  isExpired: boolean;
  link: string;
  previewImage: string | null;
  shortDescription: string | null;
  metadataRefreshedAt: string | null;
}

export interface ScholarshipPreview extends Scholarship {
  previewImage: string | null;
  shortDescription: string | null;
}

export interface ScholarshipDetail extends ScholarshipPreview {
  images: string[];
  longDescription: string | null;
  summary: string | null;
}
