// rounds an integer to the provided number of places without
// the floating point decimals issue.

// Usage:
// round(1.275, 2);               // Returns 1.28
// round(1.27499, 2);       // Returns 1.27
// round(1234.5678, -2);        // Returns 1200
// round(1.2345678e+2, 2);    // Returns 123.46
// round("123.45");             // Returns 123
// round(10.8034, 2).toFixed(2);  // Returns "10.80"
// round(10.8, 2).toFixed(2);     // Returns "10.80"
export function round(value, exp) {
  if (typeof exp === 'undefined' || +exp === 0) return Math.round(value);

  value = +value;
  exp = +exp;

  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) return NaN;

  // Shift
  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? +value[1] + exp : exp)));

  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp));
}

export function roundToThreeDigits(value) {
  switch (true) {
    case value >= 10 && value < 100:
      return round(value, 1).toFixed(1);
    case value >= 100:
      return round(value);
    default:
      return round(value, 2).toFixed(2);
  }
}
