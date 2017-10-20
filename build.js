const { rollup } = require('rollup')
const babel = require('rollup-plugin-babel')

const files = [
  'pullToRefresh',
  ['styles/material/animates', 'ptrAnimatesMaterial'],
  ['styles/material2/animates', 'ptrAnimatesMaterial2'],
  ['styles/ios/animates', 'ptrAnimatesIos']
]

files.forEach(item => {
  let entry, name
  if (item.constructor === String) entry = name = item
  else [entry, name] = item

  rollup({
    input: `src/${entry}.js`,
    plugins: [babel()]
  }).then(bundle => [
    bundle.write({
      file: `dist/${entry}.js`,
      format: 'umd',
      name
    })
  ])
})
