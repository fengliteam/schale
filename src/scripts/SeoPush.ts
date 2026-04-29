import SITE_INFO from '@/config'
import { $POST } from '@/utils/index'
export default async () => {
  if (!SITE_INFO.SeoPush.enable) return;
  await $POST(SITE_INFO.SeoPush.serverApi, { [SITE_INFO.SeoPush.paramsName]: window.location.href.replace(/\/$/, '') }, { 'Content-Type': 'application/json; charset=utf-8' })
}