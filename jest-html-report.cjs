const fs = require('node:fs');
const path = require('node:path');

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });

const statusLabels = {
  passed: 'Correcta',
  failed: 'Fallida',
  pending: 'Pendiente',
  skipped: 'Omitida',
  todo: 'Pendiente',
};

class JestHtmlReport {
  constructor(globalConfig, options = {}) {
    this.rootDir = globalConfig.rootDir;
    this.outputFile = path.resolve(this.rootDir, options.outputFile || 'reports/jest-report.html');
  }

  async onRunComplete(_contexts, results) {
    const suites = results.testResults.map((suite) => {
      const relativePath = path.relative(this.rootDir, suite.testFilePath);
      const tests = suite.testResults.map((test) => {
        const status = test.status || 'pending';
        const failureDetails = test.failureMessages?.length
          ? `<pre>${escapeHtml(test.failureMessages.join('\n\n'))}</pre>`
          : '';

        return `
          <li class="test ${escapeHtml(status)}">
            <span class="status">${escapeHtml(statusLabels[status] || status)}</span>
            <span>${escapeHtml([...test.ancestorTitles, test.title].join(' > '))}</span>
            ${failureDetails}
          </li>`;
      });

      return `
        <section class="suite">
          <h2>${escapeHtml(relativePath)}</h2>
          <ul>${tests.join('')}</ul>
        </section>`;
    });

    const summary = [
      `${results.numPassedTests} correctas`,
      `${results.numFailedTests} fallidas`,
      `${results.numPendingTests} pendientes`,
    ].join(' | ');
    const suiteLabel = results.numTotalTestSuites === 1 ? 'suite' : 'suites';
    const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Informe de pruebas Jest</title>
  <style>
    body { color: #202124; font: 16px/1.5 system-ui, sans-serif; margin: 2rem auto; max-width: 900px; padding: 0 1rem; }
    .summary { background: #f1f3f4; border-radius: 8px; padding: 1rem; }
    .suite { border-bottom: 1px solid #dadce0; padding: 1rem 0; }
    .suite h2 { font-size: 1rem; }
    ul { list-style: none; padding: 0; }
    .test { border-left: 4px solid #777; margin: .75rem 0; padding: .4rem .75rem; }
    .passed { border-color: #188038; }
    .failed { border-color: #d93025; }
    .pending, .skipped, .todo { border-color: #f9ab00; }
    .status { display: inline-block; font-weight: 700; margin-right: .5rem; }
    pre { background: #f8f9fa; overflow-wrap: anywhere; padding: .75rem; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>Informe de pruebas Jest</h1>
  <p class="summary">${escapeHtml(summary)} | ${results.numTotalTests} pruebas en ${results.numTotalTestSuites} ${suiteLabel}</p>
  <p>Generado: ${escapeHtml(new Date().toLocaleString('es-MX'))}</p>
  ${suites.join('')}
</body>
</html>
`;

    fs.mkdirSync(path.dirname(this.outputFile), { recursive: true });
    fs.writeFileSync(this.outputFile, html, 'utf8');
    console.log(`\nInforme HTML de Jest: ${path.relative(this.rootDir, this.outputFile)}`);
  }
}

module.exports = JestHtmlReport;
