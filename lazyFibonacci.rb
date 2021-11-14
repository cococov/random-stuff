def nItemLazyList lazyList, n
  return  1 if(n == 1 || n == 2)

  list = lazyList.()
  (n - 2).times do
    list = list[:tail].()
  end

  list[:head].()
end

def fibonacci(lazyLastLast = -> {0}, lazyLast = -> {1})
  -> do
    last = lazyLast.()
    lastLast = lazyLastLast.()
    {
      head: -> { last + lastLast },
      tail: fibonacci(-> { last }, -> { last + lastLast })
    }
  end
end

p(nItemLazyList(fibonacci(), 1) % 10)
p(nItemLazyList(fibonacci(), 2) % 10)
p(nItemLazyList(fibonacci(), 3) % 10)
p(nItemLazyList(fibonacci(), 4) % 10)
p(nItemLazyList(fibonacci(), 5) % 10)
p(nItemLazyList(fibonacci(), 6) % 10)
p(nItemLazyList(fibonacci(), 7) % 10)
p(nItemLazyList(fibonacci(), 21) % 10)
p(nItemLazyList(fibonacci(), 302) % 10)
p(nItemLazyList(fibonacci(), 4003) % 10)
p(nItemLazyList(fibonacci(), 50004) % 10)
p(nItemLazyList(fibonacci(), 600005) % 10)