export interface SearchServiceItems {
  serviceId: string;
  searchId: number;
}

export interface AreaServiceItems {
  identifier: string;
  order: number;
  category?: CardItemCategory[];
}

export interface PossibleOrders {
  i18n: string;
  key: string;
  value: string;
  disabled: boolean;
}

export interface MinimalSlider {
  sliderKey: string;
  viewType: string;
  order: number;
  visible: boolean;
}

export interface Slider extends MinimalSlider {
  howMany: string;
  loaded: boolean;
  options?: string[] | null;
  orderParams: PossibleOrders[];
  param: string;
  private: boolean;
  roleName: string[];
  scion?: boolean;
  services: AreaServiceItems[];
  smallCards: boolean;
  tag: string;
  tidy: boolean;
}

export interface SlidersDefinition {
  STARRED_SERVICES: Slider;
  NEW_SERVICES: Slider;
  RECOMMENDED: Slider;
  RECENT_SERVICES: Slider;
  MOST_USED_SERVICES: Slider;
  ALL_SERVICES: Slider;
  UMRECOMMENDED?: Slider;
}

export interface ApiumCategory {
  id: number;
  name: string;
  color: string;
}

export interface CardItemAudience {
  identifier: string;
  audienceType: string;
}

export interface CardItemAreaServed {
  identifier: string;
  name: string;
}

export interface CardItemCategory {
  description: string;
  disambiguatingDescription: string;
  color: string | null;
  logo: string;
  identifier: string;
  name: string;
}

export interface Link {
  href: string;
}

export interface LinkObject {
  external: Link;
  self: Link;
}

export interface CardChildren {
  identufier: string;
  name: string;
}

export interface CardItem {
  identifier: string;
  brand: string;
  name: string;
  description: string | null;
  disambiguatingDescription: string;
  logo: string;
  dateModified: string;
  audience: CardItemAudience[];
  areaServed: CardItemAreaServed[];
  category: CardItemCategory[];
  alternateName: string[];
  isRelatedTo: string;
  potentialAction: string;
  termsOfService: string;
  children: CardChildren[] | null;
  searchId: number;
  adapted: string;
  visible: string;
  sonsOfSuperCards: string[];
  novelty?: string;
  updated?: number;
  _link: LinkObject;
}

export interface SliderOptions {
  i18n: string;
  key: string;
  value: string;
  disabled: boolean;
}

export interface SliderConfig {
  sliderKey: string;
  sliderAction: string;
  sliderParam: string;
  options: SliderOptions[];
}
