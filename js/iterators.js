// sieve of Eratosthenes
function* primes(n) {
  let arr = Array(n + 1).fill(true);
  arr[0], arr[1] = false;

  for(let i = 2; i <= n; i++) {
    if (arr[i]) {
      yield i;
      if(i <= Math.sqrt(n)){
        for(let j = i * i; j <= n; j += i) {
          arr[j] = false;
        }
      }
    }
  }
}

for(const a of primes(100)){
  console.log(a);
}
