$(document).ready(function () {
    let condicionGuardar = 0;
    let codigoBuscar = null;
    $.ajax({
        method: 'get',
        url: 'http://localhost:8000/estudiantes'
    }).done((response) => {
        const dataJson = JSON.parse(response);
        const estudiantes = dataJson.data;
        const table = document.getElementById('estudianteTb');
        const tbody = table.getElementsByTagName('tbody')[0];
        let html = '';
        estudiantes.forEach(estudiante => {
            html += '<tr>'
            html += '      <td>' + estudiante.codigo + '</td>';
            html += '      <td>' + estudiante.nombres + '</td>';
            html += '      <td>' + estudiante.apellidos + '</td>';
            html += '      <td>';
            html += '          <button class="btnModificar" data-codigo="' + estudiante.codigo + '" >Modificar</button>';
            html += '      </td>';
            html += '      <td>';
            html += '          <button class="btnEliminar" data-codigo="' + estudiante.codigo + '" >Eliminar</button>';
            html += '      </td>';
            html += '      <td>';
            html += '          <button class="btnNotas" data-codigo="' + estudiante.codigo + '" >Notas</button>';
            html += '      </td>';
            html += '</tr>';

        });
        tbody.innerHTML = html;
    }).fail((error) => {
        console.error(error);
    });



    // REGISTRAR USUARIOS

    $(document).on("click", "#btnRegistrar", function () {

        document.getElementById('titulo').innerText = 'Registrar';
        condicionGuardar = 1;
        clean();

    });

    // MODIFICAR REGISTRO

    $(document).on("click", ".btnModificar", function () {

        document.getElementById('titulo').innerText = 'Modificar';

        condicionGuardar = 2;
        //Guarda en una variable el codigo recogido en las propiedades del boton Modificar
        codigoBuscar = $(this).data("codigo");
        var nombres = $(this).closest("tr").find("td:eq(1)").text(); //TR = Fila, TD = celda
        var apellidos = $(this).closest("tr").find("td:eq(2)").text();

        $("#codigoId").val(codigoBuscar);
        //muestra el codigo pero soamente como lectrua 
        $("#codigoId").prop("readonly", true);
        $("#nombreId").val(nombres);
        $("#apellidoId").val(apellidos);

    });

    // ELIMINAR REGISTRO

    $(document).on("click", ".btnEliminar", function () {

        codigoBuscar = $(this).data("codigo");

        $.ajax({
            url: 'http://localhost:8000/estudiantes/' + codigoBuscar,
            method: 'delete',
        }).done(response => {
            const dataJson = JSON.parse(response);
            const msg = dataJson.data;
            alert(msg);

            location.reload();

        }).fail(error => {
            const dataJson = JSON.parse(response);
            const msg = dataJson.data;
            alert(msg);
        });

    });

    //FUNCIONALIDAD BOTON GUARDAR

    document.getElementById('btnGuardar').addEventListener('click', guardar);

    function guardar() {

        //Variables a utilizar en el ajax
        let codigo = document.getElementById('codigoId');
        let nombres = document.getElementById('nombreId');
        let apellidos = document.getElementById('apellidoId');


        //Variables para validar que los input no puedan estar vacios
        let codVer = document.getElementById('codigoId').value;
        let nombreVer = document.getElementById('nombreId').value;
        let apellidodVer = document.getElementById('apellidoId').value;


        if (condicionGuardar == 0) {
            alert("Debe seleccionar una funcionalidad para el botón");
            return;
        } else if (codVer.trim() === '' || nombreVer.trim() === '' || apellidodVer.trim() === '') {
            alert("No pueden haber campos vacios");
            return
        }

        if (condicionGuardar == 1) {
            $.ajax({
                url: 'http://localhost:8000/estudiantes',
                method: 'post',
                data: {
                    codigo: codigo.value,
                    nombres: nombres.value,
                    apellidos: apellidos.value
                }
            }).done(response => {
                const dataJson = JSON.parse(response);
                const msg = dataJson.data;
                alert(msg)


            });
        } else if (condicionGuardar == 2) {
            $.ajax({
                url: 'http://localhost:8000/estudiantes/' + codigoBuscar,
                method: 'put',
                data: {
                    nombres: nombres.value,
                    apellidos: apellidos.value
                }
            }).done(response => {
                const dataJson = JSON.parse(response);
                const msg = dataJson.data;
                alert(msg);
                location.reload();

            });
        }

    }

    function clean() {
        let codigo = "";
        let nombres = "";
        let apellidos = "";

        document.getElementById("codigoId").value = codigo;
        document.getElementById("nombreId").value = nombres;
        document.getElementById("apellidoId").value = apellidos;

    };

    $(document).on("click", ".btnNotas", function () {
        codigoBuscar = $(this).data("codigo");
        let nombres = $(this).closest("tr").find("td:eq(1)").text();
        let apellidos = $(this).closest("tr").find("td:eq(2)").text();
        // Almacena los valores en localStorage
        localStorage.setItem("codigo", codigoBuscar);
        localStorage.setItem("nombres", nombres);
        localStorage.setItem("apellidos", apellidos);

        // Redirigir a notas
        window.location.href = "notas.html";

    });




});