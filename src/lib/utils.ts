import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes a string by removing diacritical marks (accents) and converting it to lowercase.
 * This is useful for case-insensitive comparisons or searches.
 *
 * @param text - The input string to normalize.
 * @returns The normalized string without diacritical marks and in lowercase.
 */
export function normalizeText(input: unknown): string {
  if (input == null) return '';

  // Si es array (por ejemplo ["React", "TS"]), lo unimos
  if (Array.isArray(input)) {
    return input
      .map((item) => normalizeText(item))
      .join(' ');
  }

  // Convertimos cualquier cosa a string
  const text = String(input);

  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Converts a date string to a localized date string in the 'es-MX' format.
 *
 * The returned string includes the year (numeric), month (short), and day (numeric).
 *
 * @param date - The date to format, as a string.
 * @returns The formatted date string in 'es-MX' locale.
 */
export function dateToLocaleDateString(date?: string | Date | null): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return '';
  return dateObj.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function toYMD(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;
}

/**
 * Formats working days array to a readable string with proper capitalization and accents.
 * Joins days with ", " and uses " y " before the last day.
 *
 * @param days - Array of working days in uppercase format (e.g., ['LUNES', 'MARTES'])
 * @returns Formatted string (e.g., "Lunes, Martes y Miércoles")
 */
export function formatWorkingDays(days?: string[]): string {
  if (!days || days.length === 0) return '';

  const dayMap: { [key: string]: string } = {
    'LUNES': 'Lunes',
    'MARTES': 'Martes',
    'MIERCOLES': 'Miércoles',
    'JUEVES': 'Jueves',
    'VIERNES': 'Viernes',
    'SABADO': 'Sábado',
    'DOMINGO': 'Domingo'
  };

  const formattedDays = days.map(day => dayMap[day.toUpperCase()] || day);

  if (formattedDays.length === 1) return formattedDays[0];

  const allButLast = formattedDays.slice(0, -1).join(', ');
  const last = formattedDays[formattedDays.length - 1];

  return `${allButLast} y ${last}`;
}
