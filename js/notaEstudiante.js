// const codigo = localStorage.getItem("codigo");
// const nombres = localStorage.getItem("nombres");
// const apellidos = localStorage.getItem("apellidos");

// document.getElementById('codigoEst').innerText= nombres;
// document.getElementById('nombreEst').innerText= codigo;
// document.getElementById('apellidoEst').innerText= apellidos;
window.addEventListener('load', function () {
    const codigoEstudiante = localStorage.getItem("codigo");
    const nombres = localStorage.getItem("nombres");
    const apellidos = localStorage.getItem("apellidos");

    document.getElementById('codigoEst').value = codigoEstudiante;
    document.getElementById('nombreEst').value = nombres;
    document.getElementById('apellidoEst').value = apellidos;

    let id = null;

    function tabladeDatos() {
        let contadorNota = 0;
        let sumanota = 0;
        let txtpromedio = document.getElementById('promedio');
        let promedio = 0

        $.ajax({
            method: 'get',
            url: 'http://localhost:8000/actividades' + codigoEstudiante,
        }).done((response) => {
            const dataJson = JSON.parse(response);
            const actividades = dataJson.data;
            const table = document.getElementById('actividadTb');
            const tbody = table.getElementsByTagName('tbody')[0];
            let html = '';
            actividades.forEach(actividad => {
                html += '<tr>'
                html += '      <td>' + actividad.id + '</td>';
                html += '      <td>' + actividad.descripcion + '</td>';
                html += '      <td>' + actividad.nota + '</td>';
                html += '      <td>';
                html += '          <button class="btnModificar" data-id="' + actividad.id + '" >Modificar</button>';
                html += '      </td>';
                html += '      <td>';
                html += '          <button class="btnEliminar" data-id="' + actividad.id + '" >Eliminar</button>';
                html += '      </td>';
                html += '</tr>';
                contadorNota++;
                sumanota = parseFloat(sumanota) + parseFloat(actividad.nota);
            });
            tbody.innerHTML = html;

            if (contadorNota == 0) {
                txtpromedio.innerText = "No hay notas ingresadas";
            } else {
                promedio = sumanota / contadorNota;
                if (promedio >= 3) {
                    txtpromedio.innerHTML = '<label style="color: green">Promedio: ' + promedio + '</label>';
                } else {
                    txtpromedio.innerHTML = '<label style="color: red">Promedio: ' + promedio + '</label>';
                }
            }

        }).fail((error) => {
            console.error(error);
        });
    }

    tabladeDatos();

    // REGISTRAR NOTA

    $(document).on("click", "#btnRegistrarAc", function () {

        document.getElementById('titulo').innerText = 'Registrar';
        condicionGuardar = 1;
        clean();

    });

    // MODIFICAR REGISTRO

    $(document).on("click", ".btnModificar", function () {

        document.getElementById('titulo').innerText = 'Modificar';

        condicionGuardar = 2;
        //Guarda en una variable el codigo recogido en las propiedades del boton Modificar
        id = $(this).data("id");
        var descripcion = $(this).closest("tr").find("td:eq(1)").text(); //TR = Fila, TD = celda
        var nota = $(this).closest("tr").find("td:eq(2)").text();

        $("#descripcionId").val(descripcion);
        $("#notaId").val(nota);

    });

    // ELIMINAR REGISTRO

    $(document).on("click", ".btnEliminar", function () {

        id = $(this).data("id");

        $.ajax({
            url: 'http://localhost:8000/actividades/' + id,
            method: 'delete',
        }).done(response => {
            const dataJson = JSON.parse(response);
            const msg = dataJson.data;
            alert(msg);
            tabladeDatos();

        }).fail(error => {
            const dataJson = JSON.parse(response);
            const msg = dataJson.data;
            alert(msg);
        });

    });

    //FUNCIONALIDAD BOTON GUARDAR

    document.getElementById('btnGuardarAc').addEventListener('click', guardar);

    function guardar() {

        //Variables a utilizar en el ajax
        let descripcion = document.getElementById('descripcionId');
        let nota = document.getElementById('notaId');



        //Variables para validar que los input no puedan estar vacios
        let descripcionVer = document.getElementById('descripcionId').value;
        let notaeVer = document.getElementById('notaId').value;


        if (condicionGuardar == 0) {
            alert("Debe seleccionar una funcionalidad para el botón");
            return;
        } else if (descripcionVer.trim() === '' || notaeVer.trim() === '') {
            alert("No pueden haber campos vacios");
            return
        }

        if (condicionGuardar == 1) {
            $.ajax({
                url: 'http://localhost:8000/actividades',
                method: 'post',
                data: {
                    descripcion: descripcion.value,
                    nota: nota.value,
                    codigoEstudiante: codigoEstudiante
                }
            }).done(response => {
                const dataJson = JSON.parse(response);
                const msg = dataJson.data;
                alert(msg)
                tabladeDatos();
                clean();


            });
        } else if (condicionGuardar == 2) {
            $.ajax({
                url: 'http://localhost:8000/actividades/' + id,
                method: 'put',
                data: {
                    descripcion: descripcion.value,
                    nota: nota.value
                }
            }).done(response => {
                const dataJson = JSON.parse(response);
                const msg = dataJson.data;
                alert(msg);
                tabladeDatos();
                clean();

            });
        }

    }

    function clean() {
        let descripcion = "";
        let nota = "";

        document.getElementById("descripcionId").value = descripcion;
        document.getElementById("notaId").value = nota;


    };

    document.getElementById('btnVolver').addEventListener('click', function() {
        window.location.href = 'index.html';
    });


});
