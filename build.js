const { rollup } = require('rollup')
const babel = require('rollup-plugin-babel')

const files = [
  'pullToRefresh',
  ['styles/mixed/animates', 'ptrAnimatesMixed']
]

files.forEach(item => {
  let entry, name
  if (item.constructor === String) entry = name = item
  else [entry, name] = item

  rollup({
    entry: `src/${entry}.js`,
    plugins: [babel()]
  }).then(bundle => [
    bundle.write({
      dest: `dist/${entry}.js`,
      format: 'umd',
      moduleName: name
    })
  ])
})
