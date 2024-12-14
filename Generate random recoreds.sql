INSERT INTO business (
    name,
    logo,
    "CEO",
    founder,
    founded,
    location_type,
    description,
    company_size,
    industry,
    website,
    headquarter,
    email,
    phone,
    created_at,
    updated_at,
    country,
    city
)
SELECT
    'Business ' || g AS name,
    'https://example.com/logo' || g || '.png' AS logo,
    'CEO ' || g AS ceo,
    'Founder ' || g AS founder,
    NOW() - (random() * INTERVAL '30 years') AS founded,
    'Onsite'::business_location_type_enum AS location_type,
    'Description for business ' || g AS description,
    floor(random() * 1000 + 1) AS company_size,
    (ARRAY['Technology', 'Healthcare', 'Finance', 'Education', 'Retail'])[floor(random() * 5 + 1)] AS industry,
    'https://www.business' || g || '.com' AS website,
    'HQ Address ' || g AS headquarter,
    'contact' || g || '@business.com' AS email,
    '+123456789' || g AS phone,
    NOW() AS created_at,
    NOW() AS updated_at,
    'Egypt'::business_country_enum AS country,
    'City ' || g AS city
FROM generate_series(1, 50000) g;

explain analyse select * from business where id = 1;