const mongoose = require('mongoose');
const password = '99rR7khZeeaF5xOQ';
const dbname = 'lab6';
const uri = 'mongodb+srv://genaro:99rR7khZeeaF5xOQ@cluster0.rulbw.mongodb.net/lab6?retryWrites=true&w=majority';



module.exports = () => {
    
    const connect = ()=>{
        mongoose.connect(
            uri,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                keepAlive: true
            },
            (err) => {
                if(err){
                    console.log('Error en conexion a BD...!!!');
                }else{
                    console.log('Conexion Correcta..........!!!')
                }
            }
        )
    }

    connect();
};
