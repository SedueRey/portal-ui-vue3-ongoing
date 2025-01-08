import { computed, ref, type Ref } from 'vue';
import type { CardItem } from '../portal-servicios.types';
import icons from '../models/icons';

export default function useServiceComposable() {
  const lazyService: Ref<CardItem | null> = ref(null);
  const service: Ref<CardItem | null> = ref(null);
  const filteredWords: string[] = [
    'el',
    'de',
    'del',
    'la',
    'los',
    'las',
    '-',
    'a',
    'al',
    'UMU',
    'UM',
    'un',
  ];

  const usingService = computed(() => (lazyService.value ? lazyService.value : service.value));

  const roles = computed(() => {
    if (!usingService.value) {
      return [];
    }
    return !usingService.value.audience
      ? []
      : usingService.value.audience.map(
          (x) => x.audienceType.charAt(0).toUpperCase() + x.audienceType.slice(1),
        );
  });

  const categoryData = computed(() => {
    if (!usingService.value) {
      return '';
    }
    return usingService.value.category && usingService.value.category.length > 0
      ? usingService.value.category.map((el) => el.name).join(', ')
      : '';
  });

  const areasServed = computed(() => {
    if (!usingService.value) {
      return [];
    }
    return !usingService.value.areaServed
      ? []
      : usingService.value.areaServed
          .map(
            (el) => `<span
              itemscope
              itemtype="http://schema.org/AdministrativeArea"
            >
              <span itemprop="name">${el.name}</span>`,
          )
          .join(', ');
  });

  const isEmptyCard = computed(() => {
    return typeof usingService.value?.name === 'undefined';
  });

  const services = computed(() => {
    if (!usingService.value) {
      return [];
    }
    return !usingService.value.audience
      ? []
      : usingService.value.audience.map(
          (x) => x.audienceType.charAt(0).toUpperCase() + x.audienceType.slice(1),
        );
  });

  const externalUrl = computed(() => {
    if (!usingService.value) {
      return '#';
    }
    try {
      const linkPattern = '_link';
      let url = usingService.value[linkPattern].external.href;
      if (url.startsWith('https%3A%2F%2F') || url.startsWith('http%3A%2F%2F')) {
        url = decodeURIComponent(url);
      }
      const protocol = url.startsWith('http') ? '' : '//';
      if (url.indexOf(window._env_.POSE_API_URL) > -1) {
        url = url.replace(window._env_.POSE_API_URL, '');
      }
      return `${protocol}${url}`;
    } catch (_e) {
      return '#';
    }
  });

  const getClass = computed(() => {
    if (!usingService.value) {
      return '';
    }
    const categoryIdentifier =
      usingService.value.category && usingService.value.category.length > 0
        ? usingService.value.category.map((el) => el.identifier).join('')
        : '0';
    const classEmpty = isEmptyCard.value ? 'card__is_empty' : '';
    return `is__catIdentifier__${categoryIdentifier} ${classEmpty}`;
  });

  const itemIcon = computed(() => {
    if (!usingService.value) {
      return '';
    }
    const idTemp = parseInt(usingService.value.identifier.split('_')[0], 10);
    const charValue = usingService.value.name.charCodeAt(0);
    return icons[(charValue + idTemp) % icons.length];
  });

  const itemInitials = computed(() => {
    if (!usingService.value) {
      return '';
    }
    const words = usingService.value.name
      ? usingService.value.name.split(' ').filter((el) => !filteredWords.includes(el))
      : '';
    if (words.length >= 2) {
      return words[0].substr(0, 1).toUpperCase() + words[1].substr(0, 1).toUpperCase();
    }
    return usingService.value.name ? usingService.value.name.substr(0, 2).toUpperCase() : '';
  });

  const orderedChildren = computed(() => {
    if (!usingService.value) {
      return [];
    }
    const children = usingService.value.children ? [...usingService.value.children] : [];
    if (children.length > 0) {
      return children.sort((a, b) => a.name.localeCompare(b.name));
    }
    return [];
  });

  const cleanedHTML = computed(() => {
    if (!usingService.value) {
      return '';
    }
    const doc = document.createElement('body');
    doc.innerHTML = usingService.value.description || '';
    const tags = doc.getElementsByTagName('*');
    for (let i = tags.length - 1; i >= 0; i -= 1) {
      const tag: HTMLElement = tags[i] as HTMLElement;
      tag.removeAttribute('style');
      if (typeof tag.innerText === 'string') {
        if (tag.innerText.trim() === '') {
          tag.remove();
        }
      }
    }
    return doc.innerHTML.replace(/&nbsp;/g, ' ').replace(/\s\s+/g, ' ');
  });

  const cleanedPotentialAction = computed(() => {
    if (!usingService.value) {
      return '';
    }
    const doc = document.createElement('body');
    doc.innerHTML = usingService.value.potentialAction || '';
    const tags = doc.getElementsByTagName('*');
    for (let i = tags.length - 1; i >= 0; i -= 1) {
      const tag: HTMLElement = tags[i] as HTMLElement;
      tag.removeAttribute('style');
      if (typeof tag.innerText === 'string') {
        if (tag.innerText.trim() === '') {
          tag.remove();
        }
      }
    }
    return doc.innerHTML.replace(/&nbsp;/g, ' ').replace(/\s\s+/g, ' ');
  });

  const descriptionCutted = computed(() => {
    if (!usingService.value) {
      return '';
    }
    const MAX_LENGTH = 50;
    const trimmedString = usingService.value.disambiguatingDescription.substr(0, MAX_LENGTH);
    return usingService.value.disambiguatingDescription.length < MAX_LENGTH
      ? usingService.value.disambiguatingDescription
      : `${trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')))}&#8230;`;
  });

  const normalizeStr = (str) => {
    return !str
      ? ''
      : str
          .toLowerCase()
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .replace(/ /g, '-');
  };

  return {
    lazyService,
    service,
    usingService,
    roles,
    categoryData,
    areasServed,
    isEmptyCard,
    services,
    externalUrl,
    getClass,
    itemIcon,
    itemInitials,
    orderedChildren,
    cleanedHTML,
    cleanedPotentialAction,
    descriptionCutted,
    normalizeStr,
  };
}
