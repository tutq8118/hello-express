const User = require('../models/user.model');

module.exports = {
  index: async (request, response) => {
    const users = await User.find();
    response.render("users", {
      users
    });
  },  
  remove: (request, response) => {
    const id = request.params.id;
    User.findOneAndDelete({_id: id},
      () => {
        console.log('done');
      }
    );
    response.redirect("/users");
  },
  edit: async (request, response) => {
    const id = request.params.id;
    const user = await User.findById(id);
    response.render("users/edit", {
      user
    });
  },
  update: (request, response) => {
    const id = request.params.id;
    const newName = request.body.name;

    User.findOneAndUpdate(
      {_id: id},
      {$set:{name: newName}},
      {new: true},
      (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        else {
          response.redirect("/users");
        }
      });
  }
}