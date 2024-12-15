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


INSERT INTO review (
    description,
    rating,
    created_at,
    updated_at,
    business_id,
    account_id
)
SELECT
    'Review description #' || gs AS description,
    (random() * 4 + 1)::integer AS rating,
    NOW() - (random() * interval '30 days') AS created_at,
    NOW() - (random() * interval '30 days') + (random() * interval '2 days') AS updated_at,
    50001 AS business_id,
    (ARRAY[1, 2, 3])[floor(random() * 3 + 1)] AS account_id
FROM generate_series(1, 500) AS gs;


INSERT INTO job (
    title,
    description,
    location,
    location_type,
    skills,
    salary,
    employee_type,
    keywords,
    experience,
    created_at,
    updated_at,
    business_id
)
SELECT
    -- Random job titles
    'Job Title #' || gs AS title,

    -- Random job descriptions
    'Job description for job #' || gs AS description,

    -- Random location names
    'Location #' || (gs % 50 + 1) AS location,

    -- Static location_type
    'Onsite'::job_location_type_enum AS location_type,

    -- Static skills array
    ARRAY['skill']::text[] AS skills,

    -- Random salaries between 50000 and 150000
    ROUND((random() * (150000 - 50000) + 50000)::numeric, 2) AS salary,

    -- Static employee_type
    'FullTime'::job_employee_type_enum AS employee_type,

    -- Static keywords array
    ARRAY['keyword']::text[] AS keywords,

    -- Random experience between 1 and 10 years
    floor(random() * 10 + 1)::integer AS experience,

    -- Random created_at timestamps within the last 90 days
    NOW() - (random() * interval '90 days') AS created_at,

    -- Random updated_at timestamps after created_at
    NOW() - (random() * interval '90 days') + (random() * interval '10 days') AS updated_at,

    -- Static business_id
    50001 AS business_id

FROM generate_series(1, 5000) AS gs; -- Generate 5000 rows




explain analyse select * from business where id = 1;

select * from account;

insert into review (business_id, account_id,rating,description, created_at, updated_at) values (1, 1, 6,'Great business', now(), now());

select * from review;

select * from business;