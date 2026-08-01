/**
 * GamePlearn — ตัวตัด path prefix สำหรับเสิร์ฟเกมใต้ subpath
 * ============================================================================
 * ปัญหา: Cloudflare จะหาไฟล์ตาม path เต็ม — ขอ /kan-adventure/index.html
 *        แต่ไฟล์จริงอยู่ที่ /index.html จึงหาไม่เจอ
 * ทางแก้ตามเอกสาร Cloudflare คือย้ายไฟล์ไปไว้ในโฟลเดอร์ kan-adventure/
 *        แต่ index.html ของเกมใหญ่ 3.3 MB ซึ่งแก้/ย้ายผ่านหน้าเว็บ GitHub ไม่ได้
 * ไฟล์นี้จึงตัดคำนำหน้าออกให้แทน — ไฟล์เกมอยู่ที่เดิม ไม่ต้องแตะต้องเลย
 *
 * ใช้คู่กับ wrangler.jsonc ที่มี "main": "worker.js" และ assets.binding = "ASSETS"
 *
 * ★ เกมใหม่: แก้ค่า PREFIX บรรทัดเดียวให้ตรงกับ path ของเกมนั้น
 */

const PREFIX = '/kan-adventure';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === PREFIX || url.pathname === PREFIX + '/') {
      // /kan-adventure และ /kan-adventure/ → หน้าแรกของเกม
      url.pathname = '/index.html';
    } else if (url.pathname.startsWith(PREFIX + '/')) {
      // /kan-adventure/dashboard.html → /dashboard.html
      url.pathname = url.pathname.slice(PREFIX.length);
    }

    return env.ASSETS.fetch(new Request(url, request));
  },
};
