module.exports = {
  count: (req, res, next) => {
    console.log('<test>: ', `<${res.locals.count}>`);
    next();
  }
}