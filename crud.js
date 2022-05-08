import crud from '/models/crud'
const crud = require('../model/crud')

//Mostrar
module.exports.mostrar = (req, res) => {
    crud.find({}, (error, cruds)=>{
        if(error) {
            return res.status(500).json({
                message: 'Error mostrando el crud',
            })
        }
        return res.render('crud', { cruds: cruds  })
    })
}



const CrudController = require('../controllers/crudController')