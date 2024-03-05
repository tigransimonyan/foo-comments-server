import { fetchSiteToken } from '@/services/metadata';
import { asyncRoute } from '@/services/express';
import Site from './model';

export const add = asyncRoute(async (req, res) => {
  const websiteUrl = new URL(req.body.url);
  const domain = websiteUrl.hostname;
  const token = await fetchSiteToken(websiteUrl.href);
  console.log(token, req.user.id);
  if (token !== req.user.id) {
    res.status(401).json({ message: 'Meta tag not found' });
    return;
  }

  const exists = await Site.findOne({ domain });

  if (exists) {
    res.status(401).json({ message: 'Website already exists' });
    return;
  }

  const site = await Site.create({
    verified: true,
    userId: req.user.id,
    domain: websiteUrl.hostname
  });

  res.json(site);
});

export const list = asyncRoute(async (req, res) => {
  const sites = await Site.find({ userId: req.user.id });

  res.json(sites);
});
