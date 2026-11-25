import { SUPPORTED_CURRENCIES } from '../constants/currency';

export function formatCurrency(
  amount: number,
  currencyCode: string = 'IDR',
  options: { showSymbol?: boolean; hideZeroDecimals?: boolean } = {}
): string {
  const { showSymbol = true } = options;
  const config = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.IDR;

  const formattedNumber = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: config.decimalDigits,
    maximumFractionDigits: config.decimalDigits,
  }).format(Math.abs(amount));

  const sign = amount < 0 ? '-' : '';

  if (!showSymbol) {
    return `${sign}${formattedNumber}`;
  }

  return config.symbolPlacement === 'before'
    ? `${sign}${config.symbol} ${formattedNumber}`
    : `${sign}${formattedNumber} ${config.symbol}`;
}

export function parseCurrencyInput(
  value: string,
  options: { allowNegative?: boolean; allowDecimals?: boolean } = {}
): number {
  const { allowNegative = false, allowDecimals = false } = options;
  if (!value) return 0;

  const trimmed = value.trim();
  const isNegative = allowNegative && trimmed.startsWith('-');

  if (allowDecimals) {
    // Normalisasi koma menjadi titik jika ada bagian desimal
    const normalized = trimmed.replace(/[^0-9.,]/g, '').replace(',', '.');
    const parsed = parseFloat(normalized);
    if (Number.isNaN(parsed)) return 0;
    return isNegative ? -Math.abs(parsed) : Math.abs(parsed);
  }

  const clean = trimmed.replace(/[^0-9]/g, '');
  const parsed = clean ? parseInt(clean, 10) : 0;
  return isNegative ? -parsed : parsed;
}
