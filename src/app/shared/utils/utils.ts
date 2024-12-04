const isMobile = (): boolean => {
  const valueSassVarBreakpoint = window
    .getComputedStyle(document.body)
    .getPropertyValue('--mobile-menu-size')
    .replace('px', '');
  return window.outerWidth < parseInt(valueSassVarBreakpoint, 10);
};

const dateToInt = (a: string | undefined = undefined): number => {
  const date = a !== undefined ? a : '01/01/1970 00:00:00';
  let intA = 0;
  if (date.indexOf(' ') !== -1) {
    intA = parseInt(
      `${date.split(' ')[0].split('/').reverse().join('')}${date
        .split(' ')[1]
        .split(':')
        .join('')}`,
      10,
    );
  }
  return isNaN(intA) ? 0 : intA;
};

const linkify = (inputText, anchor = '', target = '_blank') => {
  let replacedText;
  let anchorLink;

  // URLs starting with http://, https://, or ftp://
  const replacePatternProtocol =
    /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
  anchorLink = anchor === '' ? '$1' : anchor;
  replacedText = inputText.replace(
    replacePatternProtocol,
    `<a href="$1" target="${target}">${anchorLink}</a>`,
  );

  // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  const replacePatternWeb = /(^|[^/])(www\.[\S]+(\b|$))/gim;
  anchorLink = anchor === '' ? '$2' : anchor;
  replacedText = replacedText.replace(
    replacePatternWeb,
    `$1<a href="https://$2" target="${target}">${anchorLink}</a>`,
  );

  // Change email addresses to mailto:: links.
  const replacePatternMail = /(([a-zA-Z0-9\-_.])+@[a-zA-Z_]+?(\.[a-zA-Z]{2,6})+)/gim;
  anchorLink = anchor === '' ? '$1' : anchor;
  replacedText = replacedText.replace(replacePatternMail, `<a href="mailto:$1">${anchorLink}</a>`);

  return replacedText;
};

const timeDiffCalc = (dateFuture, dateNow) => {
  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;
  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;
  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;
  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;
  // calculate seconds
  const seconds = Math.floor(diffInMilliSeconds);
  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

const nowUTC = () => {
  const now = new Date();
  return Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
    now.getUTCMilliseconds(),
  );
};

const isValidSpanishID = (dniO) => {
  const expresionRegularDNI = /^[XYZ]?\d{5,8}[A-Z]$/;
  const dni = dniO.toUpperCase();
  if (expresionRegularDNI.test(dni) === true) {
    let numero = dni.substr(0, dni.length - 1);
    numero = numero.replace('X', 0);
    numero = numero.replace('Y', 1);
    numero = numero.replace('Z', 2);
    const control = dni.substr(dni.length - 1, 1);
    numero %= 23;
    let letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
    letra = letra.substring(numero, numero + 1);
    return letra === control;
  }
  return false;
};

const getRandomNumberBetweenRange = (min = 0, max = 100) =>
  Math.floor(Math.random() * (max - min)) + min;

const percentageIsGreater = (value) => value >= getRandomNumberBetweenRange();

const formatFecha = (fechaStr) => {
  const fecha = new Date(fechaStr);
  return `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
};

const formatImporte = (importe) => {
  // String con dos decimales
  const importeStr = importe.toFixed(2).toString();
  // Separamos parte entera y decimales
  const partes = importeStr.split('.');
  // Formateamos la parte entera agregando puntos cada 3 dígitos
  const parteEntera = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  // Unimos la parte entera y la decimal (si existe) usando una coma
  return `${parteEntera + (partes[1] ? `,${partes[1]}` : '')} €`;
};

export {
  percentageIsGreater,
  dateToInt,
  getRandomNumberBetweenRange,
  isMobile,
  isValidSpanishID,
  linkify,
  nowUTC,
  timeDiffCalc,
  formatFecha,
  formatImporte,
};
