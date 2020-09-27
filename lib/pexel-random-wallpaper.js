const fs = require('fs');
const Path = require('path');
const graphFs = require('graph-fs');
const request = require('request');
const cron = require('node-cron');


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
        this.lastQuery = query;
        return this.client.photos.search({ query, per_page: 100000 })
            .then(response => this.handleShuffle(response.photos))
            .then(this.handlePicture)
    }
    handleDownload( uri, name ) {  
        
        // Clear directory with old image.
        new graphFs.Node(this.directory).clear();

        return new Promise ( (resolve, reject) => { 
            try {
                request(uri)
                .pipe(fs.createWriteStream(name))
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

    Automatic() { 

        cron.schedule('*/1 * * * *', () => {
            this.handleSearch(this.lastQuery)
                .then( image => this.SetWallpaper(image) )
        });
          
    }
}


module.exports = PexelsRandom;