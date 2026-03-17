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
  if (window.location.host.includes('davestewart.io')) {
    useHead({
      script: [
        {
          src: 'https://plausible.io/js/pa-Wvehpt8QAWyNFL6Rw9y67.js',
          async: true,
        },
        {
          innerHTML: 'window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}}; plausible.init()',
        },
      ],
    })
  }
})
