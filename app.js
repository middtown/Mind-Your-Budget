//set up modules for javascript... utilize closures and an ifee
//simply an anonymous function rapped in parenthisis.
//keeps variables private and have stand alone functionality if needed to expand logic

//Budget Controller
const budgetController = (function () {

  //function constructor to create objects of info for expenses
  let Expenses = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  //function constructor to create objects of info  for income
  let Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let calculateTotal = function (type) {
    let sum = 0;

    data.allItems[type].forEach(function (current) {
      sum += current.value;
    });
    data.totals[type] = sum;
  }

  //stores income and expenses into an object data structure for simlper and easier storage
  let data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1, //set to -1 to say it is non exsistant, the numerical v. of false
  };

  //allow other modules to add to the data structure
  return {
    addItem: function (type, desc, val) {
      var newItem, Id;

      //create new id
      if (data.allItems[type].length > 0) {
        Id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        Id = 0;
      }

      // create new item based on inc or exp type
      if (type === 'exp') {
        newItem = new Expenses(Id, desc, val);
      } else if (type === 'inc') {
        newItem = new Income(Id, desc, val);
      }

      // push it into our data structure
      data.allItems[type].push(newItem);

      //return the new element
      return newItem;
    },

    calculateBudget: function () {

      //calculate total income and expensesLabel
      calculateTotal('exp');
      calculateTotal('inc');

      //calculate the budget: income - expensesLabel
      data.budget = data.totals.inc - data.totals.exp;

      //calculate the percentage of income that we setupEventListeners
      data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);

    },

    testing: function () {
      console.log(data);
    },
  };
})();

//another module - closure and ifee
//keeps variables private and have stand alone functionality if needed to expand logic

//UI Controller
const UIController = (function () {

  const domClassesOrIds = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
  };

  return {
    getinput: function () {
      return {
        type: document.querySelector(domClassesOrIds.inputType).value, //will be either inc or exp
        description: document.querySelector(domClassesOrIds.inputDescription).value,
        value: parseFloat(document.querySelector(domClassesOrIds.inputValue).value),
      };
    },

    addListItem: function (obj, type) {
        let html, newHtml, element;

        // Create HTML string with placeholder text

        if (type === 'inc') {
          element = domClassesOrIds.incomeContainer;

          html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (type === 'exp') {
          element = domClassesOrIds.expensesContainer;

          html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }

        // Replace the placeholder text with some actual data
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', obj.value);

        // Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
      },

    clearFields: function () {

      let fields = document.querySelectorAll(domClassesOrIds.inputDescription +
      ', ' + domClassesOrIds.inputValue);

      //trick list being returned from querySelectorAll as a list into becoming an array in order to work with and array.
      let fieldsArray = Array.prototype.slice.call(fields);

      //loop over the newly created array of fields and clear fields after
      fieldsArray.forEach(function (currentVal, index, array) {
        currentVal.value = '';
      });

      fieldsArray[0].focus();
    },

    getdomClassOrId: function () {
      return domClassesOrIds;
    },
  };
})();

//yep... another module / controller based off of closers / this tells everything what to do

//Overall global app controller
const controller = (function (budgetCtrl, UICtrl) {

  //bringing in availablitiy of query selectors to UI controller
  let DOM = UICtrl.getdomClassOrId();

  //all eventlisteners placed here
  let setupEventListeners = function () {
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  let updateBudget = function () {

        //calculate the budget


        //return th budget

        //display the budget in the UI
  };

  //what happens once button is clicked
  let ctrlAddItem = function () {
    console.log('ctrlAddItem called');

    //get field input data upon click
    let input = UICtrl.getinput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      //add item to budget controller
      let newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      //add item to user interface for view
      UICtrl.addListItem(newItem, input.type);

      //clear fields
      UICtrl.clearFields();

      //updateBudget and calculateBudget function call
      updateBudget();
    }
  };

  return {
    init: function () {
      console.log('application has started');
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
