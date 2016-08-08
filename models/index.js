var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack');

var Page = db.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('open', 'closed'),
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.TEXT)
  }
}, {
  getterMethods: {
    route: function() {
      return '/wiki/' + this.urlTitle
    }
  },
  hooks: {
    beforeValidate: function(page,options) {
      page.urlTitle = urltitlegenerator(page.title)
    }
  }
})

var urltitlegenerator = function(title) {
  if (!title) {
    var result = '';
    var chars = 'qwe;oiqewn;agkln;adsvjp[oqewkon32lkbruiewjgfsdb;lg4890641230756-4806[u15p39y'
    for (var i = 8; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  } else {
    return title.replace(/\W/g, '_')
  }
}

var User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    isEmail: true
  }
})

module.exports = {
  Page: Page,
  User: User
}
Page.belongsTo(User, { as: 'author'});
