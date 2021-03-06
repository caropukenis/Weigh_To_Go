// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
var bcrypt = require("bcryptjs");
// Creating our User model
module.exports = function(sequelize, DataTypes) {
  console.log("in user.js");
  var User = sequelize.define("User", {
    // The email cannot be null, and must be a proper email before creation
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // The username cannot be null
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      lowercase: true,
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    current_height: {
      type: DataTypes.INTEGER,
      allowNull: false
    },   
    current_weight: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    goal_weight: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
/*    calories_per_day: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
*/
  });
  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
    console.log("in user.js after sequelize")
    User.prototype.validPassword = function(password) {
      return bcrypt.compareSync(password, this.password);
    };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.addHook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });
  return User;
};