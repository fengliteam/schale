
// Han Analytics 统计
import SITE_INFO from "@/config";
import { LoadScript } from "@/utils/index";

export default async () => {
  const { HanAnalytics } = SITE_INFO;
  HanAnalytics.enable && LoadScript(`${HanAnalytics.server}/tracker.min.js`, [{ k: "data-website-id", v: HanAnalytics.siteId }]);
}