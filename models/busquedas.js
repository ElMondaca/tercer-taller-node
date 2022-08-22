const fs = require('fs');
const axios = require('axios');
require('dotenv').config();



class Busquedas{


  historial = [];
  dbPath = './db/database.json';

  constructor(){

    this.leerDB();

  }

  get paramsMapbox(){
    return {
      'language' : 'es',
      'limit' : 5,
      'access_token': process.env.MAPBOX_KEY
    }
  }

  get paramsOpenweather(){
    return{
      'lang' : 'es',
      'units' : 'metric',
      'appid' : process.env.OPENWEATHER_KEY
    }
  }

  get historialCapitalizado(){

    return this.historial.map (lugar => {

      let palabras = lugar.split(' ');
      palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));

      return palabras.join(' ');
    });
  }

  async buscarCiudad( ciudad='' ){

  try{
    //Axios connection parameters
    const instance = axios.create({
      baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ciudad}.json`,
      params: this.paramsMapbox
    });

    const resp = await instance.get();

    return resp.data.features.map( lugar => ({
      id: lugar.id,
      nombre: lugar.place_name,
      longitud: lugar.center[0],
      latitud: lugar.center[1]
    }));

  }catch(error){
    throw error;
    }
  }

  async buscarClima(latitud, longitud){

    try {
      
      const cityWeather = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${latitud}8&lon=${longitud}`,
        params: this.paramsOpenweather
      });

      const clima = await cityWeather.get();
      const {weather, main } = clima.data;

      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp
      };

    } catch (error) {
      console.log(error);
    }
  }

  agregarHistorial(lugar = ''){

    //Prevent dual entry
    if (this.historial.includes( lugar.toLocaleLowerCase() ) ){
      return;
    }

    this.historial = this.historial.splice(0,9);
    this.historial.unshift( lugar.toLocaleLowerCase() );

    this.guardarDB();
  }

  guardarDB(){

    const payload = {
      historial: this.historial
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));

  }

  leerDB(){

    if(!fs.existsSync( this.dbPath ) ) return;

    const info = fs.readFileSync(this.dbPath, {encoding : 'utf-8'});
    const data = JSON.parse(info);

    this.historial =  data.historial;

  }

}

module.exports = Busquedas;