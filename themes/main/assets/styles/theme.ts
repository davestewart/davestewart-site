// Legacy theme parser - converts SCSS variables to JavaScript object
// In Vite/Nuxt, we can't use Webpack's raw-loader, so we manually export the values
// These values are synced with _variables.scss

interface Theme {
  accentColor: string
  secondaryColor: string
  textColor: string
  borderColor: string
  codeBg: string
  footerBg: string
  grey: string
  greyLight: string
  greyLighter: string
  greyLightest: string
  widthPage: string
  widthHome: string
  titleFont: string
  bodyFont: string
  codeFont: string
  quoteFont: string
}

const theme: Theme = {
  accentColor: '#EA4848',
  secondaryColor: '#0D5C9B',
  textColor: '#2C3E50',
  borderColor: '#EAECEF',
  codeBg: '#F5F5F8',
  footerBg: '#F8F9FA',
  grey: '#969FA8',
  greyLight: '#C1C5C6',
  greyLighter: '#DCDFE4',
  greyLightest: '#EAECEF',
  widthPage: '840px',
  widthHome: '940px',
  titleFont: 'europa, sans',
  bodyFont: '\'Open Sans\', Roboto, \'SF Pro\', sans-serif',
  codeFont: '\'Roboto Mono\', monospaced',
  quoteFont: 'Sanchez, Garamond, Times, serif',
}

export default theme
