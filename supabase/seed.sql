-- ============================================
-- SEED DATA FOR HAMAK BAR
-- Run this AFTER running the migration
-- ============================================

-- ============================================
-- STYLISTS
-- ============================================
INSERT INTO stylists (id, name, bio, specialties, is_active) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 'Mohammed Al-Hassan', 'Expert in moderne fadestijlen en klassieke knipbeurten. 10 jaar ervaring.', ARRAY['Skin Fade', 'Klassiek', 'Baard', 'Design'], TRUE),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'Ahmed El-Khalid', 'Specialist in haarkleur en highlights. Trendy stijlen voor de moderne man.', ARRAY['Haarkleur', 'Highlights', 'Modern', 'Behandeling'], TRUE),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'Youssef Ben-Ali', 'Baardspecialist en meester in skin fades. Perfectionist in elk detail.', ARRAY['Baard', 'Skin Fade', 'Kids', 'Haar'], TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SERVICES
-- ============================================
INSERT INTO services (name, description, duration_minutes, price, deposit_amount, category, is_active) VALUES
  ('Klassieke Knipbeurt', 'Professionele knipbeurt inclusief wassen, knippen en stylen met premium producten.', 45, 25.00, 0.00, 'haircut', TRUE),
  ('Skin Fade', 'De populairste fade waarbij het haar van vrijwel kaal naar langer overgaat. Scherp en strak resultaat.', 60, 35.00, 10.00, 'haircut', TRUE),
  ('Baard Trim', 'Professioneel trimmen en shapen van de baard voor een verzorgde look.', 30, 20.00, 0.00, 'beard', TRUE),
  ('Baard Behandeling', 'Complete baardverzorging inclusief shaping, trimmen, conditioning en styling.', 45, 30.00, 0.00, 'beard', TRUE),
  ('Haarkleur', 'Professionele haarverf behandeling voor een nieuwe look. Inclusief advies.', 90, 65.00, 20.00, 'color', TRUE),
  ('Highlights', 'Trendy highlights voor meer diepte en dimensie in het haar.', 75, 55.00, 15.00, 'color', TRUE),
  ('Kinder Knipbeurt', 'Vriendelijke knipbeurt voor kinderen tot 12 jaar. Geduldig en professioneel.', 30, 18.00, 0.00, 'kids', TRUE),
  ('Haarbehandeling', 'Intensieve behandeling voor beschadigd of droog haar. Herstel en glans.', 60, 40.00, 0.00, 'treatment', TRUE)
ON CONFLICT DO NOTHING;

-- ============================================
-- AVAILABILITY RULES (Mon-Sat, 09:00-18:00)
-- ============================================
DO $$
DECLARE
  stylist_ids UUID[] := ARRAY[
    'a1b2c3d4-0001-0001-0001-000000000001'::UUID,
    'a1b2c3d4-0002-0002-0002-000000000002'::UUID,
    'a1b2c3d4-0003-0003-0003-000000000003'::UUID
  ];
  s_id UUID;
  day_num INTEGER;
BEGIN
  FOREACH s_id IN ARRAY stylist_ids LOOP
    FOR day_num IN 1..6 LOOP -- Monday (1) through Saturday (6)
      INSERT INTO availability_rules (stylist_id, day_of_week, start_time, end_time, buffer_minutes)
      VALUES (s_id, day_num, '09:00', '18:00', 10)
      ON CONFLICT (stylist_id, day_of_week) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- ============================================
-- PRODUCTS
-- ============================================
INSERT INTO products (name, description, price, stock_quantity, category, is_active) VALUES
  ('Premium Pomade', 'Sterke hold met een matte finish. Perfect voor moderne stijlen en textuur.', 18.00, 50, 'Pomade', TRUE),
  ('Beard Oil', 'Verzachtende baardolie met premium ingrediënten. Hydrateert en verzorgt.', 22.00, 35, 'Beard', TRUE),
  ('Sea Salt Spray', 'Geef je haar textuur en volume met dit premium zeezout spray. Voor de beach look.', 15.00, 45, 'Hair', TRUE),
  ('Shampoo Set', 'Professionele shampoo en conditioner set voor haar en baard. Salon kwaliteit thuis.', 28.00, 30, 'Hair', TRUE),
  ('Beard Balm', 'Styling balm voor baard met kokosolie en bijenwas. Stijlt en verzorgt.', 19.00, 40, 'Beard', TRUE)
ON CONFLICT DO NOTHING;

-- ============================================
-- REVIEWS (5 published reviews)
-- ============================================
-- Note: Reviews require user_id from auth.users
-- These are example reviews - in production they would be linked to real users
-- For seeding purposes, we use a placeholder that needs to be updated

-- ============================================
-- END OF SEED DATA
-- ============================================
-- To add an admin user, run after creating the user:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
