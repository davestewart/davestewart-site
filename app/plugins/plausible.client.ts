export default defineNuxtPlugin(() => {
  if (window.location.host === 'davestewart.co.uk') {
    useHead({
      script: [{
        'src': '/stats/js/events.js',
        'data-domain': 'davestewart.co.uk',
        'data-api': '/stats/api/event/',
        'async': true,
        'defer': true,
      }],
    })
  }
})
