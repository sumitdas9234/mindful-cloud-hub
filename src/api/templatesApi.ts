
import axios from 'axios';
import { TemplateOS, TemplateStats, TemplateFilters, VCenterAvailability } from './types/templates';
import env from '@/config/env';

const BASE_API_URL = env.API_BASE_URL;

// Mock vCenter data
const MOCK_VCENTERS: VCenterAvailability[] = [
  { id: 'vc-1', name: 'vcenter-east-01', isAvailable: true },
  { id: 'vc-2', name: 'vcenter-west-01', isAvailable: true },
  { id: 'vc-3', name: 'vcenter-central-01', isAvailable: false },
  { id: 'vc-4', name: 'vcenter-dev-01', isAvailable: true },
  { id: 'vc-5', name: 'vcenter-test-01', isAvailable: false }
];

// Mock data for templates
const MOCK_TEMPLATES: TemplateOS[] = [
  {
    id: 'ubuntu',
    name: 'Ubuntu',
    description: 'Ubuntu is a Linux distribution based on Debian.',
    icon: 'fl-ubuntu fl-fw',
    category: 'linux',
    isPopular: true,
    vCenterAvailability: [
      { id: 'vc-1', name: 'vcenter-east-01', isAvailable: true },
      { id: 'vc-2', name: 'vcenter-west-01', isAvailable: true },
      { id: 'vc-3', name: 'vcenter-central-01', isAvailable: true },
      { id: 'vc-4', name: 'vcenter-dev-01', isAvailable: true },
      { id: 'vc-5', name: 'vcenter-test-01', isAvailable: true }
    ],
    versions: [
      {
        version: '22.04 LTS',
        isLatest: false,
        isRecommended: true,
        releaseDate: '2022-04-21',
        description: 'Jammy Jellyfish',
        kernels: [
          { version: '5.15', isLatest: false, description: 'Default kernel' },
          { version: '5.17', isLatest: false },
          { version: '5.19', isLatest: false },
          { version: '6.1', isLatest: false },
          { version: '6.5', isLatest: true }
        ]
      },
      {
        version: '24.04 LTS',
        isLatest: true,
        releaseDate: '2024-04-25',
        description: 'Noble Numbat',
        kernels: [
          { version: '6.8', isLatest: true, description: 'Default kernel' },
          { version: '6.5', isLatest: false }
        ]
      }
    ]
  },
  {
    id: 'rhel',
    name: 'Red Hat Enterprise Linux',
    description: 'Enterprise-grade Linux distribution provided by Red Hat.',
    icon: 'fl-redhat fl-fw',
    category: 'linux',
    isPopular: true,
    vCenterAvailability: [
      { id: 'vc-1', name: 'vcenter-east-01', isAvailable: true },
      { id: 'vc-2', name: 'vcenter-west-01', isAvailable: true },
      { id: 'vc-3', name: 'vcenter-central-01', isAvailable: false },
      { id: 'vc-4', name: 'vcenter-dev-01', isAvailable: true },
      { id: 'vc-5', name: 'vcenter-test-01', isAvailable: true }
    ],
    versions: [
      {
        version: '8.9',
        isLatest: false,
        isRecommended: true,
        releaseDate: '2023-11-14',
        kernels: [
          { version: '4.18', isLatest: true, description: 'Default kernel' }
        ]
      },
      {
        version: '9.3',
        isLatest: true,
        releaseDate: '2023-11-08',
        kernels: [
          { version: '5.14', isLatest: true, description: 'Default kernel' }
        ]
      }
    ]
  },
  {
    id: 'rocky',
    name: 'Rocky Linux',
    description: 'Community enterprise operating system designed to be 100% bug-for-bug compatible with RHEL.',
    icon: 'fl-rocky-linux fl-fw',
    category: 'linux',
    vCenterAvailability: [
      { id: 'vc-1', name: 'vcenter-east-01', isAvailable: true },
      { id: 'vc-2', name: 'vcenter-west-01', isAvailable: false },
      { id: 'vc-3', name: 'vcenter-central-01', isAvailable: false },
      { id: 'vc-4', name: 'vcenter-dev-01', isAvailable: true },
      { id: 'vc-5', name: 'vcenter-test-01', isAvailable: false }
    ],
    versions: [
      {
        version: '8.9',
        isLatest: false,
        releaseDate: '2023-11-21',
        kernels: [
          { version: '4.18', isLatest: true, description: 'Default kernel' }
        ]
      },
      {
        version: '9.3',
        isLatest: true,
        releaseDate: '2023-11-20',
        kernels: [
          { version: '5.14', isLatest: true, description: 'Default kernel' }
        ]
      }
    ]
  },
  {
    id: 'sles',
    name: 'SUSE Linux Enterprise Server',
    description: 'Commercial Linux distribution provided by SUSE.',
    icon: 'fl-opensuse fl-fw',
    category: 'linux',
    versions: [
      {
        version: '15 SP5',
        isLatest: true,
        releaseDate: '2023-06-20',
        kernels: [
          { version: '5.14.21', isLatest: true, description: 'Default kernel' }
        ]
      },
      {
        version: '12 SP5',
        isLatest: false,
        releaseDate: '2019-12-11',
        kernels: [
          { version: '4.12', isLatest: true, description: 'Default kernel' }
        ]
      }
    ]
  },
  {
    id: 'sles-micro',
    name: 'SUSE Linux Enterprise Micro',
    description: 'Lightweight OS designed specifically for containerized and virtualized workloads.',
    icon: 'fl-opensuse fl-fw',
    category: 'linux',
    versions: [
      {
        version: '5.5',
        isLatest: true,
        releaseDate: '2023-12-14',
        kernels: [
          { version: '5.14.21', isLatest: true, description: 'Default kernel' }
        ]
      }
    ]
  },
  {
    id: 'photon',
    name: 'VMware Photon OS',
    description: 'Linux container host optimized for VMware platforms.',
    icon: 'fl-tux fl-fw',
    category: 'linux',
    versions: [
      {
        version: '5.0',
        isLatest: true,
        releaseDate: '2023-09-18',
        kernels: [
          { version: '6.1.52', isLatest: true, description: 'Default kernel' }
        ]
      },
      {
        version: '4.0',
        isLatest: false,
        releaseDate: '2021-06-07',
        kernels: [
          { version: '5.10', isLatest: true, description: 'Default kernel' }
        ]
      }
    ]
  },
  {
    id: 'flatcar',
    name: 'Flatcar Container Linux',
    description: 'Immutable Linux distribution for containers.',
    icon: 'fl-tux fl-fw',
    category: 'linux',
    versions: [
      {
        version: '3815.2.0',
        isLatest: true,
        releaseDate: '2023-11-21',
        kernels: [
          { version: '6.1.61', isLatest: true, description: 'Default kernel' }
        ]
      }
    ]
  },
  {
    id: 'debian',
    name: 'Debian',
    description: 'Free and open-source Linux distribution.',
    icon: 'fl-debian fl-fw',
    category: 'linux',
    versions: [
      {
        version: '12 (Bookworm)',
        isLatest: true,
        releaseDate: '2023-06-10',
        kernels: [
          { version: '6.1', isLatest: true, description: 'Default kernel' }
        ]
      },
      {
        version: '11 (Bullseye)',
        isLatest: false,
        releaseDate: '2021-08-14',
        kernels: [
          { version: '5.10', isLatest: true, description: 'Default kernel' }
        ]
      }
    ]
  },
  {
    id: 'windows-server',
    name: 'Windows Server',
    description: 'Server operating system developed by Microsoft.',
    icon: '/placeholder.svg',
    category: 'windows',
    versions: [
      {
        version: '2022',
        isLatest: true,
        releaseDate: '2021-08-18',
        kernels: [
          { version: 'N/A', isLatest: true, description: 'Default kernel' }
        ]
      },
      {
        version: '2019',
        isLatest: false,
        releaseDate: '2018-10-02',
        kernels: [
          { version: 'N/A', isLatest: true, description: 'Default kernel' }
        ]
      }
    ]
  }
];

// Mock template stats
const MOCK_TEMPLATE_STATS: TemplateStats = {
  total: MOCK_TEMPLATES.length,
  linux: MOCK_TEMPLATES.filter(t => t.category === 'linux').length,
  windows: MOCK_TEMPLATES.filter(t => t.category === 'windows').length,
  other: MOCK_TEMPLATES.filter(t => t.category === 'other').length,
  recent: 3
};

// Fetch all templates
export const fetchTemplates = async (filters?: TemplateFilters): Promise<TemplateOS[]> => {
  // In a real implementation, this would make an API call
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Apply filters
    let filteredTemplates = [...MOCK_TEMPLATES];
    
    if (filters) {
      // Filter by category
      if (filters.category && filters.category !== 'all') {
        filteredTemplates = filteredTemplates.filter(
          template => template.category === filters.category
        );
      }
      
      // Filter by search term
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTemplates = filteredTemplates.filter(
          template => 
            template.name.toLowerCase().includes(searchLower) ||
            template.description?.toLowerCase().includes(searchLower)
        );
      }
      
      // Filter by recommended
      if (filters.showOnlyRecommended) {
        filteredTemplates = filteredTemplates.filter(
          template => template.versions.some(v => v.isRecommended)
        );
      }
      
      // Filter by latest
      if (filters.showOnlyLatest) {
        filteredTemplates = filteredTemplates.filter(
          template => template.versions.some(v => v.isLatest)
        );
      }
    }
    
    return filteredTemplates;
  } catch (error) {
    console.error("Error fetching templates:", error);
    return [];
  }
};

// Fetch template stats
export const fetchTemplateStats = async (): Promise<TemplateStats> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return MOCK_TEMPLATE_STATS;
  } catch (error) {
    console.error("Error fetching template stats:", error);
    return {
      total: 0,
      linux: 0,
      windows: 0,
      other: 0,
      recent: 0
    };
  }
};

// Fetch template by ID
export const fetchTemplateById = async (id: string): Promise<TemplateOS | null> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const template = MOCK_TEMPLATES.find(t => t.id === id);
    return template || null;
  } catch (error) {
    console.error(`Error fetching template with ID ${id}:`, error);
    return null;
  }
};

// This would be a real API integration in production
export const fetchTemplatesForVCenter = async (vCenterId: string, filters?: TemplateFilters): Promise<TemplateOS[]> => {
  // For the mock implementation, we're assuming all templates are available on all vCenters
  return fetchTemplates(filters);
};

// New function to fetch vCenter availability for a template
export const fetchVCenterAvailabilityForTemplate = async (templateId: string): Promise<VCenterAvailability[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const template = MOCK_TEMPLATES.find(t => t.id === templateId);
    return template?.vCenterAvailability || [];
  } catch (error) {
    console.error(`Error fetching vCenter availability for template ${templateId}:`, error);
    return [];
  }
};
