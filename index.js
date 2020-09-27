const fs = require('fs');
const Path = require('path');
const request = require('request');


const { createClient } = require('pexels');
const wallpaper = require('wallpaper');

class PexelsRandom { 
    api = 'INSERT_YOUR_APIKEY_HERE'
    client;
    constructor() { 
        this.client = createClient( this.api );
    }
    handleSearch(query) { 
        return this.client.photos.search({ query, per_page: 100000 })
    }
    handleDownload( uri, name ) {  
        return new Promise ( (resolve, reject) => { 
            try {
                request(uri).pipe(fs.createWriteStream(name)).on('close', resolve)
            } catch (error) {
                reject(error);
            }
        })
    }
    handlePicture(image) { 
        return this.client.photos.show({ id: image.id })
    }
    handleGetName( image ) { 
        const uri = image.src.original;
        const index = uri.indexOf(image.id) + image.id.toString().length;
        const name = uri.substr( index );
        return name;
    }
}

(async () => { 

    const shuffle = array => array.sort( () => Math.random() - 0.5 );

    const directory = Path.join(process.env.HOME, `/Pictures/wallpapers-pexels`)

    if(!fs.existsSync(directory)){ fs.mkdirSync(directory) }

    const client = new PexelsRandom();
    const images = await client.handleSearch('lavanda, nature, africa');
    const image = await client.handlePicture( shuffle( images.photos )[0] );
    const name = client.handleGetName( image );
    const destiny = directory + name;
    await client.handleDownload(image.src.original, destiny )
    wallpaper.set( destiny );

})();



