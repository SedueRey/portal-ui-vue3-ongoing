export interface PortalServiciosServiceCategory {
  description: string;
  disambiguatingDescription: string;
  color: string;
  logo: string;
  identifier: string;
  name: string;
}

export interface PortalServiciosBasicService {
  identifier: string;
  dateModified: string; // Formato ISO '2024-12-17T09:08:14.373Z';
  category: PortalServiciosServiceCategory[];
  adapted: string;
  visible: string;
  scion: boolean;
  sonsOfSuperCards: string[];
  updated?: number;
  complete?: boolean;
  novelty?: string;
}

// Servicio /allservicesbyuser/
export interface PortalServiciosBasicServiceResponse extends PortalServiciosBasicService {
  link: string;
}

// Son los servicios de servicios.api.js

export interface PortalServiciosServiceAudience {
  identifier: string;
  audienceType: string;
}
export interface PortalServiciosServiceAreaServed {
  identifier: string;
  name: string;
}

export interface PortalServiciosServiceResponse extends PortalServiciosBasicService {
  brand: string;
  name: string;
  description: string;
  disambiguatingDescription: string;
  logo: string;
  audience: PortalServiciosServiceAudience[];
  areaServed: PortalServiciosServiceAreaServed[];
  alternateName: string[];
  isRelatedTo: string;
  potentialAction: string;
  termsOfService: string;
  children: string[];
  searchId: number;
  novelty: string;
  _link: {
    external: {
      href: string;
    };
    self: {
      href: string;
    };
  };
}

export interface PortalServiciosSliderInfoResponse {
  sliderId: {
    key: string;
    user: string;
  };
  type: 'opened' | 'close';
  visible: '0' | '1';
  order: number;
}
