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
  fundingType: string | null;
  organisation: string | null;
  deadlineLabel: string;
  deadlineDate: string | null;
  isExpired: boolean;
  link: string;
  previewImage: string | null;
  shortDescription: string | null;
  sheetSummary: string | null;
  sheetBreakdown: string | null;
  eligibility: string[];
  subjects: string[];
  deliveryModes: string[];
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
