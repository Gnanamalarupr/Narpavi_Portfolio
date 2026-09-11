import { Sequelize } from 'sequelize';

let sequelize;

export const getDatabase = () => {
  if (!sequelize) {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3306),
      dialect: 'mysql',
      logging: false,
      define: { underscored: true }
    });
  }
  return sequelize;
};

export const connectDatabase = async () => {
  await getDatabase().authenticate();
  console.log('MySQL database connected');
};
