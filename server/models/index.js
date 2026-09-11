import { DataTypes } from 'sequelize';
import { getDatabase } from '../config/database.js';

let models;

export const getModels = () => {
  if (models) return models;
  const sequelize = getDatabase();
  const modelOptions = { timestamps: false, underscored: true };
  models = {
    User: sequelize.define('User', {
      id: { type: DataTypes.STRING(80), primaryKey: true },
      name: { type: DataTypes.STRING(120), allowNull: false },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(255), allowNull: false },
      role: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'customer' }
    }, { ...modelOptions, tableName: 'users' }),
    SiteContent: sequelize.define('SiteContent', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      heroEyebrow: DataTypes.STRING(255), heroTitle: DataTypes.STRING(255), heroText: DataTypes.TEXT,
      phone: DataTypes.STRING(80), email: DataTypes.STRING(255), address: DataTypes.STRING(255), instagram: DataTypes.STRING(500),
      homeIntroTitle: DataTypes.STRING(255), homeIntroText: DataTypes.TEXT, homeCtaTitle: DataTypes.STRING(255),
      aboutTitle: DataTypes.STRING(255), aboutBio: DataTypes.TEXT, aboutBioExtra: DataTypes.TEXT,
      faqIntro: DataTypes.STRING(255), footerDescription: DataTypes.TEXT
    }, { ...modelOptions, tableName: 'site_content' }),
    PortfolioItem: sequelize.define('PortfolioItem', {
      id: { type: DataTypes.STRING(80), primaryKey: true }, title: { type: DataTypes.STRING(255), allowNull: false }, category: { type: DataTypes.STRING(100), allowNull: false }, image: { type: DataTypes.STRING(1000), allowNull: false }
    }, { ...modelOptions, tableName: 'portfolio_items' }),
    Service: sequelize.define('Service', {
      id: { type: DataTypes.STRING(80), primaryKey: true }, name: { type: DataTypes.STRING(255), allowNull: false }, price: DataTypes.STRING(80), duration: DataTypes.STRING(80), description: DataTypes.TEXT, image: DataTypes.STRING(1000), features: DataTypes.JSON
    }, { ...modelOptions, tableName: 'services' }),
    Booking: sequelize.define('Booking', {
      id: { type: DataTypes.STRING(80), primaryKey: true }, name: { type: DataTypes.STRING(120), allowNull: false }, phone: { type: DataTypes.STRING(80), allowNull: false }, email: { type: DataTypes.STRING(255), allowNull: false }, eventType: { type: DataTypes.STRING(100), allowNull: false }, date: { type: DataTypes.DATEONLY, allowNull: false }, time: { type: DataTypes.STRING(30), allowNull: false }, message: DataTypes.TEXT, status: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'new' }, adminNotes: DataTypes.TEXT, createdAt: DataTypes.DATE, updatedAt: DataTypes.DATE
    }, { ...modelOptions, tableName: 'bookings' }),
    Review: sequelize.define('Review', {
      id: { type: DataTypes.STRING(80), primaryKey: true }, name: { type: DataTypes.STRING(120), allowNull: false }, city: { type: DataTypes.STRING(120), allowNull: false }, rating: { type: DataTypes.INTEGER, allowNull: false }, title: { type: DataTypes.STRING(255), allowNull: false }, description: { type: DataTypes.TEXT, allowNull: false }, image: DataTypes.STRING(1000), status: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'pending' }, createdAt: DataTypes.DATE
    }, { ...modelOptions, tableName: 'reviews' }),
    Notification: sequelize.define('Notification', {
      id: { type: DataTypes.STRING(80), primaryKey: true }, type: { type: DataTypes.STRING(100), allowNull: false }, bookingId: DataTypes.STRING(80), title: { type: DataTypes.STRING(255), allowNull: false }, message: DataTypes.TEXT, read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }, createdAt: DataTypes.DATE
    }, { ...modelOptions, tableName: 'notifications' })
  };
  return models;
};
