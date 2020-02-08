export function getQueryVariable (variable) {
  let href = window.location.href
  let arr = href.split('?')
  let query = arr[1]
  let vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] === variable) { return pair[1] }
  }
  return (false)
}
