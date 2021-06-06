// VARIABLES //
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando; 

// CLASES //
class Citas{
    constructor(){
        this.citas = [];
    }

    agregarCita(cita){
        this.citas = [...this.citas, cita];
        console.log(this.citas);
        console.log(cita);
    }

    eliminarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id);
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }
}

class UI{
    imprimirAlerta(mensaje, tipo){ 

        // Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }
        divMensaje.textContent = mensaje;

        // Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        // Borrar alerta
        setTimeout(() => {
            divMensaje.remove();
        }, 5000);
    }

    imprirmirCitas({citas}){ // Se puede aplicar distructoring directamente en los parametros. 
        
        this.limpiarHTML();

        citas.forEach(cita => {
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

            // DIV    
            const divCitas = document.createElement('div');
            divCitas.classList.add('cita', 'p-3');
            divCitas.dataset.id = id; // Atributo personalizado

            // Parrafo
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('cart-title', 'font-wieght-bolder')
            mascotaParrafo.textContent = mascota;
            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `<span class="font-wieght-bolder"> Propietario: </span> ${propietario}`;
            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `<span class="font-wieght-bolder"> Telefono: </span> ${telefono}`;
            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `<span class="font-wieght-bolder"> Fecha: </span> ${fecha}`;
            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `<span class="font-wieght-bolder"> Hora: </span> ${hora}`;     
            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `<span class="font-wieght-bolder"> Sintomas: </span> ${sintomas}`;
            
            // Boton eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2')
            btnEliminar.innerHTML = 'Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
            btnEliminar.onclick = () => eliminarCita (id);

            // Boton editar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info')
            btnEditar.innerHTML = 'Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'
            btnEditar.onclick = () => cargarEdicion(cita);


            // Agrega Parrafo al Div
            divCitas.appendChild(mascotaParrafo);
            divCitas.appendChild(propietarioParrafo);   
            divCitas.appendChild(telefonoParrafo);   
            divCitas.appendChild(fechaParrafo);   
            divCitas.appendChild(horaParrafo);   
            divCitas.appendChild(sintomasParrafo);   
            divCitas.appendChild(btnEliminar);
            divCitas.appendChild(btnEditar);

            // Agrega citas al HTML
            contenedorCitas.appendChild(divCitas);
        });
    }

    limpiarHTML(){
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

// INSTANCIAS //
const ui = new UI();
const administrarCitas = new Citas();

// EVENTOS //
eventListeners();

function eventListeners() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}

// OBJETOS //
const  citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

// FUNCIONES //
function datosCita(e) { // Agrega datos al objeto de citas
    citaObj[e.target.name] = e.target.value; // corchetes para acceder a las prop del obj
}

function nuevaCita(e) { 
    e.preventDefault();

    // Validar y agregar citas
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    if( mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error'); 
        return;
    }
    
    // Editar o agregar cita
    if(editando){
        administrarCitas.editarCita({...citaObj}); // Crear una copia del objeto
        formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';
        ui.imprimirAlerta('Se modificó correctamente');     
        editando = false;    
    }else{
        citaObj.id = Date.now(); //Agregar un id unico
        administrarCitas.agregarCita({...citaObj}); 
        ui.imprimirAlerta('Se agregó correctamente');
    }

    reiniciarObjeto();
    formulario.reset();

    ui.imprirmirCitas(administrarCitas); // Mostrar el HTML
}

function reiniciarObjeto() {
    citaObj.mascota= '',
    citaObj.propietario= '',
    citaObj.telefono= '',
    citaObj.fecha= '',
    citaObj.hora= '',
    citaObj.sintomas= ''
}

function eliminarCita(id) {
    // Eliminar citas
    administrarCitas.eliminarCita(id);

    // Mensaje de alerta
    ui.imprimirAlerta('La cita se eliminó correctamente');

    // Actualizar listado de citas
    ui.imprirmirCitas(administrarCitas);
}

function cargarEdicion(cita) {
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

    // Completar los input
    mascotaInput.value = mascota; 
    propietarioInput.value = propietario; 
    telefonoInput.value =telefono; 
    fechaInput.value = fecha; 
    horaInput.value = hora; 
    sintomasInput.value = sintomas; 

    // Llenar el objeto con los nuevos datos
    citaObj.mascota = mascota; 
    citaObj.propietario = propietario; 
    citaObj.telefono = telefono; 
    citaObj.fecha = fecha; 
    citaObj.hora = hora; 
    citaObj.sintomas = sintomas; 
    citaObj.id = id; 

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios';

    editando = true;
}