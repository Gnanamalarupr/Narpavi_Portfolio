import { getModels } from '../models/index.js';

const plain = (item) => { const { id, ...content } = item.toJSON(); return content; };
export const getSite = async () => {
  const site = await getModels().SiteContent.findByPk(1);
  return site ? plain(site) : {};
};
export const updateSite = async (data) => {
  const SiteContent = getModels().SiteContent;
  const [site] = await SiteContent.findOrCreate({ where: { id: 1 }, defaults: data });
  await site.update(data);
  return plain(site);
};
