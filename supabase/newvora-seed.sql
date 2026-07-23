-- ============================================================
-- Newvora demo — SEED DATA (catalogue + reviews)
-- Safe to run after newvora-schema.sql. Re-runnable (uses ON CONFLICT / NOT EXISTS).
-- Paste into Supabase -> SQL Editor -> Run.
-- Products render as elegant on-brand tiles even without photos.
-- ============================================================

-- 1) Pricing formula (one row drives the whole catalogue)
insert into pricing_settings (wholesale_markup_pct, retail_multiplier, mrp_multiplier, round_to)
select 12, 2.2, 2.75, 100
where not exists (select 1 from pricing_settings);

-- 2) Categories (slugs match the storefront links)
insert into categories (name, slug) values
  ('Necklaces','necklace'),
  ('Earrings','earrings'),
  ('Bracelets','bracelet'),
  ('Anklets','anklet'),
  ('Rings','ring')
on conflict (slug) do nothing;

-- 3) Products (base_wholesale is in paise; status published = visible on storefront)
insert into products (category_id, sku, name, base_wholesale, qty, status)
select c.id, v.sku, v.name, v.base, v.qty, 'published'::product_status
from (values
  -- necklaces
  ('necklace','NK-KUN-001','Kundan Rajwadi Necklace Set', 145000, 38),
  ('necklace','NK-MEE-002','Meenakari Peacock Haar',      132000, 26),
  ('necklace','NK-TMP-003','Temple Lakshmi Long Haar',    168000, 19),
  ('necklace','NK-POL-004','Polki Bridal Choker Set',     189000, 12),
  ('necklace','NK-PRL-005','Pearl Rani Haar',              98000, 44),
  ('necklace','NK-OXI-006','Oxidised Statement Necklace',  56000, 61),
  -- earrings
  ('earrings','ER-KUN-001','Kundan Chandbali Jhumka',      42000, 80),
  ('earrings','ER-MEE-002','Meenakari Peacock Jhumka',     38000, 72),
  ('earrings','ER-TMP-003','Temple Coin Jhumka',           47000, 54),
  ('earrings','ER-PRL-004','Pearl Drop Earrings',          29000, 96),
  ('earrings','ER-OXI-005','Oxidised Tribal Jhumka',       24000,110),
  ('earrings','ER-ADS-006','AD Stone Stud Tops',           33000, 68),
  -- bracelets
  ('bracelet','BR-KUN-001','Kundan Openable Kada',         62000, 40),
  ('bracelet','BR-MEE-002','Meenakari Bangle Set (2 pc)',  71000, 33),
  ('bracelet','BR-PRL-003','Pearl Charm Bracelet',         27000, 88),
  ('bracelet','BR-OXI-004','Oxidised Broad Cuff',          31000, 57),
  ('bracelet','BR-ADS-005','AD Tennis Bracelet',           45000, 49),
  -- anklets
  ('anklet','AN-OXI-001','Oxidised Ghungroo Payal',        22000,120),
  ('anklet','AN-SLV-002','Silver-tone Chain Anklet',       18000,140),
  ('anklet','AN-PRL-003','Pearl Beaded Anklet',            24000, 76),
  -- rings
  ('ring','RG-KUN-001','Kundan Cocktail Ring',             26000, 90),
  ('ring','RG-ADS-002','AD Solitaire Ring',                34000, 63),
  ('ring','RG-OXI-003','Oxidised Adjustable Ring',         16000,150),
  ('ring','RG-MEE-004','Meenakari Floral Ring',            21000, 84)
) as v(cat_slug, sku, name, base, qty)
join categories c on c.slug = v.cat_slug
on conflict (sku) do nothing;

-- 4) Colour variants for a few hero pieces (shows the variant system in the demo)
insert into variants (product_id, color, sku, qty)
select p.id, x.color, p.sku || '-' || x.suffix, x.qty
from (values
  ('NK-KUN-001','Gold','G',20),
  ('NK-KUN-001','Silver','S',18),
  ('ER-KUN-001','Gold','G',45),
  ('ER-KUN-001','Green','GR',35),
  ('BR-MEE-002','Red','R',18),
  ('BR-MEE-002','Blue','B',15)
) as x(psku, color, suffix, qty)
join products p on p.sku = x.psku
on conflict (sku) do nothing;

-- 5) Reviews (social proof — ratings + happy-customer quotes)
insert into reviews (product_id, author_name, rating, body, created_at)
select p.id, r.author, r.rating, r.body, now() - (r.days || ' days')::interval
from (values
  ('NK-KUN-001','Priya Sharma',5,'Wore it for my sister''s wedding — got so many compliments! Looks far richer than the price.',4),
  ('NK-KUN-001','Aarti M.',5,'The kundan work is beautiful and it''s surprisingly light to wear.',11),
  ('NK-MEE-002','Sneha R.',4,'Lovely meenakari colours. Delivery was quick too.',7),
  ('NK-TMP-003','Lakshmi Iyer',5,'Perfect temple design for festivals. Quality is excellent.',6),
  ('NK-POL-004','Ritu Bansal',5,'Bridal choker looked stunning in photos. Worth every rupee.',15),
  ('NK-PRL-005','Meena K.',4,'Elegant pearl haar, great for office parties.',9),
  ('ER-KUN-001','Divya P.',5,'These jhumkas are my new favourite. Anti-tarnish is real!',3),
  ('ER-MEE-002','Kavya S.',5,'Colours pop beautifully. Got a matching necklace too.',8),
  ('ER-PRL-004','Nisha T.',4,'Dainty and comfortable for all-day wear.',12),
  ('ER-OXI-005','Pooja V.',5,'Love oxidised jewellery and these are top quality.',5),
  ('BR-KUN-001','Shreya D.',5,'The openable kada fits perfectly and feels premium.',10),
  ('BR-MEE-002','Anjali G.',4,'Bangle set is gorgeous, colours as shown.',14),
  ('BR-PRL-003','Tara N.',5,'Cute pearl bracelet, delivered fast.',6),
  ('AN-OXI-001','Isha B.',5,'Ghungroo payal sounds lovely and looks classy.',9),
  ('AN-SLV-002','Riya J.',4,'Simple everyday anklet, good value.',13),
  ('RG-KUN-001','Neha A.',5,'Statement ring that goes with all my ethnic wear.',4),
  ('RG-ADS-002','Sana Q.',5,'AD stones sparkle like real diamonds. Impressed!',7),
  ('RG-OXI-003','Megha L.',4,'Adjustable and comfy, great little piece.',16),
  ('ER-TMP-003','Gauri M.',5,'Temple jhumkas are stunning for the price.',2),
  ('NK-OXI-006','Bhavna S.',5,'Bold oxidised necklace — perfect with kurtis.',5)
) as r(sku, author, rating, body, days)
join products p on p.sku = r.sku;
