const express = require('express');
const session = require('express-session');
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const app = express();

const initDB = require('./config/db');
const model = require('./models/app');
const Crud = require('./models/Crud');

//Motor de plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.all('/user',(req, res, next) => {
    console.log('Por Aqui Pasamos');
    next();
});

app.use(bodyParser.urlencoded({ 
    limit: '20mb',
    extended: false }));

app.use(bodyParser.json({
    limit: '20mb'
}));

app.use(
    session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false,
    })
);

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});



//----------------------------------------//
//--------------USER----------------------//
//----------------------------------------//

app.get('/', (req, res) => {
    
    res.render('login');
    
});

app.post('/', (req, res) => {
    const data = model(req.body);
    
    console.log(`post pagina de login ${req.body.username}`);
    console.log(`post pagina de login ${req.body.password}`);
    
    model.find(req.body)
         .then(async (docs) =>  {
            await 
            console.log(docs)
            if(docs != ''){
                for(var i=0; i< docs.length; i++){
                   if(docs[i].username == data.username && docs[i].password == data.password){
                        console.log('Valor encontrado' + docs);  
                        //res.sendFile(__dirname + '/public/crud.html');
                        const user = {
                            nombre : docs[i].username,
                            password : docs[i].password
                        }; 
                        jwt.sign({user: user}, 'secretkey', (err, token) => {
                            res.redirect(301,'http://localhost:3000/show');
                        });
                    }
                }
            }else{
                res.render('login');
            }
          })
         .catch((error) => {
            console.log('Error en Login: ' + error);  
            res.render('login');
         });

});


//----------------------------------------//
//--------------REGISTER------------------//
//----------------------------------------//

app.get('/register', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (error, authData) => {
        if(error){
            console.log(`get pagina de register`);
            res.render('register');
        }else{
            console.log(`get pagina de register`);
            res.render('register');
        }

    })
});

app.post('/register', (req, res) => {

    console.log(`post pagina de register ${req.body.username}`);
    console.log(`post pagina de register ${req.body.password}`);
    console.log(`post pagina de register ${req.body.repeatpassword}`);
    console.log(`post pagina de register ${req.body.email}`);

    const data = req.body;

    model.create(data, (err, docs) =>{
        if(err){
            console.log('Error ', err);
            res.render('login');
        }else{
            console.log({data:docs});
            res.render('crud');
        }
        
    })
});

//----------------------------------------//


app.post('/user',(req, res) => {
    res.send('Peticion POST User Recibida');
    console.log('Se ejecuto mi POST');
});

app.put('/user',(req, res) => {
    res.send('Peticion POST User Recibida');
});

app.delete('/user',(req, res) => {
    res.send('<h1>Peticion de Eliminacion Recibida</h1>');
});

//----------------------------------------//

app.post('/about/:id',(req, res) => {
    console.log(req.body);
    console.log(req.params);
    res.send(`Peticion POST ${req.params.id}`);
    console.log('Se ejecuto mi POST');
});

app.put('/about',(req, res) =>{
    res.json({
        username: 'Jacko',
        lastname: 'Paredes'
      });
});

app.get('/contact',(req, res) =>{
    for(var i=0; i<obj.length;i++){
      console.log('Nombre: ' + obj[i].name + ', ' + obj[i].edad);
    }
    res.send('Parseo Correcto del JSON');
});

//---------------------------------------------//

//Authorization Bearer <token>
function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    }
    else{
        res.render('register');
    }
}

//Crud

//Guardar CREATE
app.post('/add', async (req, res) => {

    const crud = Crud(req.body)

    const crudSaved = await crud.save()

    //console.log(crudSaved)
    
    res.redirect('http://localhost:3000/show');
})

//Mostrar READ
app.get('/show', async (req, res) => {

    const cruds = await Crud.find()

    //console.log(cruds)

    res.render('crud', { crud: cruds });
})

//Editar 
app.get('/edit/:id', async (req, res) => {

    const id = req.params.id;

    Crud.findById(id, (err, Crud) => {
        if(err){
            res.redirect('http://localhost:3000/show');
        } else{
            if(Crud == null){
                res.redirect('http://localhost:3000/show');
            }else{
                res.render('edit_crud', {
                    title: 'Edit Crud',
                    crud: Crud,
                });
            }
        }
    });
});

//Actualizar UPDATE
app.post('/update/:id', async (req,res) => {

    const { name, rol, maestria } = req.body;
    const crudUpdated = await Crud.findByIdAndUpdate(req.params.id, { name, rol, maestria});
    console.log(crudUpdated);
    res.redirect('http://localhost:3000/show');

});

//Eliminar DELETE
app.get('/delete/:id', async (req, res) => {

    const id = req.params.id;

    const crudDeleted = await Crud.findByIdAndRemove(id);

    //console.log(crudDeleted);

    res.redirect('http://localhost:3000/show');

})

//middleware
app.use(express.urlencoded({ extended: false}));

app.use(express.static('public'));

app.listen(3000, ()=> {
    console.log('Servidor en Puerto 3000');
});

initDB();