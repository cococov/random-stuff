// Try this later:
// https://gist.github.com/donnut/fd56232da58d25ceecf1

const add = (a: number, b?: number): any => {
  return !!b
    ? a + b
    : (b: number): number => a + b;
}


console.log(add(1)(2)); // 3
console.log(add(1)); // (a: number):number => a + 1
console.log(add(1, 2)); // 3
