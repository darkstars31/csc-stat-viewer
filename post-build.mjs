
import { createReadStream, createWriteStream, rename } from 'fs';
import { createInterface } from 'readline';

const readStream = createReadStream(`./build/index.html`);
const writeStream = createWriteStream(`./build/index.htmlx`);

const rl = createInterface({
  input: readStream,
  output: process.stdout,
  terminal: false
});

// Read the file line by line
rl.on('line', (line) => {

  // If this is the line to modify, write the new content instead
  if (line.includes(`script type="module" crossorigin src`)) {
    writeStream.write(line.replace(`js"></script>`, `js.gz"></script>\n`));
  } else if (line.includes(`link rel="stylesheet" crossorigin href`)) {
    writeStream.write(line.replace(`css">`, `css.gz">\n`));
  } else {
    writeStream.write(line + '\n');
  }
});

// When finished reading the file
rl.on('close', () => {
  console.log('File processing completed.');
  rename('build/index.htmlx', 'build/index.html', (err) => {
    console.info(err);
  })
});