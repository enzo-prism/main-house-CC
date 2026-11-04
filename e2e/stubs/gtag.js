(function stubGtag() {
  var endpoint = 'https://www.google-analytics.com/g/collect'
  window.dataLayer = window.dataLayer || []

  function isArguments(entry) {
    return Object.prototype.toString.call(entry) === '[object Arguments]'
  }

  function measurementId() {
    for (var i = 0; i < window.dataLayer.length; i += 1) {
      var entry = window.dataLayer[i]
      if (!isArguments(entry)) continue
      if (entry[0] === 'config' && typeof entry[1] === 'string') return entry[1]
    }
    return ''
  }

  function paramsFrom(entry) {
    if (!isArguments(entry)) return null
    var list = Array.prototype.slice.call(entry)
    if (list[0] !== 'event' || list[1] !== 'page_view') return null
    var tid = measurementId()
    if (!tid) return null
    var payload = list[2] && typeof list[2] === 'object' ? list[2] : {}
    return {
      v: '2',
      tid: tid,
      en: 'page_view',
      dl: payload.page_location || location.origin + location.pathname,
      dp: payload.page_path || location.pathname,
      dt: payload.page_title || document.title,
    }
  }

  function sendCollect(params) {
    var query = new URLSearchParams(params).toString()
    fetch(endpoint + '?' + query, { method: 'POST', mode: 'no-cors', keepalive: true })
  }

  function handle(entry) {
    var params = paramsFrom(entry)
    if (params) sendCollect(params)
  }

  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
    handle(arguments)
  }

  for (var i = 0; i < window.dataLayer.length; i += 1) {
    handle(window.dataLayer[i])
  }
})()
