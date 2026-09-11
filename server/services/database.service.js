import { readCollection } from './jsonStore.service.js';
import { getDatabase } from '../config/database.js';
import { getModels } from '../models/index.js';

const seedCollection = async (Model, file, transform = (item) => item) => {
  if (await Model.count() > 0) return;
  const items = await readCollection(file);
  if (items.length) await Model.bulkCreate(items.map(transform));
};

export const initializeDatabase = async () => {
  const sequelize = getDatabase();
  const { User, SiteContent, PortfolioItem, Service, Booking, Review, Notification } = getModels();
  await sequelize.sync();
  const queryInterface = sequelize.getQueryInterface();
  await queryInterface.changeColumn('users', 'password', { type: User.rawAttributes.password.type, allowNull: true });
  for (const [name, definition] of [['google_id', { type: User.rawAttributes.googleId.type, allowNull: true, unique: true }], ['auth_provider', { type: User.rawAttributes.authProvider.type, allowNull: false, defaultValue: 'password' }]]) {
    try { await queryInterface.addColumn('users', name, definition); } catch (error) { if (!/duplicate|exists/i.test(error.message)) throw error; }
  }
  await seedCollection(User, 'users.json');
  if (await SiteContent.count() === 0) await SiteContent.create(await readCollection('site.json'));
  await seedCollection(PortfolioItem, 'portfolio.json');
  await seedCollection(Service, 'services.json');
  await seedCollection(Booking, 'bookings.json');
  await seedCollection(Review, 'reviews.json');
  await seedCollection(Notification, 'notifications.json');
  console.log('MySQL tables initialized');
};
