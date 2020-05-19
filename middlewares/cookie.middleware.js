module.exports = {
  visit: (req, res, next) => {
    res.cookie('isVisited', 123);
    next();
  },
  count: (req, res, next) => {
    console.log(req.cookies)
  }
}