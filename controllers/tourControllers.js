exports.checkID = (req,res,next,val) => {
  console.log(`requested id is ${val}`);
  next();
}

exports.getAllTours =(req,res) => {
  res.json({
    status: "success"
  });
}

exports.createTour =(req,res) => {
  res.json({
    status: "success"
  });
}

exports.getTour =(req,res) => {
  res.json({
    status: "success"
  });
}

exports.updateTour =(req,res) => {
  res.json({
    status: "success"
  });
}

exports.deleteTour =(req,res) => {
  res.json({
    status: "success"
  });
}

exports.checkBody =(req,res,next) => {
  if(!req.body.name || !req.body.price){
    return res.status(400).json({
      status: "failed",
      message: "pls provide name and price"
    })
  }
  next();
}
