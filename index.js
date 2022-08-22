require('dotenv').config();

const { leerInput, inquirerMenu, pausa, listadoLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const main = async () => {


	let opcion = '';
	const busquedas = new Busquedas();


	do {

		opcion = await inquirerMenu('Seleccione su opción: ');
		
		switch (opcion) {
			case '1':
				//menssage
				const lugar = await leerInput('Indique que ciudad quiere ver: ');

				//find
				const lugares = await busquedas.buscarCiudad(lugar);

				//selection
				const idSeleccionado = await listadoLugares(lugares);

				if(idSeleccionado !== '0'){

					const lugarSeleccionado = lugares.find( l => l.id === idSeleccionado);

					//save to DB
					busquedas.agregarHistorial( lugarSeleccionado.nombre);

					//weather
					const temperaturas = await busquedas.buscarClima(lugarSeleccionado.latitud, lugarSeleccionado.longitud);

					//results
					console.clear();
					console.log('\nInformación de la ciudad\n'.red);
					console.log('Ciudad: ', lugarSeleccionado.nombre);
					console.log('Latitud: ', lugarSeleccionado.latitud);
					console.log('Longitud: ', lugarSeleccionado.longitud);
					console.log('Temperatura: ', temperaturas.temp);
					console.log('Minima: ', temperaturas.min);
					console.log('Máxima: ', temperaturas.max);
					console.log('Estado del clima: ', temperaturas.desc);
				}
				
			break;
		
			case '2':

				busquedas.historialCapitalizado.forEach( (lugar, i) =>{

					const idx = `${i +1}`.red;
					console.log(`${idx} ${lugar}`);

				});

				
			break;
		}


		if (opcion !=='0') await pausa();

	} while (opcion !== '0');

}


main();