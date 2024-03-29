import { enUs, zhCn, zhTw } from '@/i18n'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'enUs',
  messages: {
    enUs,
    zhCn,
    zhTw,
  },
}))
