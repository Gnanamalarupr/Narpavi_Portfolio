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
  await seedCollection(User, 'users.json');
  if (await SiteContent.count() === 0) await SiteContent.create(await readCollection('site.json'));
  await seedCollection(PortfolioItem, 'portfolio.json');
  await seedCollection(Service, 'services.json');
  await seedCollection(Booking, 'bookings.json');
  await seedCollection(Review, 'reviews.json');
  await seedCollection(Notification, 'notifications.json');
  console.log('MySQL tables initialized');
};
