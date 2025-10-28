import { defineConfig, presetIcons } from 'unocss'
import { presetWind4 } from '@unocss/preset-wind4'
import presetPrimitives from 'unocss-preset-primitives'

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons(),
    presetPrimitives()
  ]
})