export function removeAll(array, predicate) {
  let next = 0;
  let last = 0;
  let kept = 0;
  for (let next = 0; next < array.length; ++next) {
    if (predicate(array[next])) {
    } else if (next > last) {
      array[last++] = array[next];
      ++kept;
    } else {
      ++last;
      ++kept;
    }
  }
  array.length = kept;
}
