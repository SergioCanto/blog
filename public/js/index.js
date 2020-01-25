function loadComments(){

    let url = "/blog-api/comentarios";
    let settings = {
        method : "GET"
    };

    fetch(url, settings)
        .then(response => {
            if(response.ok){
                return response.json();
            }
        })
        .then(responseJSON => {
            displayResults(responseJSON);
        });

}

function autorComments(){

    $('#buscar').on('click', function(e){

    let url = "/blog-api/comentarios-por-autor?autor=${autor}";
    let settings = {
        method : "GET"
    };

    fetch(url, settings)
        .then(response => {
            if(response.ok){
                return response.json();
            }
        })
        .then(responseJSON => {
            $('#commentList').empty();

            responseJSON.forEach(comment => {
                let {id, titulo, contenido, autor, fecha} = comment;
        
                $('#commentList').append(`
                    <div class="paragraph">
                        <li>
                            <span class="sub"> ID: </span> ${id}
                        </li>
                        <li>
                            <span class="sub"> Titulo: </span> ${titulo}
                        </li>
                        <li>
                            <span class="sub"> Contenido: </span> ${contenido}
                        </li>
                        <li>
                            <span class="sub"> Autor: </span> ${autor}
                        </li>
                        <li>
                            <span class="sub"> Fecha: </span> ${fecha}
                        </li>
                    </div>
                `)
            });
        });
    });
}

function addComment(){

    let agregar = $( '#agregar' );
  
    $(agregar).on('click', function(e){
        
        e.preventDefault();

        let titulo = $('#Titulo').val();
        let contenido = $('#Contenido').val();
        let autor = $('#Autor').val();

        $.ajax({
            url : '/blog-api/nuevo-comentario',
            method : "POST",
            data : JSON.stringify({titulo, contenido, autor}),
            ContentType : "application/json",
            dataType : "json",
            success : function( responseJSON ){
                console.log(responseJSON);
                location.reload();
            },
            error : function( err ){
                console.log( err );
            }
        });
    });

}

function actualizarComment(){

    let editar = $( '#editar' );
  
    $(editar).on('click', function(e){
        
        e.preventDefault();

        let id = $('#id');
        let titulo = $('#Titulo').val();
        let contenido = $('#Contenido').val();
        let autor = $('#Autor').val();

        let obj = {
            id : id,
            titulo : titulo,
            contenido : contenido,
            autor : autor
        };

        $.ajax({
            url : '/blog-api/actualizar-comentario/:id',
            method : "PUT",
            data : JSON.stringify(obj),
            ContentType : "application/json",
            dataType : "json",
            success : function( responseJSON ){
                console.log(responseJSON);
                location.reload();
            },
            error : function( err ){
                console.log( err );
            }
        });
    });

}

function deleteComment(){

    let eliminar = $( '#eliminar' );
  
    $(eliminar).on('click', function(e){
        
        e.preventDefault();

        let id = $('#id');

        let obj = {
            id : id
        };

        $.ajax({
            url : '/blog-api/remover-comentario/:id',
            method : "DELETE",
            data : JSON.stringify(obj),
            ContentType : "application/json",
            dataType : "json",
            success : function( responseJSON ){
                console.log(responseJSON);
                location.reload();
            },
            error : function( err ){
                console.log( err );
            }
        });
    });

}

function displayResults(responseJSON){

    $('#commentList').empty();

    for(let i = 0; i < responseJSON.length; i++){
        $('#commentList').append(`
            <div class="paragraph">
                <li>
                    <span class="sub"> ID: </span> ${responseJSON[i].id}
                </li>
                <li>
                    <span class="sub"> Titulo: </span> ${responseJSON[i].titulo}
                </li>
                <li>
                    <span class="sub"> Contenido: </span> ${responseJSON[i].contenido}
                </li>
                <li>
                    <span class="sub"> Autor: </span> ${responseJSON[i].autor}
                </li>
                <li>
                    <span class="sub"> Fecha: </span> ${responseJSON[i].fecha}
                </li>
            </div>
        `)
    }

}

function init(){
    loadComments();
    addComment();
    actualizarComment();
    deleteComment();
    autorComments();
}

init();