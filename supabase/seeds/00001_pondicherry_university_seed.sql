-- Pondicherry University Baseline Seed File

-- 1. Insert Pondicherry University Campus
INSERT INTO campuses (id, name, status)
VALUES ('00000000-0000-0000-0000-000000000001', 'Pondicherry University', 'active')
ON CONFLICT (name) DO UPDATE SET status = 'active';

-- 2. Approved Email Domains
INSERT INTO approved_email_domains (campus_id, domain, is_active)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'pondiuni.edu.in', true),
  ('00000000-0000-0000-0000-000000000001', 'pondiuni.ac.in', true)
ON CONFLICT (domain) DO UPDATE SET is_active = true;

-- 3. Official Schools
INSERT INTO schools (id, campus_id, name, slug)
VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'School of Engineering & Technology', 'engineering-technology'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'School of Management', 'management'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'School of Physical Chemical & Mathematical Sciences', 'physical-mathematical-sciences'),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'School of Life Sciences', 'life-sciences'),
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'School of Social Sciences & International Studies', 'social-sciences'),
  ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'School of Humanities', 'humanities')
ON CONFLICT (campus_id, slug) DO UPDATE SET name = EXCLUDED.name;

-- 4. Departments
INSERT INTO departments (id, school_id, name, slug)
VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Department of Computer Science', 'computer-science'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Department of Information Technology', 'information-technology'),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'Department of Management Studies', 'management-studies'),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'Department of Commerce', 'commerce'),
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', 'Department of Physics', 'physics'),
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000003', 'Department of Chemistry', 'chemistry'),
  ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000004', 'Department of Biotechnology', 'biotechnology'),
  ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000005', 'Department of Economics', 'economics'),
  ('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000006', 'Department of English', 'english')
ON CONFLICT (school_id, slug) DO UPDATE SET name = EXCLUDED.name;

-- 5. Programmes
INSERT INTO programmes (id, department_id, name, level)
VALUES
  (uuid_generate_v4(), '20000000-0000-0000-0000-000000000001', 'M.Tech Computer Science & Engineering', 'PG'),
  (uuid_generate_v4(), '20000000-0000-0000-0000-000000000001', 'Master of Computer Applications (MCA)', 'PG'),
  (uuid_generate_v4(), '20000000-0000-0000-0000-000000000001', 'M.Sc Data Science & Analytics', 'PG'),
  (uuid_generate_v4(), '20000000-0000-0000-0000-000000000003', 'Master of Business Administration (MBA)', 'PG'),
  (uuid_generate_v4(), '20000000-0000-0000-0000-000000000004', 'M.Com Business Finance', 'PG'),
  (uuid_generate_v4(), '20000000-0000-0000-0000-000000000005', 'M.Sc Physics', 'PG'),
  (uuid_generate_v4(), '20000000-0000-0000-0000-000000000008', 'M.A. Applied Economics', 'PG'),
  (uuid_generate_v4(), '20000000-0000-0000-0000-000000000009', 'M.A. English & Comparative Literature', 'PG');

-- 6. Categories
INSERT INTO categories (id, name, slug, description, icon, is_prohibited)
VALUES
  (uuid_generate_v4(), 'Books & Textbooks', 'books-textbooks', 'Coursebooks, reference materials, lab manuals, fiction', 'book-open', false),
  (uuid_generate_v4(), 'Electronics & Gadgets', 'electronics', 'Laptops, phones, chargers, headphones, calculators', 'laptop', false),
  (uuid_generate_v4(), 'Furniture & Hostel Essentials', 'furniture-hostel', 'Study tables, chairs, mattresses, buckets, desk lamps', 'bed', false),
  (uuid_generate_v4(), 'Clothing & Apparel', 'clothing', 'Winter jackets, ethnic wear, shoes, lab coats', 'shirt', false),
  (uuid_generate_v4(), 'Tutoring & Academic Services', 'tutoring-services', 'Exam prep, coding mentorship, subject tutoring', 'graduation-cap', false),
  (uuid_generate_v4(), 'Technical & Coding Services', 'technical-services', 'Web development, bug fixing, project debugging', 'code', false),
  (uuid_generate_v4(), 'Design & Creative Services', 'design-creative', 'Poster design, presentation formatting, video editing', 'palette', false),
  (uuid_generate_v4(), 'Laundry & Hostel Services', 'laundry-services', 'Clothes washing, ironing, room cleaning help', 'washing-machine', false),
  (uuid_generate_v4(), 'Event Tickets & Passes', 'tickets-passes', 'Campus fests, sports events, workshop passes', 'ticket', false),
  (uuid_generate_v4(), 'Other Permitted Items', 'other', 'General items complying with campus policy', 'box', false)
ON CONFLICT (slug) DO UPDATE SET description = EXCLUDED.description;

-- 7. Safe Campus Pickup Zones
INSERT INTO pickup_zones (id, campus_id, name, description, is_safe_zone)
VALUES
  (uuid_generate_v4(), '00000000-0000-0000-0000-000000000001', 'Ananda Rangapillai Central Library', 'High-visibility entrance foyer with CCTV monitoring', true),
  (uuid_generate_v4(), '00000000-0000-0000-0000-000000000001', 'Silver Jubilee Campus Gate Security Foyer', 'Main campus entrance gate near campus security booth', true),
  (uuid_generate_v4(), '00000000-0000-0000-0000-000000000001', 'Science Complex Central Canteen', 'Popular open seating area during daytime campus hours', true),
  (uuid_generate_v4(), '00000000-0000-0000-0000-000000000001', 'Administrative Building Main Foyer', 'Central campus administration lobby area', true),
  (uuid_generate_v4(), '00000000-0000-0000-0000-000000000001', 'Girls Hostel Complex Security Desk', 'Secure meeting area at the hostel main entry gate', true),
  (uuid_generate_v4(), '00000000-0000-0000-0000-000000000001', 'Boys Hostel Complex Security Desk', 'Secure meeting area at the hostel complex gate', true)
ON CONFLICT (campus_id, name) DO UPDATE SET description = EXCLUDED.description;
