import fs from 'node:fs';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Combination {
  theme: string;
  relief: string;
  finish: string;
  ornament: string;
}

interface Violation {
  id: string;
  help: string;
  impact: string | null;
  nodes: unknown[];
}

interface RawResult {
  combination: Combination;
  label: string;
  timestamp: string;
  violations: Violation[];
  counts: {
    violations: number;
    passes: number;
    incomplete: number;
    inapplicable: number;
  };
}

interface TierValueStats {
  value: string;
  combos: number;
  passing: number;
  passRate: number;
  avgViolations: number;
  severityScore: number;
}

interface ComboSummary {
  label: string;
  combination: Combination;
  violationCount: number;
  severityScore: number;
  topIssues: string[];
}

// ---------------------------------------------------------------------------
// Severity weights
// ---------------------------------------------------------------------------

const SEVERITY_WEIGHT: Record<string, number> = {
  critical: 4,
  serious: 3,
  moderate: 2,
  minor: 1,
};

function severityScore(violations: Violation[]): number {
  return violations.reduce((sum, v) => {
    const weight = SEVERITY_WEIGHT[v.impact ?? 'minor'] ?? 1;
    return sum + weight * v.nodes.length;
  }, 0);
}

// ---------------------------------------------------------------------------
// Tier health computation
// ---------------------------------------------------------------------------

type TierName = 'theme' | 'relief' | 'finish' | 'ornament';

function computeTierHealth(results: RawResult[], tier: TierName): TierValueStats[] {
  const buckets = new Map<
    string,
    { total: number; passing: number; violations: number; severity: number }
  >();

  for (const r of results) {
    const value = r.combination[tier];
    let bucket = buckets.get(value);
    if (!bucket) {
      bucket = { total: 0, passing: 0, violations: 0, severity: 0 };
      buckets.set(value, bucket);
    }
    bucket.total++;
    if (r.counts.violations === 0) bucket.passing++;
    bucket.violations += r.counts.violations;
    bucket.severity += severityScore(r.violations);
  }

  return [...buckets.entries()]
    .map(([value, b]) => ({
      value,
      combos: b.total,
      passing: b.passing,
      passRate: b.total > 0 ? b.passing / b.total : 0,
      avgViolations: b.total > 0 ? b.violations / b.total : 0,
      severityScore: b.severity,
    }))
    .sort((a, b) => b.passRate - a.passRate || a.severityScore - b.severityScore);
}

// ---------------------------------------------------------------------------
// Common violations
// ---------------------------------------------------------------------------

function computeCommonViolations(
  results: RawResult[]
): { rule: string; help: string; count: number }[] {
  const freq = new Map<string, { help: string; count: number }>();

  for (const r of results) {
    for (const v of r.violations) {
      const entry = freq.get(v.id);
      if (entry) {
        entry.count++;
      } else {
        freq.set(v.id, { help: v.help, count: 1 });
      }
    }
  }

  return [...freq.entries()]
    .map(([rule, { help, count }]) => ({ rule, help, count }))
    .sort((a, b) => b.count - a.count);
}

// ---------------------------------------------------------------------------
// Markdown generation
// ---------------------------------------------------------------------------

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function generateMarkdown(
  results: RawResult[],
  blessed: ComboSummary[],
  worst: ComboSummary[],
  tierHealth: Record<TierName, TierValueStats[]>,
  commonViolations: { rule: string; help: string; count: number }[]
): string {
  const total = results.length;
  const passing = results.filter((r) => r.counts.violations === 0).length;
  const totalViolations = results.reduce((s, r) => s + r.counts.violations, 0);

  const lines: string[] = [];
  const ln = (s = '') => lines.push(s);

  ln('# Accessibility Scorecard');
  ln();
  ln(`> Generated: ${new Date().toISOString()}`);
  ln();

  // Summary
  ln('## Summary');
  ln();
  ln(`| Metric | Value |`);
  ln(`| --- | --- |`);
  ln(`| Total combinations | ${total} |`);
  ln(`| Passing (zero violations) | ${passing} |`);
  ln(`| Pass rate | ${pct(total > 0 ? passing / total : 0)} |`);
  ln(`| Total violations | ${totalViolations} |`);
  ln();

  // Tier Health
  const tierLabels: Record<TierName, string> = {
    theme: 'Theme',
    relief: 'Relief',
    finish: 'Finish',
    ornament: 'Ornament',
  };

  ln('## Tier Health');
  ln();

  for (const tier of ['theme', 'relief', 'finish', 'ornament'] as TierName[]) {
    const stats = tierHealth[tier];
    ln(`### ${tierLabels[tier]}`);
    ln();
    ln('| Value | Combos | Passing | Pass Rate | Avg Violations | Severity Score |');
    ln('| --- | ---: | ---: | ---: | ---: | ---: |');
    for (const s of stats) {
      ln(
        `| ${s.value} | ${s.combos} | ${s.passing} | ${pct(s.passRate)} | ${s.avgViolations.toFixed(2)} | ${s.severityScore} |`
      );
    }
    ln();
  }

  // Blessed Combinations
  ln('## Blessed Combinations');
  ln();
  if (blessed.length === 0) {
    ln('No combinations achieved zero violations.');
  } else {
    ln(`${blessed.length} combination(s) with zero violations:`);
    ln();
    ln('| Theme | Relief | Finish | Ornament |');
    ln('| --- | --- | --- | --- |');
    for (const b of blessed) {
      const c = b.combination;
      ln(`| ${c.theme} | ${c.relief} | ${c.finish} | ${c.ornament} |`);
    }
  }
  ln();

  // Worst Combinations
  ln('## Worst Combinations');
  ln();
  ln('Top 10 by violation count:');
  ln();
  ln('| Combination | Violations | Severity | Top Issues |');
  ln('| --- | ---: | ---: | --- |');
  for (const w of worst) {
    ln(
      `| ${w.label} | ${w.violationCount} | ${w.severityScore} | ${w.topIssues.join(', ') || 'n/a'} |`
    );
  }
  ln();

  // Common Violations
  ln('## Most Common Violations');
  ln();
  if (commonViolations.length === 0) {
    ln('No violations found across the matrix.');
  } else {
    ln('| Rule | Description | Affected Combos |');
    ln('| --- | --- | ---: |');
    for (const v of commonViolations.slice(0, 20)) {
      ln(`| ${v.rule} | ${v.help} | ${v.count} |`);
    }
  }
  ln();

  // Flagged Tier Values
  ln('## Flagged Tier Values');
  ln();
  ln('Tier values with pass rate below 90%:');
  ln();

  const flagged: { tier: string; value: string; passRate: number }[] = [];
  for (const tier of ['theme', 'relief', 'finish', 'ornament'] as TierName[]) {
    for (const s of tierHealth[tier]) {
      if (s.passRate < 0.9) {
        flagged.push({ tier: tierLabels[tier], value: s.value, passRate: s.passRate });
      }
    }
  }

  if (flagged.length === 0) {
    ln('None — all tier values pass at 90% or above.');
  } else {
    ln('| Tier | Value | Pass Rate |');
    ln('| --- | --- | ---: |');
    for (const f of flagged) {
      ln(`| ${f.tier} | ${f.value} | ${pct(f.passRate)} |`);
    }
  }
  ln();

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Main: globalTeardown entry point
// ---------------------------------------------------------------------------

export default function generateReport() {
  const rawDir = path.resolve('a11y-matrix-results/raw');
  const outDir = path.resolve('a11y-matrix-results');

  if (!fs.existsSync(rawDir)) {
    console.log('[a11y-matrix] No raw results found — skipping report generation.');
    return;
  }

  const files = fs.readdirSync(rawDir).filter((f) => f.endsWith('.json'));
  if (files.length === 0) {
    console.log('[a11y-matrix] No result files found — skipping report generation.');
    return;
  }

  console.log(`[a11y-matrix] Processing ${files.length} result files...`);

  const results: RawResult[] = files.map((f) =>
    JSON.parse(fs.readFileSync(path.join(rawDir, f), 'utf-8'))
  );

  // Sort by label for deterministic output
  results.sort((a, b) => a.label.localeCompare(b.label));

  // Compute analytics
  const tierHealth: Record<TierName, TierValueStats[]> = {
    theme: computeTierHealth(results, 'theme'),
    relief: computeTierHealth(results, 'relief'),
    finish: computeTierHealth(results, 'finish'),
    ornament: computeTierHealth(results, 'ornament'),
  };

  const comboSummaries: ComboSummary[] = results.map((r) => ({
    label: r.label,
    combination: r.combination,
    violationCount: r.counts.violations,
    severityScore: severityScore(r.violations),
    topIssues: r.violations.slice(0, 3).map((v) => v.id),
  }));

  const blessed = comboSummaries
    .filter((c) => c.violationCount === 0)
    .sort((a, b) => a.label.localeCompare(b.label));

  const worst = [...comboSummaries]
    .sort((a, b) => b.violationCount - a.violationCount || b.severityScore - a.severityScore)
    .slice(0, 10);

  const commonViolations = computeCommonViolations(results);

  // Write machine-readable data
  const data = {
    meta: {
      generated: new Date().toISOString(),
      totalCombinations: results.length,
      passing: blessed.length,
      passRate: results.length > 0 ? blessed.length / results.length : 0,
    },
    tierHealth,
    blessed: blessed.map((b) => b.combination),
    worst: worst.map((w) => ({
      combination: w.combination,
      label: w.label,
      violationCount: w.violationCount,
      severityScore: w.severityScore,
      topIssues: w.topIssues,
    })),
    commonViolations,
    results: results.map((r) => ({
      label: r.label,
      combination: r.combination,
      counts: r.counts,
      severityScore: severityScore(r.violations),
      violations: r.violations.map((v) => ({
        id: v.id,
        help: v.help,
        impact: v.impact,
        nodeCount: v.nodes.length,
      })),
    })),
  };

  fs.writeFileSync(path.join(outDir, 'a11y-data.json'), JSON.stringify(data, null, 2));

  // Write human-readable scorecard
  const markdown = generateMarkdown(results, blessed, worst, tierHealth, commonViolations);
  fs.writeFileSync(path.join(outDir, 'a11y-scorecard.md'), markdown);

  // Print summary to stdout
  const total = results.length;
  const passing = blessed.length;
  console.log(`[a11y-matrix] Scorecard generated.`);
  console.log(`[a11y-matrix]   Combinations: ${total}`);
  console.log(`[a11y-matrix]   Passing:      ${passing} (${pct(total > 0 ? passing / total : 0)})`);
  console.log(
    `[a11y-matrix]   Violations:   ${results.reduce((s, r) => s + r.counts.violations, 0)}`
  );
  console.log(`[a11y-matrix]   Output:       ${outDir}/`);
}
