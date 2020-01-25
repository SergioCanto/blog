let express = require('express');
let bodyParser = require('body-parser');
let jasonParser = bodyParser.json();
let uuidv4 = require('uuid/v4');
let morgan = require('morgan');

let app = express();


app.use(express.static('public'));
app.use(morgan('dev'));

let comentarios = [{
    id : uuidv4(),
    titulo : "Prueba 1",
    contenido : "Esta es la prueba del primer comentario.",
    autor : "Sergio Canto",
    fecha : new Date()
},
{
    id : uuidv4(),
    titulo : "Comentario 2",
    contenido : "Este comentario debe aparecer como el segundo.",
    autor : "Alejandro Arizpe",
    fecha : new Date()
},
{
    id : uuidv4(),
    titulo : "Tercer Comentario",
    contenido : "Si el programa funciona correctamente, esto aparece como tercer comentario.",
    autor : "Sergio Alejandro Canto Arizpe",
    fecha : new Date()
}];

//Regresa todos los comentarios del blog con 200
app.get('/blog-api/comentarios', (req,res) =>{
    return res.status(200).json(comentarios);
});

//Valida que el autor sea proporcionado, si no ERROR 406
//Valida que el autor tenga comentarios en el blog, si no ERROR 404
//Resgresa comentarios del autor con 200
app.get('/blog-api/comentarios-por-autor', (req,res) =>{
    let autor = req.query;

    if(autor == "" || autor == undefined){
        res.statusMessage = "No se ha proporcionado el autor.";
        return res.status(406).send();
    }
    else{
        let result = comentarios.filter((elemento) => {
            if(elemento.autor == autor){
                return elemento;
            }
        });
    
        if(result.length > 0){
            return res.status(200).json(result);
        }
        else{
            res.statusMessage = "El autor no tiene comentarios en el blog.";
            return res.status(404).send();
        }
    }
});

//Mandar comentario sin id ni fecha
//Validar los demas parametros, si no ERROR 406
//Agregar comentario a la lista y regresar comentario con 201
app.post('/blog-api/nuevo-comentario', jasonParser, (req, res) =>{

    let {titulo, contenido, autor} = req.body;
    let fecha = new Date();
    let id = uuidv4();
    let comentario = {
        id : id,
        titulo : titulo,
        contenido : contenido,
        autor : autor,
        fecha : fecha
    };

    if(titulo == "" || contenido == "" || autor == "" || titulo == undefined || contenido == undefined || autor == undefined){
        res.statusMessage = "Hacen falta parametros.";
        return res.status(406).send();
    }

    else{
        comentarios.push(comentario);
        return res.status(201).json(comentario);
    }
});

//Validar id, si no ERROR 404
//Eliminar comentario de la lista con 200
app.delete('/blog-api/remover-comentario/:id', (req, res) =>{
    
    let id = req.params.id;

    let result = comentarios.find((elemento) => {
        if(elemento.id == id){
            return elemento;
        }
    });

    if(result){
        let removeIndex = comentarios.map(function(item) { return item.id; }).indexOf(id);
        comentarios.splice(removeIndex, 1);

        return res.status(200).send();
    }
    else{
        res.statusMessage = "El id no existe.";
        return res.status(404).send();
    }

});

//Revisar si id es enviado, si no ERROR 406
//Validar id, si no ERROR 409
//Si no viene ningun campo ERROR 406
//Actualizar datos y regresar comentario actualizado con 202
app.put('/blog-api/actualizar-comentario/:id', jasonParser, (req, res) =>{
    
    let idBody = req.body.id;
    let idParam = req.params.id;
    let {titulo, contenido, autor} = req.body;

    if(idBody == "" || id == undefined){
        res.statusMessage = "El id no se encuentra en el cuerpo del request.";
        return res.status(406).send();
    }
    else if(idParam != idBody){
        res.statusMessage = "El id de parametro no coincide con el id del cuerpo.";
        return res.status(409).send();
    }
    else if((titulo == "" && contenido == "" && autor == "") || (titulo && undefined || contenido && undefined || autor && undefined)){
        res.statusMessage = "Hace falta algun dato a actualizar.";
        return res.status(406).send();
    }
    else{
        for(let i = 0; i < comentarios.length; i++){
            if(comentarios[i].id === idBody){
                let x = i;
            }
        }

        if(titulo != "" && titulo != undefined){
            comentarios[x].titulo = titulo;
        }
        if(contenido != "" && contenido != undefined){
            comentarios[x].contenido = contenido;
        }
        if(autor != "" && autor != undefined){
            comentarios[x].autor = autor;
        }

        return res.status(202).json(comentarios[x]);
    }

});

app.listen(8080, () =>{
    console.log("Servidor corriendo en puerto 8080.");
});