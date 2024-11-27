//Converts documents.js to a lunr index and outputs it to index.js in a usable format
//node build-index.js
const lunr = require('lunr');
const fs = require('fs');
const path = require('path');

// Input and output paths
const inputFile = path.resolve(process.cwd(), 'documents.js');
const outputPath = path.resolve(process.cwd(), 'index.js');

try {
  // Import the input file
  const documents = require(inputFile);

  // Generate Lunr.js index
  const idx = lunr(function () {
    this.ref('name');
    this.field('text');

    this.pipeline.add(lunr.stemmer);

    documents.getList().forEach(function (doc) {
      this.add(doc);
    }, this);
  });

  // Combine index and documents into output
  const outputObject = {
    index: idx,
    documents
  };

  const fileContentToWrite = `//Lunr search index\nvar index = ${JSON.stringify(outputObject, null, 2)}\n\nfunction getIndex(){ return index }\n\nexport default { getIndex };`;
  fs.writeFileSync(outputPath, fileContentToWrite, 'utf8');
  console.log(`Done`);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
