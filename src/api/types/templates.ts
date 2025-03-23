
export interface Kernel {
  version: string;
  isLatest?: boolean;
  releaseDate?: string;
  description?: string;
}

export interface TemplateVersion {
  version: string;
  kernels: Kernel[];
  isLatest?: boolean;
  releaseDate?: string;
  description?: string;
  isRecommended?: boolean;
}

export interface VCenterAvailability {
  id: string;
  name: string;
  isAvailable: boolean;
}

export interface TemplateOS {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  versions: TemplateVersion[];
  category: 'linux' | 'windows' | 'other';
  isPopular?: boolean;
  vCenterAvailability?: VCenterAvailability[];
}

export interface TemplateStats {
  total: number;
  linux: number;
  windows: number;
  other: number;
  recent: number;
}

export interface TemplateFilters {
  category?: 'linux' | 'windows' | 'other' | 'all';
  search?: string;
  showOnlyRecommended?: boolean;
  showOnlyLatest?: boolean;
  vCenterId?: string;
}
