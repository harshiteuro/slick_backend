const fetchModel=require('../models/fetchModel');

function fetchController(req,res){
    //validation
    const type=req.body.type
    if(type!='plum_products' && type!='kopari_products' && type!='mcaffeine_products' && type!='yogabars_products'){
        return res.status(400).json({ error: 'Invalid product type' });
    }    

    fetchModel(type, (error, results) => {
      if (error) {
        // Handle the error
        return res.status(400).json(error);
      } else {
        // Use the results array here
        return res.status(200).json(results);
      }
    });
}
    //fetch data using model

module.exports=fetchController;

