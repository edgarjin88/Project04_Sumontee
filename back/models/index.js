const Sequelize = require('sequelize');
const env =process.env.NODE_ENV || 'development';
const config = require('../config/config')[env]; //config json 불러오기
const db = {};
// console.log('this is procees.env', process.env.NODE_ENV) 
// console.log('this is procees.env', env) 
const sequelize = new Sequelize(config.database, config.username, config.password, config);

//마지막에 config은 파일 정보를 말하는 것. 

db.Comment = require('./comment')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.Image = require('./image')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Room = require('./room')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);
db.Message = require('./message')(sequelize, Sequelize);


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
