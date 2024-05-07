const { createClient } = require('pexels');
const jimp = require('jimp');
const fs = require('fs');
const facts = require('./facts');

async function generateFact(imgPath) {
    console.log("In generateFact")
    let fact = facts[randomNumber(0, (facts.length - 1))];
    console.log("fact", fact)
    let photo = await factImage(fact.title);
    await editFact(fact.quote, photo, imgPath);
}

const editFact = async (fact, photo, imgPath) => {
    try {
        console.log("In editFact")
        let imgUrl = photo.src.medium;
        console.log("imgUrl", imgUrl)
        let factImage = await jimp.read(imgUrl).catch((e) => console.log("error while editing ", e));
        let factImageWidth = factImage.bitmap.width;
        let factImageHeight = factImage.bitmap.height;
        let imageDarkener = await new jimp(factImageWidth, factImageHeight, '#000000');
        imageDarkener = await imageDarkener.opacity(0.5);
        factImage = await factImage.composite(imageDarkener, 0, 0);
        // console.log("factImage", factImage)

        let posX = factImageWidth / 15;
        let posY = factImageHeight / 15;
        let maxWidth = factImageWidth - (posX * 2);
        let maxHeight = factImageHeight - posY;
        let font = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);

       await factImage.print(font, posX, posY, {
            text: fact,
            alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
          }, maxWidth, maxHeight)

        await factImage.writeAsync(imgPath);
        console.log("Image generated successfully");

    }
    catch (e) {
        console.log("error in editFact ", e)
    }
}

const deleteFact = async (imgPath) => {
    console.log("In deleteFact")

    fs.unlink(imgPath, (e) => {
        if (e) {
            console.log("error while deleting ", e);
            return;
        }
        console.log("Image deleted");
    })
}

const factImage = async (query) => {
    try{
    console.log("In factImage", query)

    let imgList,
        image;
    let client =  createClient(process.env?.PEXELS_API_KEY);
    console.log("client", client)
    let response = await client.photos.search({ query, per_page: 10 })
    imgList = response.photos;
    console.log("imgList", imgList)
    image = imgList[randomNumber(0, imgList.length - 1)];
    console.log("image", image)
    return image;
    }
    catch(e){
        console.log("error while getting the fact image ", e)
    }
}

const randomNumber = (min, max) => {
    console.log("In randomNumber")

    let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log("randomNumber", randomNumber)

    return randomNumber;
}

module.exports = { generateFact, deleteFact }
