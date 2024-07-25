const home = (req,res)=>{
    res.render('home',{
       nombrePagina : 'Inicio',
       layout: req.isAuthenticated() ? 'main-logged-in' : 'main' });
    
}

export {
    home
}