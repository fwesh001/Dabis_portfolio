-- ==============================================================================
-- 005_seed_real_experience_education.sql
-- Replaces placeholder experience and education records with Olehi Davis's
-- real career history (7 roles) and education milestones (3 records).
-- ==============================================================================

-- 1. Seed Real Experience Timeline
DELETE FROM public.portfolio_experiences;

INSERT INTO public.portfolio_experiences (
  role,
  company,
  company_url,
  location,
  period,
  highlights,
  display_order
) VALUES
(
  'Embedded System Engineer',
  'Access Solutions Limited',
  NULL,
  'Nigeria',
  'Aug 2023 — Present',
  ARRAY[
    'Implementing and developing electronics systems using microcontrollers.',
    'Designing and implementing software for embedded devices and systems.',
    'Developing Java and Kotlin mobile and desktop applications.'
  ],
  1
),
(
  'Freelance Web Developer',
  'Insight Computers Institute',
  NULL,
  'Nigeria',
  'Oct 2021 — Present',
  ARRAY[
    'Engineered and launched innovative web pages, enhancing user engagement and client satisfaction.',
    'Engaged in freelance projects, utilizing Python and web technologies to develop customized solutions for clients.'
  ],
  2
),
(
  'Physical Education Teacher',
  'Foundation International School',
  NULL,
  'Nigeria',
  'Sep 2022 — Jul 2023',
  ARRAY[
    'Educated and managed different classes with 78 students, achieving notable improvements in their mathematical skills and physical well-being.',
    'Designed curriculum and assessment methods tailored to varied learning styles.'
  ],
  3
),
(
  'Junior Web Developer',
  'Splufic Automation Limited',
  NULL,
  'Nigeria',
  'Jan 2020 — Sep 2021',
  ARRAY[
    'Designed and implemented interactive web solutions, focusing on user experience and responsive design.',
    'Contributed to a team in developing 12 embedded system projects, enhancing device connectivity and functionality.',
    'Conducted workshops on web design and Python programming for over 50 aspiring developers.'
  ],
  4
),
(
  'Junior Assistant',
  'Tracks Logics Limited',
  NULL,
  'Nigeria',
  'Jul 2017 — Feb 2021',
  ARRAY[
    'Assisted in the installation and troubleshooting of CCTV systems for a variety of clients.',
    'Played a key role in the digital marketing efforts for a range of electrical products.'
  ],
  5
),
(
  'Electrical Engineering Intern',
  'Federal Medical Center',
  NULL,
  'Nigeria',
  'Oct 2018 — Feb 2019',
  ARRAY[
    'Supported the Electrical Maintenance and Works department in installing and maintaining critical healthcare infrastructure.',
    'Presented educational seminars on the safe usage and maintenance of electrical appliances to hospital staff.'
  ],
  6
),
(
  'Technical Specialist',
  'Insight Computers Institute',
  NULL,
  'Nigeria',
  'Jun 2013 — Jun 2016',
  ARRAY[
    'Engaged in data entry and proofreading of documents with Microsoft Word for customers.',
    'Coached 23 students on basic computer training and accurate typing.',
    'Rebranded the company''s reputation by facilitating rapid delivery of accurately designed pages using Microsoft Word, PowerPoint, and CorelDraw.'
  ],
  7
);

-- 2. Seed Real Education Timeline
DELETE FROM public.portfolio_education;

INSERT INTO public.portfolio_education (
  degree,
  institution,
  institution_url,
  location,
  period,
  highlights,
  display_order
) VALUES
(
  'H.N.D., Electrical & Electronics Engineering Technology',
  'Federal Polytechnic Nasarawa',
  'https://www.linkedin.com/company/94044061/',
  'Nasarawa, Nigeria',
  'Mar 2021 — Sep 2022',
  ARRAY[
    'Higher National Diploma in Electrical and Electronics Engineering Technology.'
  ],
  1
),
(
  'N.D., Electrical & Electronics Engineering Technology',
  'Federal Polytechnic Nasarawa',
  'https://www.linkedin.com/company/94044061/',
  'Nasarawa, Nigeria',
  'Dec 2017 — Dec 2019',
  ARRAY[
    'National Diploma in Electrical and Electronics Engineering Technology.'
  ],
  2
),
(
  'Secondary Education',
  'Flobam British International Academy',
  NULL,
  'Nigeria',
  'Sep 2011 — Jul 2017',
  ARRAY[]::TEXT[],
  3
);
