-- ==============================================================================
-- 006_seed_real_projects.sql
-- Replaces placeholder projects with Olehi Davis's 4 real projects and their
-- uploaded cover screenshots in Supabase Storage (portfolio-assets/projects/).
-- ==============================================================================

DELETE FROM public.portfolio_projects;

INSERT INTO public.portfolio_projects (
  title,
  slug,
  summary,
  description_md,
  cover_image,
  live_url,
  repo_url,
  tech_stack,
  featured,
  status,
  display_order
) VALUES
(
  'Clintons Inventory App',
  'clintons-inventory-app',
  'An inventory application made for a drug store to keep stock of available drugs, record purchases, and track sales with an inbuilt POS and low-stock admin notifications.',
  $md$### 01 // Overview
An inventory application made for a drug store to keep stock of the available drugs, to make purchases, and to track sales.

### 02 // Key Capabilities
- **Inbuilt POS Application:** Enables employees to process customer sales directly while automatically refreshing inventory stock levels in real time.
- **Purchases & Stock Tracking:** Full tracking of purchased items, purchase costs, available stock counts, and recent sales history.
- **Low-Stock Admin Alerts:** Automatically notifies the administrator on low-stock items to prevent stockouts and streamline restocking.
- **Analytics Dashboard:** Real-time daily/monthly sales cards and 7-day sales trend visualization.$md$,
  'https://xvkflglkiupevstyrgwu.supabase.co/storage/v1/object/public/portfolio-assets/projects/clintons-inventory-app.png',
  NULL,
  NULL,
  ARRAY['Web Application', 'Python', 'POS', 'Inventory Management'],
  true,
  'Live',
  1
),
(
  'BECE ERC Application',
  'bece-erc-application',
  'An Educational Resources Center desktop application designed for the BECE examination with the Access Solutions technology team to compute and manage student examination results.',
  $md$### 01 // Overview
An Educational Resources Center desktop application designed for the Basic Education Certificate Examination (BECE), built in collaboration with the Access Solutions technology team.

### 02 // Key Capabilities
- **Examination Result Computation:** Accurate computation and aggregation of student scores across registered BECE subjects.
- **Student & Subject Registration Analytics:** Tracks registered student counts, gender distribution breakdown, and per-subject enrollment tables.
- **Reporting & Institutional Management:** Dedicated Home, Student, Report, and Settings workflows tailored for FCT Education Resource Management, Abuja.$md$,
  'https://xvkflglkiupevstyrgwu.supabase.co/storage/v1/object/public/portfolio-assets/projects/bece-erc-application.jpg',
  NULL,
  NULL,
  ARRAY['Desktop Application', 'Java', 'Kotlin', 'Result Processing'],
  true,
  'Live',
  2
),
(
  'PAHelp''s Chatbot',
  'pahelps-chatbot',
  'An Android AI assistant trained with Python''s Rasa model for offline communication and integrated with OpenAI''s model for online communication, complete with special admin features.',
  $md$### 01 // Overview
A client Android chatbot application built to provide seamless enquiry handling and intelligent assistance both offline and online.

### 02 // Hybrid AI Architecture
- **Offline Communication (Rasa):** Trained with Python's Rasa NLU/dialogue framework to answer client enquiries reliably without an active internet connection.
- **Online AI Communication (OpenAI):** Integrates OpenAI's language models when connected to deliver broad, context-aware AI assistance.
- **Admin Features & Chat History:** Password-protected admin mode, organized date-grouped previous chat archive, and a clean conversational user experience.$md$,
  'https://xvkflglkiupevstyrgwu.supabase.co/storage/v1/object/public/portfolio-assets/projects/pahelps-chatbot.jpg',
  NULL,
  NULL,
  ARRAY['Android Application', 'Kotlin', 'Python', 'Rasa', 'OpenAI'],
  true,
  'Live',
  3
),
(
  'Signature Pad',
  'signature-pad',
  'An electronic signature pad built with an ESP8266 NodeMCU microcontroller, 2.8-inch TFT touchscreen, and stylus supporting real-time PC preview and signature image export.',
  $md$### 01 // Overview
An electronic signature pad hardware device implemented with an ESP8266 NodeMCU microcontroller, a 2.8-inch TFT touchscreen display, and a stylus.

### 02 // Hardware & Software Capabilities
- **Live Touch Coordinate Capture:** Reads stylus touch coordinates directly from the 2.8-inch TFT resistive touchscreen and renders the stroke immediately on-device for the user.
- **Real-Time PC Screen Mirroring:** Streams touch coordinates to the connected PC so the signature can be viewed in real time as it is being drawn.
- **One-Click Signature Export:** Clicking send packages and transmits the captured handwritten signature as a clean image file directly to the connected PC.$md$,
  'https://xvkflglkiupevstyrgwu.supabase.co/storage/v1/object/public/portfolio-assets/projects/signature-pad.jpg',
  NULL,
  NULL,
  ARRAY['Electronic Device', 'ESP8266 NodeMCU', 'TFT Touchscreen', 'Embedded C++'],
  true,
  'Live',
  4
);
