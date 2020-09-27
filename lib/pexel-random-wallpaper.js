const fs = require('fs');
const Path = require('path');
const graphFs = require('graph-fs');
const request = require('request');


const { createClient } = require('pexels');
const wallpaper = require('wallpaper');

class PexelsRandom { 
    constructor({ path, api }) { 
        this.directory = path;
        this.client = createClient( api );
    }
    handleShuffle( array ) { 
           return array.sort( () => Math.random() - 0.5 );
    }
    handleSearch(query) { 
        return this.client.photos.search({ query, per_page: 100000 })
            .then(response => this.handleShuffle(response.photos))
            .then(this.handlePicture)
    }
    handleDownload( uri, name ) {  
        return new Promise ( (resolve, reject) => { 
            try {
                request(uri)
                .pipe(fs.createWriteStream(name))
                .on('complete',() => {
                    // Clear directory with old image.
                    new graphFs.Node(this.directory).clear();
                })
                .on('close', resolve)
            } catch (error) {
                reject(error);
            }
        })
    }
    handlePicture(images) { 
        return images[0];
    }
    handleGetName( image ) { 
        const uri = image.src.original;
        const index = uri.indexOf(image.id) + image.id.toString().length;
        const name = uri.substr( index );
        return name;
    }
    async SetWallpaper(image) { 
        const name = this.handleGetName( image );
        const destiny = this.directory + name;
        await this.handleDownload(image.src.original, destiny )
        wallpaper.set( destiny );

    }
}


module.exports = PexelsRandom;