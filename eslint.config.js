import neostandard from 'neostandard'
import pluginVue from 'eslint-plugin-vue'

export default [
  { ignores: ['dist/**'] },
  ...neostandard({
    ts: true,
    env: ['browser']
  }),
  ...pluginVue.configs['flat/essential']
]
