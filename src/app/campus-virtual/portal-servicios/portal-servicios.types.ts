export interface SearchServiceItems {
  serviceId: string;
  searchId: number;
}

export interface AreaServiceItems {
  identifier: string;
  order: number;
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
