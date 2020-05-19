const db = require('../db');
const shortid = require("shortid");
const users = db.get("users").value();

module.exports = {
  create: (req, res, next) => {
    const name = req.body.name;
     if (name.length > 30) {
      res.render("users", {
        users,
        status: 'overLetter'
      });
    }
    else {
      next();  
    }
  }
}