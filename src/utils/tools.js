export function getQueryVariable (variable) {
  let urlParam = {}
  if (location.search) {
    var s = location.search.replace(/\//, '')
    s
      .substr(1)
      .split('&')
      .forEach((v, k, s) => {
        let param = v.split('=')
        urlParam[param[0]] = param[1]
      })
  }
  return urlParam[variable]
}
