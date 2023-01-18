var search = require('youtube-search');

var opts = {
  maxResults: 10,
  key: 'AIzaSyDzE3O-s2NeM80ngjGL_qS9V3lHgsbDEcs'
};

buscar();
async function buscar(){  
const busqueda = await search('kali uchis after',opts);

console.log(busqueda.results[0]);
}
/*search('kali uchis after', opts, function(err, results) {
  if(err) return console.log(err);

  console.log(results);
});*/