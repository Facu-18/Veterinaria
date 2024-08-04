import Mascota from '../models/Mascota.js'
import Especies from '../models/Especie.js'
import { check, validationResult } from 'express-validator'

const formCrearMascota = async (req,res)=>{
    const especies = await Especies.findAll()
    
    res.render('registrar-mascota',{
        nombrePagina: 'Registra a tu Mascota',
        especies,
        datos : {},
        errores : []
    })
}

const crearMascota = async (req,res)=>{
    const usuario_id= req.user.id
    const {nombre, edad, especie_id} = req.body
  
  
  // Validaciones
  await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req);
  await check('edad').isInt({ min: 0 }).withMessage('La edad debe ser un número positivo').run(req);
  await check('especie_id').notEmpty().withMessage('La especie es obligatoria').run(req);

  const resultado = validationResult(req)

  if(!resultado.isEmpty()){
    const especies = await Especies.findAll()
    res.render('registrar-mascota',{
        nombrePagina: 'Registra a tu Mascota',
        especies,
        datos : req.body,
        errores : resultado.array()
    })
  }

  await Mascota.create({
    nombre,
    edad,
    especie_id,
    usuario_id
  })

}


export{
    formCrearMascota,
    crearMascota
}