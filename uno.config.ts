import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  rules: [
    ['m-1', { margin: '1px' }],
    [
      'flex-c-c',
      {
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
      },
    ],
  ],
  presets: [
    presetUno(),
    presetIcons(),
    presetAttributify({
      // prefix: 'un-',
      // prefixedOnly: true,
      ignoreAttributes: [],
    }),
  ],
})
