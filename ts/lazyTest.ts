type Lazy<T> = () => T;

type LazyList<T> = Lazy<{
  head: Lazy<T>,
  tail: LazyList<T>
} | null>;

const arrToLazyList = <T>(arr: T[]): LazyList<T> => {
  return arr.length === 0
    ? () => null
    : () => ({
      head: () => arr[0],
      tail: arrToLazyList(arr.slice(1))
    });
}

const lazyListToArrString = <T>(list: LazyList<T>, first = true): string => {
  const head = list()?.head;
  const tail = list()?.tail;
  return `${first ? '[' : !!head ? ', ' : ''}`
    + `${!!head ? head() : ''}`
    + `${!!tail ? `${lazyListToArrString(tail, false)}` : ']'}`;
}

const printLazyList = <T>(lazyList: LazyList<T>, format?: boolean): void => {
  if (format) return console.log(lazyListToArrString(lazyList));

  let list = lazyList();
  while (!!list) {
    console.log(list.head());
    list = list.tail();
  }
}


const range = (start: number, end: number): LazyList<number> => {
  return start === end
    ? () => ({
      head: () => start,
      tail: () => null
    })
    : () => ({
      head: () => start,
      tail: range(start + 1, end)
    });
}

const infiniteList = (begin: Lazy<number>): LazyList<number> => {
  return () => {
    const head = begin();
    return {
      head: () => head,
      tail: infiniteList(() => head + 1)
    };
  };
}

const take = <T>(lazyCant: Lazy<number>, lazyList: LazyList<T>): LazyList<T> => {
  return () => {
    const cant = lazyCant();
    const list = lazyList();
    return cant === 0 || !!!list
      ? null
      : {
        head: list.head,
        tail: take(() => cant - 1, list.tail)
      };
  }
}

const filter = <T>(fn: (x: T) => boolean, lazyList: LazyList<T>): LazyList<T> => {
  return () => {
    const list = lazyList();
    if (!!!list) return null;
    const head = list.head();
    return fn(head)
      ? {
        head: list.head,
        tail: filter(fn, list.tail)
      }
      : filter(fn, list.tail)();
  }
}

// source: https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes
const EratosthenesSieve = <T>(
  fn: (head: T) => (x: T) => boolean,
  lazyList: LazyList<T>
): LazyList<T> => {
  return () => {
    const list = lazyList();
    if (!!!list) return null;
    const head = list.head();
    return {
      head: () => head,
      tail: EratosthenesSieve(fn, filter(fn(head), list.tail))
    }
  }
}

const primes = EratosthenesSieve<number>(head => x => (x % head !== 0), infiniteList(() => 2));

const fibonacci = (lazyLastLast = () => BigInt(0), lazyLast = () => BigInt(1)): LazyList<bigint> => {
  return () => {
    const last = lazyLast();
    const lastLast = lazyLastLast();
    return {
      head: () => BigInt(last + lastLast),
      tail: fibonacci(() => BigInt(last), () => BigInt(last + lastLast))
    };
  };
}

const nItemLazyListFibonacci = (lazyList: LazyList<bigint>, n: number) => {
  if(n === 1 || n === 2) return 1n;

  let list = lazyList();
  for(let i = 1; i < (n-1); i++) {
    list = list.tail();
  }

  return BigInt(list.head());
}

printLazyList(
  take(
    () => 22,
    EratosthenesSieve<bigint>(head => x => (x % head !== 0n), fibonacci(() => BigInt(2), () => BigInt(3)))
  )
);