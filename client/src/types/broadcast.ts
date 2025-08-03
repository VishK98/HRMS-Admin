export interface Designation {
  _id: string;
  name: string;
  description?: string;
  level?: number;
  department?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  _id?: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Department {
  _id: string;
  name: string;
  description?: string;
  manager?: string;
  subCategories?: SubCategory[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Holiday {
  _id: string;
  name: string;
  date: string;
  description?: string;
  type: "public" | "company" | "optional";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: "general" | "important" | "urgent" | "info";
  targetAudience: "all" | "department" | "designation" | "specific";
  targetIds?: string[];
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BroadcastFilters {
  searchTerm: string;
  statusFilter: "all" | "active" | "inactive";
  typeFilter?: string;
} 