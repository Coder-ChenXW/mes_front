export function even_array_generator(number) {
  const arr = []
  for (let i = 0; i < number; i++) {
    if (i % 2 !== 0) continue
    arr.push(i)
  }
  console.log(arr)
  return arr
}
