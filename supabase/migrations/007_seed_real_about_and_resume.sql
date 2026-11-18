-- ==============================================================================
-- 007_seed_real_about_and_resume.sql
-- Updates portfolio_site_profile.subheadline, about_md, and resume_md using
-- Olehi Davis's authentic career, education, skills, and project history.
-- ==============================================================================

UPDATE public.portfolio_site_profile
SET
  subheadline = 'Bridging full-stack web, desktop & Android software with microcontroller-powered embedded electronics from Abuja, Nigeria.',
  about_md = $about$I'm **Olehi Davis**, a software and electronics engineer based in **FCT, Abuja, Nigeria**, working at the intersection of **web applications**, **desktop & Android software**, and **embedded microcontroller systems**.

Currently, I serve as an **Embedded System Engineer at Access Solutions Limited** — building microcontroller-based electronics, embedded firmware, and Java/Kotlin desktop & mobile software such as the **BECE Educational Resources Center (ERC) Application** — while also building custom web solutions with **Python and modern web technologies** as a **Freelance Web Developer**.

Holding both an **H.N.D. and N.D. in Electrical & Electronics Engineering Technology** from **Federal Polytechnic Nasarawa**, I enjoy taking ideas all the way from circuit prototypes to production software — whether that's wiring an **ESP8266 NodeMCU touchscreen Signature Pad**, training an offline-and-online **Rasa + OpenAI Android Chatbot**, or shipping a real-time **pharmacy inventory & POS platform**. Beyond building, I'm passionate about mentorship and have taught web design, Python programming, and computer fundamentals to over **70+ students and aspiring developers**.$about$,
  resume_md = $resume$# OLEHI DAVIS
Embedded System Engineer | Web, Desktop & Mobile App Developer
FCT, Abuja, Nigeria • 09099249445 • olehidavis@gmail.com • github.com/18d-shady

---

## Professional Summary
Multidisciplinary Software and Electrical/Electronics Engineer based in FCT, Abuja, Nigeria, experienced in microcontroller-driven embedded systems, Java/Kotlin desktop and Android development, and Python-powered full-stack web applications. Proven track record shipping production institutional software, hybrid offline/online AI mobile apps, inventory POS platforms, and custom hardware devices while mentoring 70+ students and aspiring developers.

## Core Skills
- **Web Development:** Python, HTML, CSS, JavaScript, Responsive Web Design, POS & Inventory Systems
- **Desktop & Mobile Apps:** Java, Kotlin, Android Development, Desktop Applications
- **Embedded & Electronics:** ESP8266 NodeMCU, Microcontrollers, TFT Touchscreens, Embedded Firmware, CCTV & Electrical Maintenance
- **AI & Tooling:** Python Rasa (Offline NLU), OpenAI API, Git, CorelDraw, Microsoft Office Suite

## Professional Experience

### Embedded System Engineer — Access Solutions Limited (Aug 2023 — Present)
- Implementing and developing electronics systems using microcontrollers.
- Designing and implementing software for embedded devices and systems.
- Developing Java and Kotlin mobile and desktop applications, including the BECE ERC examination result processing application.

### Freelance Web Developer — Insight Computers Institute (Oct 2021 — Present)
- Engineered and launched innovative web pages, enhancing user engagement and client satisfaction.
- Engaged in freelance projects, utilizing Python and web technologies to develop customized solutions for clients.

### Physical Education Teacher — Foundation International School (Sep 2022 — Jul 2023)
- Educated and managed different classes with 78 students, achieving notable improvements in their mathematical skills and physical well-being.
- Designed curriculum and assessment methods tailored to varied learning styles.

### Junior Web Developer — Splufic Automation Limited (Jan 2020 — Sep 2021)
- Designed and implemented interactive web solutions focusing on user experience and responsive design.
- Contributed to a team in developing 12 embedded system projects, enhancing device connectivity and functionality.
- Conducted workshops on web design and Python programming for over 50 aspiring developers.

### Junior Assistant — Tracks Logics Limited (Jul 2017 — Feb 2021)
- Assisted in the installation and troubleshooting of CCTV systems for a variety of clients.
- Played a key role in digital marketing efforts for a range of electrical products.

### Electrical Engineering Intern — Federal Medical Center (Oct 2018 — Feb 2019)
- Supported the Electrical Maintenance and Works department in installing and maintaining critical healthcare infrastructure.
- Presented educational seminars on the safe usage and maintenance of electrical appliances to hospital staff.

### Technical Specialist — Insight Computers Institute (Jun 2013 — Jun 2016)
- Engaged in data entry and proofreading of documents with Microsoft Word for customers.
- Coached 23 students on basic computer training and accurate typing.
- Rebranded the company's reputation by facilitating rapid delivery of accurately designed pages using Microsoft Word, PowerPoint, and CorelDraw.

## Selected Projects
- **Clintons Inventory App (Web Application):** Drug store inventory and inbuilt POS web application with real-time stock refresh, purchase tracking, sales analytics, and low-stock admin notifications.
- **BECE ERC Application (Desktop Application):** Educational Resources Center desktop system built with the Access Solutions technology team to compute student results for the BECE examination.
- **PAHelp's Chatbot (Android Application):** Hybrid Android chatbot powered by Python Rasa for offline communication and OpenAI for online AI assistance, complete with admin controls.
- **Signature Pad (Electronic Device):** ESP8266 NodeMCU + 2.8-inch TFT touchscreen and stylus hardware device capturing live touch coordinates with real-time PC viewing and image export.

## Education

### H.N.D., Electrical & Electronics Engineering Technology — Federal Polytechnic Nasarawa (Mar 2021 — Sep 2022)
- Higher National Diploma in Electrical and Electronics Engineering Technology.

### N.D., Electrical & Electronics Engineering Technology — Federal Polytechnic Nasarawa (Dec 2017 — Dec 2019)
- National Diploma in Electrical and Electronics Engineering Technology.

### Secondary Education — Flobam British International Academy (Sep 2011 — Jul 2017)
$resume$,
  updated_at = now()
WHERE id = 1;
