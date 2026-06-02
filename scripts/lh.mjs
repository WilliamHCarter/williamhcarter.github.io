#!/usr/bin/env node
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const args = process.argv.slice(2);
const getFlag = (flag) => args.find(a => a.startsWith(`${flag}=`))?.split('=').slice(1).join('=') ?? null;

const baseUrl = getFlag('--url') ?? 'http://localhost:4321';
const openReport = args.includes('--open');
const mobile = args.includes('--mobile');
const pages = (getFlag('--pages') ?? '/').split(',').map(p => p.trim());

// ── Terminal colors ───────────────────────────────────────────────────────────
const c = {
  green:  s => `\x1b[32m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  red:    s => `\x1b[31m${s}\x1b[0m`,
  bold:   s => `\x1b[1m${s}\x1b[0m`,
  dim:    s => `\x1b[2m${s}\x1b[0m`,
  cyan:   s => `\x1b[36m${s}\x1b[0m`,
};

const scoreColor = n => n >= 90 ? c.green : n >= 50 ? c.yellow : c.red;
const bar = (n) => scoreColor(n)('█'.repeat(Math.round(n / 5))) + c.dim('░'.repeat(20 - Math.round(n / 5)));

// ── Check server is up ────────────────────────────────────────────────────────
async function pingServer(url, timeout = 6000) {
  const deadline = Date.now() + timeout;
  const { request } = await import('http');
  while (Date.now() < deadline) {
    const ok = await new Promise(res => {
      try {
        const req = request(url, r => { r.resume(); res(true); });
        req.on('error', () => res(false));
        req.setTimeout(1000, () => { req.destroy(); res(false); });
        req.end();
      } catch { res(false); }
    });
    if (ok) return true;
    await new Promise(r => setTimeout(r, 400));
  }
  return false;
}

// ── Lighthouse config ─────────────────────────────────────────────────────────
const desktopThrottling = {
  rttMs: 40,
  throughputKbps: 10 * 1024,
  cpuSlowdownMultiplier: 1,
  requestLatencyMs: 0,
  downloadThroughputKbps: 0,
  uploadThroughputKbps: 0,
};

const lhOptions = {
  output: ['html', 'json'],
  logLevel: 'silent',
  onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  settings: mobile
    ? { formFactor: 'mobile', throttlingMethod: 'simulate' }
    : {
        formFactor: 'desktop',
        throttlingMethod: 'simulate',
        throttling: desktopThrottling,
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
      },
};

// ── Main ──────────────────────────────────────────────────────────────────────
console.log(c.bold('\n  Lighthouse Audit'));
console.log(c.dim(`  Target : ${baseUrl}`));
console.log(c.dim(`  Mode   : ${mobile ? 'mobile' : 'desktop'} · simulated throttling`));
console.log(c.dim(`  Pages  : ${pages.join(', ')}\n`));

process.stdout.write('  Checking server  ');
const up = await pingServer(baseUrl);
if (!up) {
  console.log(c.red('✗\n'));
  console.error(`  Cannot reach ${baseUrl}`);
  console.error('  Start your server first:\n');
  console.error('    npm run dev       # then run npm run lh in a second terminal');
  console.error('    npm run preview   # after npm run build — for production-accurate scores\n');
  process.exit(1);
}
console.log(c.green('✓'));

process.stdout.write('  Launching Chrome  ');
const chrome = await chromeLauncher.launch({
  chromePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  chromeFlags: ['--headless', '--no-sandbox'],
});
console.log(c.green('✓'));

const results = [];

for (const page of pages) {
  const pageUrl = `${baseUrl}${page}`;
  process.stdout.write(`  Auditing ${page.padEnd(20)} `);
  try {
    const run = await lighthouse(pageUrl, { ...lhOptions, port: chrome.port });
    console.log(c.green('✓'));
    results.push({ page, run });
  } catch (err) {
    console.log(c.red('✗'));
    console.error(`  Error: ${err.message}`);
  }
}

await chrome.kill();

// ── Print results ─────────────────────────────────────────────────────────────
for (const { page, run } of results) {
  const { lhr, report } = run;

  const reportName = pages.length > 1
    ? `lighthouse${page.replace(/\//g, '-') || '-home'}-report.html`
    : 'lighthouse-report.html';
  const reportPath = resolve(ROOT, reportName);
  writeFileSync(reportPath, report[0]);

  const s = {
    perf: Math.round(lhr.categories.performance.score * 100),
    a11y: Math.round(lhr.categories.accessibility.score * 100),
    bp:   Math.round(lhr.categories['best-practices'].score * 100),
    seo:  Math.round(lhr.categories.seo.score * 100),
  };

  console.log(`\n  ${c.bold('─'.repeat(52))}`);
  console.log(`  ${c.bold('Page: ' + page)}`);
  console.log(`  ${'─'.repeat(52)}`);

  const row = (label, score) =>
    `  ${label.padEnd(18)} ${scoreColor(score)(String(score).padStart(3))}  ${bar(score)}`;

  console.log(row('Performance', s.perf));
  console.log(row('Accessibility', s.a11y));
  console.log(row('Best Practices', s.bp));
  console.log(row('SEO', s.seo));

  // Core Web Vitals
  const m = lhr.audits;
  const metric = (key) => m[key]?.displayValue ?? 'n/a';

  console.log(`\n  ${c.bold('Core Web Vitals')}`);
  console.log(`    FCP  ${metric('first-contentful-paint').padEnd(12)}  First Contentful Paint`);
  console.log(`    LCP  ${metric('largest-contentful-paint').padEnd(12)}  Largest Contentful Paint  ${lhr.audits['largest-contentful-paint'].score < 0.9 ? c.yellow('← common culprit') : ''}`);
  console.log(`    TBT  ${metric('total-blocking-time').padEnd(12)}  Total Blocking Time       ${lhr.audits['total-blocking-time'].score < 0.9 ? c.yellow('← JS on main thread') : ''}`);
  console.log(`    CLS  ${metric('cumulative-layout-shift').padEnd(12)}  Cumulative Layout Shift   ${lhr.audits['cumulative-layout-shift'].score < 0.9 ? c.yellow('← layout instability') : ''}`);
  console.log(`    SI   ${metric('speed-index').padEnd(12)}  Speed Index`);
  console.log(`    TTI  ${metric('interactive').padEnd(12)}  Time to Interactive`);

  // Opportunities sorted by potential savings
  const failed = Object.values(m)
    .filter(a =>
      a.score !== null &&
      a.score < 0.9 &&
      a.scoreDisplayMode !== 'informative' &&
      a.scoreDisplayMode !== 'notApplicable'
    )
    .sort((a, b) => {
      const aSav = a.details?.overallSavingsMs ?? 0;
      const bSav = b.details?.overallSavingsMs ?? 0;
      if (bSav !== aSav) return bSav - aSav;
      return (a.score ?? 1) - (b.score ?? 1);
    });

  if (failed.length > 0) {
    console.log(`\n  ${c.bold('Opportunities')} ${c.dim('(sorted by potential savings)')}`);
    for (const audit of failed) {
      const score = Math.round((audit.score ?? 0) * 100);
      const savingsMs = audit.details?.overallSavingsMs;
      const savings = savingsMs ? c.dim(` ~${Math.round(savingsMs)}ms`) : '';
      const icon = score === 0 ? c.red('✗') : c.yellow('△');
      console.log(`    ${icon} [${String(score).padStart(3)}] ${audit.title}${savings}`);
    }
  }

  // Passed audits summary
  const passed = Object.values(m).filter(a => a.score === 1).length;
  const total  = Object.values(m).filter(a => a.score !== null).length;
  console.log(`\n  ${c.dim(`${passed}/${total} audits passed`)}`);
  console.log(`  ${c.dim('Report: ' + reportPath)}`);

  if (openReport) {
    const { exec } = await import('child_process');
    exec(`open "${reportPath}"`);
  }
}

console.log();
