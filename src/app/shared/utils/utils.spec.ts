import {
  dateToInt,
  formatFecha,
  formatImporte,
  getRandomNumberBetweenRange,
  isValidSpanishID,
  linkify,
  nowUTC,
  percentageIsGreater,
  timeDiffCalc,
} from './utils';
import { describe, expect, it, vi } from 'vitest';
import Chance from 'chance';

const chance = new Chance();

describe('Testing utility functions', () => {
  describe('Testing nowUTC', () => {
    const mockDate = new Date('2019-05-14T11:01:58.135Z');
    const spy = vi.spyOn(global, 'Date').mockImplementation(() => mockDate);

    it('shoud shorcut UTC date function', () => {
      const now = new Date();
      const value = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
        now.getUTCMilliseconds(),
      );
      expect(nowUTC()).toBeGreaterThanOrEqual(value);
    });

    spy.mockRestore();
  });

  describe('Testing timeDiffCalc', () => {
    it('show the difference between two dates', () => {
      const future = new Date(2023, 2, 1);
      const past = new Date(2020, 2, 1);
      expect(timeDiffCalc(future, past)).toMatchObject({
        days: 1095,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      expect(timeDiffCalc(past, future)).toMatchObject({
        days: 1095,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    });
  });

  describe('Testing linkify', () => {
    it('should return a link if a text has a http(s) starting URL', () => {
      expect(linkify('http://www.um.es')).toBe(
        '<a href="http://www.um.es" target="_blank">http://www.um.es</a>',
      );
      expect(linkify('http://www.um.es', 'link')).toBe(
        '<a href="http://www.um.es" target="_blank">link</a>',
      );
      expect(linkify('http://www.um.es', 'link', '_self')).toBe(
        '<a href="http://www.um.es" target="_self">link</a>',
      );
      expect(linkify('https://www.um.es')).toBe(
        '<a href="https://www.um.es" target="_blank">https://www.um.es</a>',
      );
      expect(linkify('https://www.um.es', 'link')).toBe(
        '<a href="https://www.um.es" target="_blank">link</a>',
      );
      expect(linkify('https://www.um.es', 'link', '_self')).toBe(
        '<a href="https://www.um.es" target="_self">link</a>',
      );
    });

    it('should return a link when URLs starting with "www."', () => {
      expect(linkify('www.um.es')).toBe(
        '<a href="https://www.um.es" target="_blank">www.um.es</a>',
      );
      expect(linkify('www.um.es', 'link')).toBe(
        '<a href="https://www.um.es" target="_blank">link</a>',
      );
      expect(linkify('www.um.es', 'link', '_self')).toBe(
        '<a href="https://www.um.es" target="_self">link</a>',
      );
    });

    it('Change email addresses to mailto:: links', () => {
      expect(linkify('no-reply@um.es')).toBe('<a href="mailto:no-reply@um.es">no-reply@um.es</a>');
      expect(linkify('no-reply@um.es', 'contact me')).toBe(
        '<a href="mailto:no-reply@um.es">contact me</a>',
      );
    });
  });

  describe('Testing dateToInt function', () => {
    it('should render a date as a int, for sorting and compare', () => {
      expect(dateToInt()).toBe(19700101000000);
      expect(dateToInt('10/01/2021 13:35')).toBe(202101101335);
      expect(dateToInt('10/01/2021 25:35')).toBe(202101102535);
    });
  });

  const digitControlNIECalculator = (dni): string => {
    const dniAsNumber = parseInt(dni, 10);
    const possibleControlDigit = 'TRWAGMYFPDXBNJZSQVHLCKET';
    const digitControlIndex = dniAsNumber % 23;
    return possibleControlDigit.substring(digitControlIndex, digitControlIndex + 1);
  };

  describe('Testing isValidSpanishID function', () => {
    describe('Testing isValidSpanishID function', () => {
      it('should validate spanish ids', () => {
        expect(isValidSpanishID('')).toBe(false);
        expect(isValidSpanishID('1A')).toBe(false);
        expect(isValidSpanishID('patata')).toBe(false);
        expect(isValidSpanishID('112233445X')).toBe(false);
        expect(isValidSpanishID('11223344sX')).toBe(false);
        expect(isValidSpanishID('X0523821F')).toBe(false);
        expect(isValidSpanishID('Y8237411K')).toBe(true);
        expect(isValidSpanishID('X1837261K')).toBe(true);
        expect(isValidSpanishID('X1333617P')).toBe(true);
        expect(isValidSpanishID('Y8992889H')).toBe(true);
        expect(isValidSpanishID('Y8988875Y')).toBe(true);
      });
    });

    describe('Testing isValidSpanishID function', () => {
      const validValues: string[] = [];
      for (let i = 0; i < 20; i += 1) {
        const dni = chance.string({ length: 8, pool: '012345678' });
        const expectNIF = `${dni}${digitControlNIECalculator(dni)}`;
        validValues.push(expectNIF);
      }
      validValues.forEach((nif) => {
        it(`should validate spanish ids ${nif}`, () => {
          expect(isValidSpanishID(nif)).toBe(true);
        });
      });
    });
  });

  describe('Testing getRandomNumberBetweenRange function', () => {
    it('should return a number between 0 and 100 by default', () => {
      for (let i = 0; i < 100; i += 1) {
        expect(getRandomNumberBetweenRange()).toBeGreaterThanOrEqual(0);
        expect(getRandomNumberBetweenRange()).toBeLessThanOrEqual(100);
      }
    });
    it('should return a number between min and max', () => {
      for (let i = 0; i < 100; i += 1) {
        for (let j = i; j < i + 100; j += 1) {
          expect(getRandomNumberBetweenRange(i, j)).toBeGreaterThanOrEqual(i);
          expect(getRandomNumberBetweenRange(i, j)).toBeLessThanOrEqual(j);
        }
      }
    });
  });

  describe('Testing percentageIsGreater function', () => {
    it('should return true when is 100%', () => {
      expect(percentageIsGreater(100)).toBe(true);
      expect(percentageIsGreater(0)).toBe(false);
    });
  });
});

describe('testing date format', () => {
  it('should have object structure', async () => {
    expect(formatFecha(new Date('1995-12-17T03:24:00'))).toBe('17/12/1995');
  });
});

describe('testing time format', () => {
  it('should have object structure', async () => {
    expect(formatImporte(12.2)).toBe('12,20 €');
    expect(formatImporte(12.23)).toBe('12,23 €');
    expect(formatImporte(12.223)).toBe('12,22 €');
    expect(formatImporte(1246.226)).toBe('1.246,23 €');
    expect(formatImporte(12)).toBe('12,00 €');
  });
});
