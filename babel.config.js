module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  sourceType: 'unambiguous',
  'env': {
    'development': {
      'plugins': ['dynamic-import-node']
    }
  }
}
