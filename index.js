const fs = require('fs');
const gm = require('gm').subClass({ imageMagick: true });
const _progress = require('cli-progress');

async function robot() {
    const b1 = new _progress.Bar({}, _progress.Presets.shades_grey);
    const images = fs.readdirSync('./images');
    b1.start(images.length, 0);
    
    await convertAllImages(images);
    b1.stop()

    async function convertAllImages(content) {
        for (let sentenceIndex = 0; sentenceIndex < content.length; sentenceIndex++) {
            await convertImage(images[sentenceIndex], sentenceIndex);
            b1.update(sentenceIndex + 1);
        }
    }

    async function convertImage(name, sentenceIndex) {
        return new Promise((resolve, reject) => {
            const inputFile = `./images/${name}[0]`;
            const outputFile = `./converted/${sentenceIndex}.png`;
            const width = 1920;
            const height = 1080;

            gm()
                .in(inputFile)
                .out('(')
                .out('-clone')
                .out('0')
                .out('-background', 'white')
                .out('-blur', '0x9')
                .out('-resize', `${width}x${height}^`)
                .out(')')
                .out('(')
                .out('-clone')
                .out('0')
                .out('-background', 'white')
                .out('-resize', `${width}x${height}`)
                .out(')')
                .out('-delete', '0')
                .out('-gravity', 'center')
                .out('-compose', 'over')
                .out('-composite')
                .out('-extent', `${width}x${height}`)
                .write(outputFile, (error) => {
                    if (error) {
                        return reject(error)
                    }
                    resolve()
                })
        })
    }
}

robot();