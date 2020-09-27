const Path = require('path');
const fs = require('fs');
const PexelsRandom = require('../lib/pexel-random-wallpaper');


(async () => { 

    const directory = Path.join(process.env.HOME, '/Pictures/wallpapers-pexels')

    // If don't exist the directory, make it.
    if(!fs.existsSync(directory)){ fs.mkdirSync(directory) }

    const client = new PexelsRandom({ path: directory, api: ''});
    const image = await client.handleSearch('lavanda, africa, nature, family, friends, dogs, platypus');

    client.SetWallpaper(image)
   

    client.Automatic();


})();



