const path = require('path')
const fs = require("fs");
const svg2png = require("svg2png");

const getAllImages = () => {
  const networks = fs.readdirSync(path.join(__dirname, '../resources/networks'));
  const tokens = fs.readdirSync(path.join(__dirname, '../resources/tokens'));
  const evmDir = fs.readdirSync(path.join(__dirname, '../resources/evm'));

  // recursive read all files in evm and return { dir, name } object
  const evmFiles = evmDir.reduce((acc, dir) => {
    // ignore hidden files
    if (dir.startsWith('.')) return acc;

    const files = fs.readdirSync(path.join(__dirname, '../resources/evm', dir));

    return [
      ...acc,
      ...files.map(name => ({ dir: `evm/${dir}`, name }))
    ]
  }, []);

  return [
    ...networks.map(name => ({ dir: 'networks', name })),
    ...tokens.map(name => ({ dir: 'tokens', name })),
    ...evmFiles
  ];
}

const writeFile = (dist, data) => {
  // check if folder exist, if not create it
  const dir = path.dirname(dist);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(dist, data);
}

const transform = async (sourceBuffer, size, name, dir) => {
  return svg2png(sourceBuffer, {height: size, width: size})
    .then(buffer => writeFile(`./public/${dir}/${name}.png`, buffer))
    .catch(e => console.error(e));
}

const transformAll = async () => {
  const promises = [];
  const images = getAllImages();

  images.forEach(({ dir, name })=> {
    console.log(`processing ${dir}/${name}`);

    const sourceBuffer = fs.readFileSync(`./resources/${dir}/${name}`);

    // skip all hidden file
    if (name.startsWith('.')) return;

    if (name.endsWith('svg')) {
      promises.push(() => {
        return transform(sourceBuffer, 128, name.split('.')[0], dir)
      })
    } else if (name) {
      promises.push(() => {
        return writeFile(`./public/${dir}/${name.split('.')[0]}.png`, sourceBuffer);
      })
    }
  })

  await Promise.all(promises.map(i => i()));

  console.log('completed');
}

transformAll();
