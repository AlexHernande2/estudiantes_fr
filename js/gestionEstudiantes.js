$(document).ready(function(){
    $.ajax({
        method: 'get',
        url: 'http://localhost:8000/usuarios'
    }).done((response)=>{
        const dataJson= JSON.parse(response);
        const estudiantes =dataJson.data;
        const table = document.getElementById('estudianteTb');
        const tbody= table.getElementsByTagName('tbody')[0];
        let html ='';
        estudiantes.forEach(estudiante => {
           html+='<tr>'
           html+='      <td>' + estudiante.codigo+'</td>';
           html+='      <td>'+ estudiante.nombres+'</td>';
           html+='      <td>'+ estudiante.apellidos+'</td>';
           html+='      <td>';
           html+='          <button class="btnModificar" data-id="' + estudiante.codigo + '" >Modificar</button>';
           html+='      </td>';
           html+='      <td>';
           html+='          <button class="btnEliminar" data-id="' +  estudiante.codigo + '" >Eliminar</button>';
           html+='      </td>';
           html+='      <td>';
           html+='          <button class="btnNotas" data-id="' +  estudiante.codigo + '" >Notas</button>';
           html+='      </td>';
           html+='</tr>';
            
        });
        tbody.innerHTML= html;
    }).fail((error)=>{
        console.error(error);
    });

    let condicionGuardar = 0;
    let id = null;

    // REGISTRAR USUARIOS

    $(document).on("click", "#btnRegistrar", function(){

        document.getElementById('titulo').innerText = 'Registrar';
        condicionGuardar = 1;
        clean();

    });

    // MODIFICAR REGISTRO

    $(document).on("click", ".btnModificar", function(){

        document.getElementById('titulo').innerText = 'Modificar';

        condicionGuardar = 2;
        id = $(this).data("id"); //Guarda en una variable el id recogido en las propiedades del boton Modificar
        var name = $(this).closest("tr").find("td:eq(0)").text(); //TR = Fila, TD = celda
        var username = $(this).closest("tr").find("td:eq(1)").text();

        $("#nameId").val(name);
        $("#usernameId").val(username);

    });

    // ELIMINAR REGISTRO

    $(document).on("click", ".btnEliminar", function(){

        id = $(this).data("id");

        $.ajax({
            url: 'http://localhost:8000/usuarios/' + id,
            method: 'delete',
        }).done(response=>{
            const dataJson = JSON.parse(response);
            const msg = dataJson.data; 
            alert(msg);

            location.reload();

        }).fail(error=>{
            const dataJson = JSON.parse(response);
            const msg = dataJson.data; 
            alert(msg);
        });

    });

    //FUNCIONALIDAD BOTON GUARDAR

    document.getElementById('btnGuardar').addEventListener('click', guardar);

    function guardar(){

        //Variables a utilizar en el ajax
        let name = document.getElementById('nameId');
        let userName= document.getElementById('usernameId');
        let password = document.getElementById('passwordId');


        //Variables para validar que los input no puedan estar vacios
        let nameVer = document.getElementById('nameId').value;
        let userNameVer= document.getElementById('usernameId').value;
        let passwordVer = document.getElementById('passwordId').value;


        if(condicionGuardar == 0){
            alert("Debe seleccionar una funcionalidad para el botón");
            return;
        }else if(nameVer.trim() === '' || userNameVer.trim() === '' || passwordVer.trim() === ''){
            alert ("No pueden haber campos vacios");
            return
        }

        if(condicionGuardar == 1){
            $.ajax({
                url: 'http://localhost:8000/usuarios',
                method: 'post',
                data: {
                    name: name.value,
                    username: userName.value,
                    password: password.value
                }
            }).done(response => {
                const dataJson = JSON.parse(response);
                const msg = dataJson.data;
                alert(msg)
                location.reload();

            });
        }else if(condicionGuardar == 2){
            $.ajax({
                url: 'http://localhost:8000/usuarios/' + id,
                method: 'put',
                data:{
                         name: name.value,
                         username: userName.value,
                         password: password.value
                     }
                 }).done(response=>{
                     const dataJson = JSON.parse(response);
                     const msg = dataJson.data; 
                     alert(msg);
                    location.reload();
                     
                 });
        }

    }

    function clean(){
        let name = "";
        let userName= "";
        let password = "";

        document.getElementById("nameId").value = name;
        document.getElementById("usernameId").value = userName;
        document.getElementById("passwordId").value = password;

    };

  });