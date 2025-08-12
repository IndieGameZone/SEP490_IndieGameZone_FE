export function formatCurrencyVND(amount: unknown): string {
    try {
      if (amount == null || typeof amount !== 'number' || !isFinite(amount)) {
        return '0₫';
      }
  
      const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
  
      return formatter.format(amount);
    } catch {
      return '0₫';
    }
  }
  