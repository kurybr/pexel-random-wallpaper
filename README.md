# Pexels Random Wallpaper

Um serviço integrado com a api do site https://www.pexels.com para de forma randomica atualizar o wallpaper do computador.

Pra quem gosta de sempre alternar entre os wallpapers do computador com belas imagens

Você pode buscar por imagens dentro das categorias que mais gosta.


**Testado apenas no Linux no momento**


Ref: 
- [Pexels API](https://www.pexels.com/api/) - Para conseguir uma APIKEY você precisa criar uma conta na pexels. ( é Free )


```javascript

    const client = new PexelsRandom({  api: 'INSERT_YOUR_APIKEY_HERE', path: 'enter the location where you want to save the images '})
    const image = client.handleSearch('enter the terms you want to search separated by commas')
    client.setWallpaper(image)

```
