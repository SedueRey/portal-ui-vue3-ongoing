import { apiRequest, baseApiURL } from '@/api';

const apiVersion = 'v2';

const endpoints = {
  events: `${baseApiURL}/aulavirtual/portal-api/private/${apiVersion}/getcalendar`,
};

const toDateFormat = (nonIsoDate) => {
  try {
    return nonIsoDate.substring(0, 10).split(' ')[0].split('/').reverse().join('-');
  } catch (_err) {
    return '1970-01-01';
  }
};

const timeFormat = (nonIsoDate) => {
  try {
    return nonIsoDate.split(' ')[1].slice(0, 5);
  } catch (_err) {
    return '00:00';
  }
};

export interface EventResponseDTO {
  titulo: string;
  descripcion: string;
  inicio: string;
  fin: string;
  ubicacion: string;
  localizacion: string;
  tipo: string;
  subtipo: string;
  horainicio: string;
  horafin: string;
  dia: boolean;
  date: string;
  start: string;
  end: string;
  starthour: string;
  endhour: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  elemento: any;
}

export const eventApiDTO2eventDTO = (eventsFromApi, eventsDefault: EventResponseDTO[] = []) => {
  const eventDTO = {
    titulo: '',
    descripcion: '',
    inicio: '01/01/1970 00:00',
    fin: '01/01/1970 00:00',
    ubicacion: '',
    localizacion: '',
    tipo: '',
    subtipo: '',
    elemento: null,
    horainicio: '00:00',
    horafin: '00:00',
    dia: false,
  };
  if (eventsFromApi) {
    const setEvents = new Set(
      eventsDefault
        .map((el) => JSON.stringify(el))
        .concat(
          eventsFromApi.map((el) =>
            JSON.stringify({
              ...eventDTO,
              ...el,
              date: toDateFormat(el.inicio),
              start: toDateFormat(el.inicio),
              end: toDateFormat(el.fin),
              starthour: timeFormat(el.inicio),
              endhour: timeFormat(el.fin),
            }),
          ),
        ),
    );
    return Array.from(setEvents).map((el) => JSON.parse(el));
  }
  return [];
};

export const eventsApi = {
  endpoints: () => endpoints,
  events: (from, to) => {
    const url = `${endpoints.events}?desde=${from}&hasta=${to}`;
    return apiRequest({ url });
  },
};
