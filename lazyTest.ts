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

const accumulatedFilter = (
  fn: (head: number) => (x: number) => boolean,
  lazyList: LazyList<number>
): LazyList<number> => {
  return () => {
    const list = lazyList();
    if (!!!list) return null;
    const head = list.head();
    return {
      head: () => head,
      tail: accumulatedFilter(fn, filter(fn(head), list.tail))
    }
  }
}

const primes = accumulatedFilter(head => x => (x % head !== 0), infiniteList(() => 2));

printLazyList(
  take(
    () => 100,
    primes
  )
);