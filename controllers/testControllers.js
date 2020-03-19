exports.test = (req, res) => {
  const data = req.get('Authorization');
  res.json({
    data
  });
};
