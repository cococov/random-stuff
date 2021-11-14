const fizzBuzz = (n: number): string => {
  return n % 3 === 0 || n % 5 === 0
    ? `${n % 3 === 0 ? 'Fizz' : ''}${n % 5 === 0 ? 'Buzz' : ''}`
    : String(n)
};

console.log(
  [...Array(100)].reduce<string>((acc, _curr, index) => `${acc}\n${fizzBuzz(index + 1)}`, '')
);