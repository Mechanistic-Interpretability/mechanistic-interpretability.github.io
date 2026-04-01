export interface Project {
  cover?: string;
  coverAlt?: string;
  noCrop?: boolean;
  description: string;
  links?: Record<string, string>;
}

export interface SocialLink {
  name: string;
  href: string;
  icon?: React.ComponentType<any>; // Icon components have more complex props
  isImage?: boolean;
  imageSrc?: string;
  label: string;
}

export interface FeaturedProject {
  name: string;
  description: string;
  cover: string;
  coverAlt: string;
  links: Record<string, string>;
}