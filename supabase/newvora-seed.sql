-- ============================================================
-- Newvora demo — SEED DATA (generic multi-domain catalogue)
-- Safe to run after newvora-schema.sql. Re-runnable.
-- Resets the demo catalogue, then loads a neutral modern-retail set that
-- any product business (apparel, home, wellness, tech, etc.) can relate to.
-- Paste into Supabase -> SQL Editor -> Run.
-- ============================================================

-- 0) Reset previous demo catalogue (CASCADE clears dependent demo rows: order items, etc.)
truncate table reviews, variants, product_images, products, categories restart identity cascade;

-- 1) Pricing formula (one row drives the whole catalogue)
insert into pricing_settings (wholesale_markup_pct, retail_multiplier, mrp_multiplier, round_to)
select 12, 2.2, 2.75, 100
where not exists (select 1 from pricing_settings);

-- 2) Categories (neutral, domain-agnostic)
insert into categories (name, slug) values
  ('Apparel','apparel'),
  ('Accessories','accessories'),
  ('Home & Living','home'),
  ('Wellness','wellness'),
  ('Tech','tech')
on conflict (slug) do nothing;

-- 3) Products (base_wholesale is in paise; status published = visible on storefront)
insert into products (category_id, sku, name, base_wholesale, qty, status)
select c.id, v.sku, v.name, v.base, v.qty, 'published'::product_status
from (values
  -- apparel
  ('apparel','AP-TSH-001','Classic Cotton T-Shirt',     45000,120),
  ('apparel','AP-SHR-002','Oxford Button-Down Shirt',   89000, 60),
  ('apparel','AP-HOD-003','Everyday Fleece Hoodie',    129000, 45),
  ('apparel','AP-JEN-004','Slim-Fit Jeans',           149000, 50),
  ('apparel','AP-KUR-005','Cotton Straight Kurta',      79000, 70),
  -- accessories
  ('accessories','AC-BAG-001','Canvas Tote Bag',        39000, 90),
  ('accessories','AC-WAL-002','Leather Bifold Wallet',  69000, 75),
  ('accessories','AC-BLT-003','Reversible Leather Belt',55000, 80),
  ('accessories','AC-CAP-004','Classic Baseball Cap',   29000,140),
  ('accessories','AC-SUN-005','Polarised Sunglasses',   99000, 40),
  -- home & living
  ('home','HM-MUG-001','Ceramic Coffee Mug',            25000,200),
  ('home','HM-CDL-002','Scented Soy Candle',            45000,110),
  ('home','HM-CSH-003','Linen Cushion Cover',           35000,130),
  ('home','HM-BOT-004','Insulated Water Bottle',        59000, 95),
  ('home','HM-LMP-005','Minimal Desk Lamp',            159000, 30),
  -- wellness
  ('wellness','WL-SRM-001','Vitamin C Face Serum',      79000, 85),
  ('wellness','WL-TEA-002','Herbal Green Tea (50 bags)',42000,150),
  ('wellness','WL-YOG-003','Non-Slip Yoga Mat',        119000, 55),
  ('wellness','WL-OIL-004','Lavender Essential Oil',    49000,100),
  -- tech
  ('tech','TC-EAR-001','Wireless Earbuds',             199000, 60),
  ('tech','TC-CHG-002','20W Fast Charger',              55000,120),
  ('tech','TC-CAB-003','Braided USB-C Cable',           25000,220),
  ('tech','TC-STD-004','Aluminium Laptop Stand',       149000, 40),
  ('tech','TC-PWR-005','10000mAh Power Bank',          129000, 70)
) as v(cat_slug, sku, name, base, qty)
join categories c on c.slug = v.cat_slug
on conflict (sku) do nothing;

-- 4) Variants (colour/size options — shows the variant system)
insert into variants (product_id, color, sku, qty)
select p.id, x.color, p.sku || '-' || x.suffix, x.qty
from (values
  ('AP-TSH-001','Black','BLK',45),
  ('AP-TSH-001','White','WHT',40),
  ('AP-TSH-001','Navy','NVY',35),
  ('AC-BAG-001','Natural','NAT',50),
  ('AC-BAG-001','Black','BLK',40),
  ('TC-EAR-001','White','WHT',30),
  ('TC-EAR-001','Black','BLK',30)
) as x(psku, color, suffix, qty)
join products p on p.sku = x.psku
on conflict (sku) do nothing;

-- 5) Reviews (social proof)
insert into reviews (product_id, author_name, rating, body, created_at)
select p.id, r.author, r.rating, r.body, now() - (r.days || ' days')::interval
from (values
  ('AP-TSH-001','Rahul V.',5,'Great fit and the fabric is genuinely soft. Bought three more.',3),
  ('AP-TSH-001','Meera K.',4,'True to size, colour exactly as shown.',9),
  ('AP-SHR-002','Arjun S.',5,'Crisp shirt, holds up well after washing.',6),
  ('AP-HOD-003','Nisha T.',5,'So cosy and warm — my go-to for winter.',5),
  ('AP-JEN-004','Karan M.',4,'Comfortable stretch, good everyday jeans.',12),
  ('AC-BAG-001','Priya D.',5,'Sturdy tote, roomy enough for groceries and a laptop.',4),
  ('AC-WAL-002','Sameer R.',5,'Slim, well-stitched leather. Looks premium.',8),
  ('AC-SUN-005','Ananya P.',4,'Nice polarised lenses, reduce glare well.',7),
  ('HM-MUG-001','Tara N.',5,'Lovely mug, keeps coffee warm and feels solid.',5),
  ('HM-CDL-002','Ishita B.',5,'Beautiful scent that fills the room without being heavy.',6),
  ('HM-BOT-004','Vikram J.',4,'Keeps water cold all day. Slightly heavy but worth it.',11),
  ('HM-LMP-005','Rohan A.',5,'Clean minimal design, perfect for my desk.',3),
  ('WL-SRM-001','Divya P.',5,'Skin looks brighter after a couple of weeks. Loved it.',4),
  ('WL-TEA-002','Sneha R.',4,'Refreshing and light. Good value for 50 bags.',10),
  ('WL-YOG-003','Pooja V.',5,'Great grip, does not slip even in hot yoga.',6),
  ('TC-EAR-001','Aditya K.',5,'Impressive sound for the price, pairing is instant.',2),
  ('TC-CHG-002','Neha A.',5,'Charges my phone super fast. Compact too.',7),
  ('TC-CAB-003','Manish L.',4,'Braided cable feels durable, good length.',13),
  ('TC-STD-004','Gaurav S.',5,'Sturdy stand, big improvement for my posture.',5),
  ('TC-PWR-005','Riya J.',5,'Charges my phone 2-3 times, slim enough for my bag.',4)
) as r(sku, author, rating, body, days)
join products p on p.sku = r.sku;

-- 6) Demo coupons (so discount codes work out of the box)
insert into vouchers (code, kind, value, min_order, cap, channel, usage_limit, active) values
  ('WELCOME10','percent',10,      0,   null,'retail',  null, true),
  ('FLAT100',  'flat',   10000, 99900, null,'retail',  null, true),
  ('SAVE15',   'percent',15,  150000, 30000,'all',      500, true)
on conflict (code) do nothing;
