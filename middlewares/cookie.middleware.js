module.exports = {
  visit: (req, res, next) => {
    res.cookie('test', 123);
    if (req.cookies.test === undefined) {
      var count = 0;
    }
    else {
      count ++;
    }
    console.log(count);
    next();
  },
  count: (req, res, next) => {
    console.log(req.cookies)
  }
}