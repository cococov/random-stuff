const pageDigits = pages => {
  const strPages = String(pages);
  const length = BigInt(strPages.length);
  const lastNumberWithLessDigits = BigInt(strPages.slice(1).replace(/\d/g, '9'));
  const maxRange = BigInt(pages - lastNumberWithLessDigits)
  const digitsUntilLastNumberWithLessDigits = String(lastNumberWithLessDigits).split('').reduce((acc, curr, index) => {
    return curr === '9'
      ? acc + (10n ** BigInt(index)) * 9n * (BigInt(index) + 1n)
      : 0n;
  }, 0n);
  return length * maxRange + digitsUntilLastNumberWithLessDigits
}

const asd = pageDigits(12n);

/**

1~9 -> 9
10~99 -> 90
100~999 -> 900

1 * 9 * 10**0 + 2 * 9 * 10**1

!l * 9 * ()
 */

asd