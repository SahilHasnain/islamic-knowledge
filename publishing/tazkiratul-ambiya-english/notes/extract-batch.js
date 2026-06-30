/**
 * Extract sections for a given batch range from the source JSON.
 * Usage: node extract-batch.js <startIndex> <endIndex>
 * Outputs Roman Urdu text with section titles as ## headings.
 */
const path = require('path');
const data = require(path.join(__dirname, '..', '..', '..', 'content', 'books', 'tazkiratul-ambiya.json'));
const startIdx = parseInt(process.argv[2]);
const endIdx = parseInt(process.argv[3]);

if (isNaN(startIdx) || isNaN(endIdx)) {
  console.error('Usage: node extract-batch.js <startIndex> <endIndex>');
  process.exit(1);
}

const sections = data.sections.slice(startIdx, endIdx + 1);

for (const sec of sections) {
  console.log(`## ${sec.title}\n`);
  for (const pg of sec.pages) {
    // Clean up the text: remove page headers (everything before first \n that contains "TAZKIRATUL AMBIYA")
    let text = pg.text;
    const lines = text.split('\n');
    const filteredLines = lines.filter(line => !line.includes('TAZKIRATUL AMBIYA') && !line.match(/^contents$/i) && !line.match(/^\d+$/));
    text = filteredLines.join('\n').trim();
    if (text) {
      console.log(text);
      console.log();
    }
  }
}
