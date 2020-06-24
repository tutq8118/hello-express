const Transaction = require('../models/transaction.model');

module.exports = {  
  index: async (request, response) => {
    var transactions = await Transaction.find();
    response.render("transactions", {
      transactions
    });
  },
  create: (request, response) => {
    
  },
  remove: (request, response) => {
    const id = request.params.id;
    Transaction.findByIdAndDelete({_id: id}, () => console.log('done'));
    response.redirect("back");
  },
  edit: (request, response) => {
    
  },
  update: (request, response) => {
    
  },
  complete: async (request, response) => {
    const id = request.params.id;
    const transaction = await Transaction.findById(id);

    if (transaction.isCompleted === false || transaction.isCompleted == null) {
      Transaction.findOneAndUpdate(
        {_id: id},
        {$set:{isCompleted: true}},
        {new: true},
        () => {
          response.redirect("/transactions");
        }
      )
    } else {
      Transaction.findOneAndUpdate(
        {_id: id},
        {$set:{isCompleted: false}},
        {new: true},
        () => {
          response.redirect("/transactions");
        }
      )
    }
  }
}