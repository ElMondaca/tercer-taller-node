const inquirer = require('inquirer');

require('colors');


const menuOption = [{
    type: "list",
    name: "opcion",
    message: "Por favor seleccione opción",
    choices: [
        {
            value: '1',
            name: `${'1.'.red} Buscar ciudad`
        },
        {
            value: '2',
            name: `${'2.'.red} Historial de busqueda`
        },
        {
            value: '0',
            name: `${'0.'.red} Salir`
        }
    ]
}];

const inquirerMenu = async () => {

    console.clear();
    console.log('==========================='.red);
    console.log('  Seleccione una opción');
    console.log('===========================\n'.red);

    const {opcion} = await inquirer.prompt(menuOption);
    return opcion;

}

const confirmarDelete = async () => {

    const validacion = [
        {
            type: 'confirm',
            name: 'validate',
            message: `¿Está seguro que desea ${'ELIMINAR'.red} el registro?`
        }
    ];

    const { validate } = await inquirer.prompt(validacion);
    return validate;
}


const pausa = async () => {

    const validacion = [{
        type: 'input',
        name: 'validar',
        message: `Presione ${'ENTER'.blue} para continuar`
    }];

    console.log('\n');
    //Se hace el llamado al objeto validación en la consola para su interacción
    await inquirer.prompt(validacion);
}

const leerInput = async (message) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate (value) {
                if (value.length === 0){
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const {desc} = await inquirer.prompt(question);
    return desc;

}

const listadoLugares = async ( lugares = [] ) => {

    //Se recorre el arreglo de ciudades con un map, para construir las opciones que se mostrarán en pantalla
    const choices = lugares.map((lugar, idx) => {

        const indice = `${idx +1}`.green;
        return{
            value: lugar.id,
            name: `${indice}. ${lugar.nombre}`
        }
    });
    choices.unshift({
        value: '0',
        name: '0. '.green + 'Cancelar'
    })

    //Se crean las preguntas y se agrega el choises creado con el .map previo
    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar',
            choices
        }
    ]

    //Se muestra en consola el listado de tareas a eliminar
    const { id } = await inquirer.prompt(preguntas);
    return id;
}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput, 
    listadoLugares
}