export function useDate() {
  const toDateFormat = (nonIsoDate: string) => {
    try {
      return nonIsoDate.substring(0, 10).split(' ')[0].split('/').reverse().join('-');
    } catch (_err) {
      return '1970-01-01';
    }
  };

  const timeFormat = (nonIsoDate: string) => {
    try {
      return nonIsoDate.split(' ')[1].slice(0, 5);
    } catch (_err) {
      return '00:00';
    }
  };

  const fromDateToISO = (date: Date) => {
    return new Date(date)
      .toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .split('/')
      .reverse()
      .join('-');
  };

  const isToday = (someDate: Date) => {
    const today = new Date();
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
  };

  const fromDateToEU = (value: string) => {
    return new Date(value).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const fromDateToEUMonthDay = (value: string) => {
    return new Date(value).toLocaleDateString('es-ES', {
      month: 'short',
      day: '2-digit',
    });
  };

  const fromDateToEULongMonthDay = (value: string) => {
    return new Date(value).toLocaleDateString('es-ES', {
      month: 'long',
      day: '2-digit',
    });
  };

  return {
    toDateFormat,
    timeFormat,
    fromDateToISO,
    isToday,
    fromDateToEU,
    fromDateToEUMonthDay,
    fromDateToEULongMonthDay,
  };
}
