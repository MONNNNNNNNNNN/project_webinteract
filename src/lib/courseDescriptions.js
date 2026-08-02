// Real course descriptions sourced from the official DME curriculum TQF.2
// document (มคอ.2, 2022 revision) — gear.kku.ac.th. Covers 75 of the 76 course
// codes currently in curriculumData.js (only EN 844 786 Cooperative Education
// isn't described in this document's course-syllabus section). Thai text is
// extracted from the PDF as-is; line-wrap points may carry minor stray spacing.
export const COURSE_DESCRIPTIONS = {
  "EN 001 205": {
    descriptionEn: "Design thinking, identify needs, gather information, stakeholder analysis, operational research, hazard analysis, specification creation, creative design, conceptual design, prototype design and verification",
    descriptionTh: "การคิดเชิงออกแบบ การระบุความต้องการ การรวบรวมข้อมูล การวิเคราะห์ผู้มีส่วนได้ส่วนเสีย การวิจัยเชิงปฏิบัติการ การวิเคราะห์ อันตราย การสร้างข้อมูลจำเพาะ การออกแบบเชิงสร้างสรรค์ การออกแบบ แนวความคิด การออกแบบต้นแบบและการตรวจสอบ",
    prerequisites: null,
  },
  "EN 811 300": {
    descriptionEn: "Computer concepts: components of a computer system and interactions among them, past and current computer languages, electronic data processing concepts, program design and development methodology: program flowchart, Integrated development environment (IDE) usage, tracing and debugging codes, good programming styles, High level language programming: high level language programming fundamental, data input and output, library, control structures (selection and iteration), function, recursion, list or array, file and introduction to object oriented programming and clas",
    descriptionTh: "แนวคิดของระบบคอมพิวเตอร์ องค์ประกอบและปฏิสัมพันธ์ ระหว่างองค์ประกอบต่างๆ ของระบบคอมพิวเตอร์ ภาษาคอมพิวเตอร์ใน อดีตถึงปัจจุบัน แนวคิดการประมวลผลข้อมูลอิเล็กทรอนิกส์ การออกแบบ และระเบียบวิธีการพัฒนาโปรแกรม ผังงานโปรแกรม การใช้เครื่องมือที่ ช่วยในการพัฒนาโปรแกรม การติดตามและแก้ไขโปรแกรม ลักษณะการ เขียนโปรแกรมที่ดี การเขียนโปรแกรมภาษาระดับสูง หลักมูลการเขียน โปรแกรมภาษาระดับสูง การนำเข้าและส่งออกข้อมูล ไลบรารี โครงสร้าง ควบคุมการเลือกทำและการทำซ้ า ฟังก์ชัน การเรียกซ้ า ลิสต์หรือแถวลำดับ แฟ้มข้อมูล แนะนำการโปรแกรมเชิงวัตถุและคลาส",
    prerequisites: null,
  },
  "EN 813 705": {
    descriptionEn: "Definition and importance of computer technology for education, current computer technology for education in foreign countries and in Thailand, differences in engineering aspects among computer technology for education in foreign countries and in Thailand, advanced analysis of computer engineering tools for education in technical aspects and in responding to user requirements",
    descriptionTh: "ความหมายและความสำคัญของเทคโนโลยีคอมพิวเตอร์เพื่อ การศึกษา เทคโนโลยีคอมพิวเตอร์เพื่อการศึกษาที่มีในปัจจุบันทั้งของ ต่างประเทศและประเทศไทย การเปรียบเทียบข้อแตกต่างเชิงวิศวกรรม ระหว่างเทคโนโลยีคอมพิวเตอร์เพื่อการศึกษาของต่างประเทศและของประเทศ ไทย การวิเคราะห์ขั้นสูงเครื่องมือทางวิศวกรรมคอมพิวเตอร์ต่างๆ ที่ใช้ใน ระบบการศึกษาในเชิงเทคนิคและเชิงการตอบสนองความต้องการของผู้ใช้",
    prerequisites: "EN 811 300 or EN 001 203",
  },
  "EN 813 706": {
    descriptionEn: "Overview of artificial neural networks and their background; optimization; basic data inference; model selection; machine learning, development of artificial neural networks, computation and training mechanisms of artificial neural networks, application-related issues, state-of-the-arts, notable artificial neural networks and renowned applications",
    descriptionTh: "ภาพรวมของโครงข่ายประสาทเทียมและภูมิหลัง การหาค่าดีที่สุด การอนุมานข้อมูลเบื้องต้น การเลือกแบบจำลอง การเรียนรู้ของเครื่อง การ พัฒนาโครงข่ายประสาทเทียม กลไกการคำนวณของโครงข่ายประสาท เทียม กลไกการฝึกโครงข่ายประสาทเทียม ประเด็นการประยุกต์ใช้พื้นฐาน ศาสตร์และศิลป์ของโครงข่ายประสาทเทียม โครงข่ายประสาทเทียมที่ สำคัญและการประยุกต์ใช้ที่โดดเด่น",
    prerequisites: "EN 811 300 or EN 001 203 or EN 241 100",
  },
  "EN 813 707": {
    descriptionEn: "Overview of natural language processing, regular expression, tokenization, topic models, sentiment classification, language models, automatic translation, evaluation methods, attention mechanism, bias and ethics in natural language processing, challenges of Thai language processing",
    descriptionTh: "ภาพรวมของการประมวลผลภาษาธรรมชาติ นิพจน์ปรกติ โทเคนไนเซ ชัน แบบจำลองหัวข้อ การจำแนกอารมณ์ความรู้สึก แบบจำลองภาษา การ แปลภาษาอัตโนมัติ วิธีการประเมินผล กลไกความสนใจ ความลำเอียงและ จริยธรรมในการประมวลผลภาษาธรรมชาติ ความท้าทายการประมวลผลภาษาไทย",
    prerequisites: "EN 811 300 or EN 001 203 or EN 241 100",
  },
  "EN 841 001": {
    descriptionEn: "Introduction to digital media, computer animation, sound engineering, digital electronics, digital media processing, video games, web and interactive media and immersive technology",
    descriptionTh: "สื่อดิจิทัลขั้นแนะนำ คอมพิวเตอร์แอนิเมชัน  วิศวกรรมเสียง อิเล็กทรอนิกส์ดิจิทัล การประมวลผลสื่อดิจิทัล วิดีโอเกม เว็บและสื่อเชิง โต้ตอบ และ เทคโนโลยีโลกเสมือนจริง",
    prerequisites: null,
  },
  "EN 841 009": {
    descriptionEn: "Linear algebra, linear transformations, eigenvalues and eigenvectors, vector spaces, inner-product spaces, Fourier series, Fourier transform",
    descriptionTh: "พีชคณิตเชิงเส้น การเปลี่ยนแปลงแบบเชิงเส้น ค่าเฉพาะและ เวคเตอร์เฉพาะ ปริภูมิเวคเตอร์ ปริภูมิผลคูณภายใน  อนุกรมฟูเรียร์ การ แปลงฟูเรียร์",
    prerequisites: null,
  },
  "EN 841 010": {
    descriptionEn: "Data summaries and descriptive statistics, central tendency, variance, covariance, correlation, basic probability, expectation, Bayes’ theorem, conditional probability, probability distribution functions, uniform, normal, binomial, chi-square, student's t-distribution, central limit theorem, sampling, measurement, error, random number generation, hypothesis testing, A/B testing, confidence intervals, p-values, ANOVA, t-test, Linear regression and regularization",
    descriptionTh: "การสรุปข้อมูลและสถิติเชิงพรรณนา แนวโน้มสู่ส่วนกลาง ความ แปรปรวน ความแปรปรวนร่วมเกี่ยว  สหสัมพันธ์ ความน่าจะเป็นขั้นพื้นฐาน การคาดหมาย ทฤษฎีบทของเบย์ ความน่าจะเป็นแบบมีเงื่อนไข ฟังก์ชันการ แจกแจงความน่าจะเป็น การแจกแจงเอกรูป การแจกแจงปกติ การแจกแจง แบบทวินาม  การแจกแจงแบบไคสแควร์ การแจกแจงแบบที ทฤษฎีแนวโน้ม เข้าสู่ศูนย์กลาง การสุ่มตัวอย่าง, การวัด, ข้อผิดพลาด, การสร้างตัวเลขสุ่ม, การทดสอบสมมติฐาน, การทดสอบ A/B, ช่วงความเชื่อมั่น, ค่าพี การ วิเคราะห์ความแปรปรวน การทดสอบที, การถดถอยเชิงเส้น และ เร็กกิวลาร์ ไรซ์เซซัน",
    prerequisites: "EN 841 009",
  },
  "EN 841 011": {
    descriptionEn: "Elements of art, principles of design, logo design, corporate identity design, graphic design software and graphic design projects",
    descriptionTh: "องค์ประกอบศิลป์ หลักการออกแบบ การออกแบบโลโก้ การ ออกแบบอัตลักษณ์ ซอฟต์แวร์สำหรับออกแบบกราฟิก และโครงการ ออกแบบกราฟิก",
    prerequisites: null,
  },
  "EN 841 012": {
    descriptionEn: "Conduct and complete assigned digital media production project in basic graphics design, design thinking, digital media production processes, pre-production, production, post-production and distribution",
    descriptionTh: "ดำเนินโครงการผลิตสื่อดิจิทัลที่ได้รับมอบหมาย ด้านการ ออกแบบกราฟิกเบื้องต้น  กระบวนการคิดเชิงออกแบบ กระบวนการผลิต สื่อดิจิทัล ก่อนการผลิตการผลิต หลังการผลิต และ การจัดจำหน่าย",
    prerequisites: null,
  },
  "EN 841 013": {
    descriptionEn: "Conduct and complete assigned digital media production project in advace graphics design, design thinking, digital media production processes, pre-production, production, post-production and distribution",
    descriptionTh: "ดำเนินโครงการผลิตสื่อดิจิทัลที่ได้รับมอบหมายด้านการออกแบบ กราฟิกขั้นสูง กระบวนการคิดเชิงออกแบบ กระบวนการผลิตสื่อดิจิทัล ก่อนการผลิตการผลิต หลังการผลิต และ การจัดจำหน่าย",
    prerequisites: "EN 841 012",
  },
  "EN 841 315": {
    descriptionEn: "History of E-sport, game industry, E-sport industry, tournament, ecosystem, streaming, E-sport athlete, roles, team management",
    descriptionTh: "ประวัติอีสปอร์ต อุตสาหกรรมเกม อุตสาหกรรมอีสปอร์ต ทัวนา เมนต์ ระบบนิเวศ การถ่ายทอดสัญญาณ นักกีฬาอีสปอร์ต บทบาท การบริหารทีม",
    prerequisites: null,
  },
  "EN 841 400": {
    descriptionEn: "Introduction to machine learning, Python programming, essential tools for machine learning, supervised learning, and unsupervised learning",
    descriptionTh: "แนะนำการเรียนรู้ของเครื่อง การเขียนโปรแกรมภาษาไพทอน เครื่องมือที่จำเป็นสำหรับการเรียนรู้ของเครื่อง การเรียนรู้แบบมีผู้สอน และ การเรียนรู้แบบไม่มีผู้สอน",
    prerequisites: null,
  },
  "EN 842 006": {
    descriptionEn: "Arithmatic algorithm analysis, recurrence analysis, data structures and analysis of algorithms for lists, stacks and queues structures, tree structures, hashing technique, priority queues, sorting, graph algorithms",
    descriptionTh: "การวิเคราะห์ขั้นตอนวิธีทางคณิตศาสตร์ การวิเคราะห์การเวียนเกิด โครงสร้างข้อมูลและการวิเคราะห์ขั้นตอนวิธีสำหรับโครงสร้างแบบรายการ แบบกองซ้อน และแบบคิว โครงสร้างรูปต้นไม้ เทคนิคแบบแฮช คิวลำดับ ความสำคัญ การเรียงลำดับ ขั้นตอนวิธีแบบกราฟ",
    prerequisites: "EN 811 300",
  },
  "EN 842 007": {
    descriptionEn: "Basic mathematical notions, sets, relations, functions, logic : propositional calculus, predicate calculus, methods of proof, basic of counting, recurence relation, graph, tree, basic of number theory",
    descriptionTh: "สัญลักษณ์ทางคณิตศาสตร์เบื้องต้น เซต ความสัมพันธ์ ฟังก์ชัน ตรรกศาสตร์ แคลคูลัสเชิงประพจน์  แคลคูลัสภาคแสดง วิธีการพิสูจน์ทาง คณิตศาสตร์ พื้นฐานการนับ ความสัมพันธ์เวียนเกิด กราฟ ต้นไม้ ทฤษฎี จำนวนเบื้องต้น",
    prerequisites: "EN 841 009",
  },
  "EN 842 014": {
    descriptionEn: "Introduction to voltage, current and resistance. Ohm’s Law. Electronic measuring equipment. Passive circuits. Introduction to semiconductor devices; diode, transistor, opamp. Timer circuits. Analog and digital signals.  Introduction to digital circuits",
    descriptionTh: "แนะนำแรงดัน กระแส และความต้านทาน กฎของโอห์ม เครื่องมือวัดทางอิเลกทรอนิกส์ วงจรเฉื่อยงาน  แนะนำอุปกรณ์สารกึ่ง ตัวนำ ไดโอด ทรานซิสเตอร์ ออปแอมป์ วงจรจับเวลา สัญญาณแอนะลอก และดิจิทัล แนะนำวงจรดิจิทัล",
    prerequisites: null,
  },
  "EN 842 015": {
    descriptionEn: "Conduct and complete assigned digital media production project in software development, design thinking, digital media production processes, pre-production, production, post-production and distribution",
    descriptionTh: "ดำเนินโครงการผลิตสื่อดิจิทัลที่ได้รับมอบหมาย ด้านการพัฒนา ซอฟต์แวร์พื้นฐาน กระบวนการคิดเชิงออกแบบ กระบวนการผลิตสื่อดิจิทัล ก่อนการผลิตการผลิต หลังการผลิต และ การจัดจำหน่าย",
    prerequisites: "EN 841 013",
  },
  "EN 842 016": {
    descriptionEn: "Introduction to software engineering, Agile software development, XP (Extreme Programming) process, Scrum process, iterative software development, software requirements, software modeling, software design, software construction, software testing, software verification, software validation, software quality assurance, software project management",
    descriptionTh: "วิศวกรรมซอฟต์แวร์ขั้นแนะนำ การพัฒนาซอฟต์แวร์แบบ คล่องแคล่ว กระบวนการเอ็กพี กระบวนการสกรัม การพัฒนาซอฟต์แวร์ แบบวนรอบ ข้อกำหนดซอฟต์แวร์ ตัวแบบซอฟต์แวร์ การออกแบบ ซอฟต์แวร์ การสร้างซอฟต์แวร์ การทดสอบซอฟต์แวร์ การทวนสอบ ซอฟต์แวร์ การตรวจสอบซอฟต์แวร์ การประกันคุณภาพซอฟต์แวร์ การ จัดการโครงการซอฟต์แวร์",
    prerequisites: null,
  },
  "EN 842 017": {
    descriptionEn: "Conduct and complete assigned digital media production project in interactive media, design thinking, digital media production processes, pre-production, production, post- production and distribution",
    descriptionTh: "ดำเนินโครงการผลิตสื่อดิจิทัลที่ได้รับมอบหมาย การพัฒนา ซอฟต์แวร์เชิงโต้ตอบ กระบวนการคิดเชิงออกแบบ กระบวนการผลิตสื่อ ดิจิทัล ก่อนการผลิตการผลิต หลังการผลิต และ การจัดจำหน่าย",
    prerequisites: "EN 842 015",
  },
  "EN 842 100": {
    descriptionEn: "3D digital image generation, model, polygon meshes, spline & subdivision surfaces, computer animation, real time rendering, setting 3D environmental view, algorithms used for detecting visible lines and surfaces of 3D objects",
    descriptionTh: "การสร้างภาพดิจิทัลสามมิติ โมเดล รูปทรงหลายเหลี่ยม เส้นโค้ง และส่วนย่อยของพื้นผิว ภาพเคลื่อนไหว การเรนเดอร์แบบเวลาจริง การ กำหนดมุมมองสภาพแวดล้อมสามมิติ อัลกอริธึมสำหรับตรวจหารอยเส้น และพื้นผิวของวัตถุสามมิติ",
    prerequisites: "EN 811 300",
  },
  "EN 842 101": {
    descriptionEn: "Creating 3D modeling, creating background/scenes and characters, Non-Uniform Rational Basis Spline (NURBS), polygons, subdivision surface, camera angles setting, textures setting for game work and animation, controlling of the modeling, resolution, lighting, rendering",
    descriptionTh: "การสร้างแบบจำลองสามมิติ สร้างฉากและตัวละคร  ระบบในการ สร้างวัตถุภายในงานกราฟิก  โพลิกอน และ การแบ่งพื้นผิวของออกเป็น พื้นผิวย่อยๆ การจัดมุมกล้อง การกำหนดลักษณะพื้นผิว สำหรับงานเกม และแอนิเมชัน การควบคุมความละเอียดของแบบจำลอง การจัดแสง  การ สร้างภาพจากแบบจำลอง",
    prerequisites: null,
  },
  "EN 842 300": {
    descriptionEn: "Introduction to web interactive, event-driven and dynamic web development, web programming, web database development,  web interactive security",
    descriptionTh: "เว็บเชิงโต้ตอบขั้นแนะนำ การพัฒนาเว็บแบบพลวัตและเชิงเหตุการณ์ การโปรแกรมเว็บ การพัฒนาฐานข้อมูลเว็บ ความมั่นคงของเว็บเชิงโต้ตอบ",
    prerequisites: null,
  },
  "EN 842 314": {
    descriptionEn: "Designing computer programs, programming language fundamentals, flow control and data structures, exception handling, graphical user interface programming, event driven handler programming, automated test programming",
    descriptionTh: "การออกแบบโปรแกรมคอมพิวเตอร์ หลักมูลของภาษาโปรแกรม การควบคุมสายงานและโครงสร้างข้อมูล การจัดการสิ่งผิดปกติ การเขียน โปรแกรมแบบมีส่วนติดต่อกับผู้ใช้แบบกราฟฟิก การเขียนโปรแกรมเพื่อ จัดการกับเหตุการณ์  การเขียนโปรแกรมแบบมีการทดสอบโดยอัตโนมัติ",
    prerequisites: "EN 811 300",
  },
  "EN 842 316": {
    descriptionEn: "Analog-to-digital and digital-to-analog conversion, sensors and actuators, displays, microcontrollers and interfacing, microcontroller programming",
    descriptionTh: "การแปลงสัญญาณแอนะลอกเป็นดิจิทัลและการแปลงสัญญาณ ดิจิทัลเป็นแอนะลอก ตัวรับรู้และตัวกระตุ้น จอแสดงผล ไมโครคอนโทรเลอร์ และการเชื่อมต่อ การเขียนโปรแกรมไมโครคอนโทรลเลอร์",
    prerequisites: "EN 842 014",
  },
  "EN 842 401": {
    descriptionEn: "Important of data visualization, data visualization concept, concepts of charts and their implementation, charts interpretation and storytelling, Dashboard",
    descriptionTh: "ความสำคัญของการนำข้อมูลมาแสดงผล วิธีการสร้างและ ความสำคัญของแผนภูมิแบบต่างๆ หลักการในการออกแบบแผนภูมิ การ แปรผลและนำเสนอแผนภูมิ การสร้างแดชบอร์ด",
    prerequisites: "EN 811 300",
  },
  "EN 842 500": {
    descriptionEn: "Basic sound theory, studio instruments and signal processing, electronics in audio applications, digital audio technology, studio and recording equipment",
    descriptionTh: "ทฤษฎีพื้นฐานด้านเสียง อุปกรณ์สตูดิโอและการส่งสัญญาณ ระบบไฟฟ้าอิเล็กทรอนิกส์สำหรับงานเสียง เทคโนโลยีดิจิตอลในระบบเสียง สตูดิโอและอุปกรณ์บันทึกเสียง",
    prerequisites: null,
  },
  "EN 843 008": {
    descriptionEn: "Digital media-processing algorithms, data processing, digital signal and image processing, digital speech and audio processing, digital video processing",
    descriptionTh: "ขั้นตอนวิธีประมวลผลสื่อดิจิทัล การประมวลผลข้อมูล การ ประมวลผลสัญญาณและภาพดิจิทัล การประมวลผลเสียงพูดและเสียง ดิจิทัล การประมวลผลวีดิทัศน์ดิจิทัล",
    prerequisites: "EN 842 014 and EN 842 314",
  },
  "EN 843 018": {
    descriptionEn: "Conduct and complete assigned digital media production project in  3D animation or video, design thinking, digital media production processes, pre-production, production, post-production and distribution",
    descriptionTh: "ดำเนินโครงการผลิตสื่อดิจิทัลที่ได้รับมอบหมาย ด้านแอนิเมชัน 3 มิติ หรือ วิดีโอ กระบวนการคิดเชิงออกแบบ กระบวนการผลิตสื่อดิจิทัล ก่อนการผลิตการผลิต หลังการผลิต และ การจัดจำหน่าย",
    prerequisites: "EN 842 017",
  },
  "EN 843 019": {
    descriptionEn: "Conduct and complete assigned digital media production project in game developemnt, design thinking, digital media production processes, pre-production, production, post-production and distribution",
    descriptionTh: "ดำเนินโครงการผลิตสื่อดิจิทัลที่ได้รับมอบหมายด้านการพัฒนา เกม กระบวนการคิดเชิงออกแบบ กระบวนการผลิตสื่อดิจิทัล ก่อนการผลิต การผลิต หลังการผลิต และ การจัดจำหน่าย",
    prerequisites: "EN 843 018",
  },
  "EN 843 105": {
    descriptionEn: "Digital film production, film making fundamentals, the art of storytelling, filmmaking software and tools, visual effects, visual effects software, digital sculpting and digital sculpting software",
    descriptionTh: "การสร้างภาพยนตร์ดิจิทัล พื้นฐานการสร้างภาพยนตร์ ศิลป ของการเล่าเรื่อง ซอฟต์แวร์และเครื่องมือในการสร้างภาพยนตร์ วิชั่วล์เอฟ เฟ็ค ซอฟต์แวร์สำหรับวิชั่วล์เอฟเฟ็ค ประติมากรรมดิจิทัล และซอฟต์แวร์ สำหรับประติมากรรมดิจิทัล",
    prerequisites: null,
  },
  "EN 843 107": {
    descriptionEn: "Production pipeline’s components, 3D animation preproduction, idea, story, storyboard, animatic, design, production, layout, research and development, modeling, texturing, rigging, animation, visual effects, lighting, rendering, 3D animation postproduction, composition, 2D visual effects, motion graphics, color correction",
    descriptionTh: "องค์ประกอบการผลิตแบบสายท่อ ชั้นตอนก่อนการผลิต แอนิเมชันสามมิติ มโนคติ เรื่องราว บทภาพ แอนิเมติก การออกแบบ การ ผลิต ผัง การวิจัยและพัฒนา การโมเดล การพื้นผิว การริกกิ้ง แอนิเมชัน วิชวลเอฟเฟกต์ แสง เรนเดอร์ ขั้นตอนหลังการผลิตแอนิเมชันสามมิติ องค์ประกอบ วิชวลเอฟเฟกต์สองมิติ โมชันกราฟฟิก การแก้ไขสี",
    prerequisites: null,
  },
  "EN 843 108": {
    descriptionEn: "Principles and techniques of light settings, various light systems, 3-spot light setting, natural light simulation and setting, natural light simulation by using High Dynamic Range Imaging (HDRI), indirect illumination technique, techniques of rendering and lighting",
    descriptionTh: "หลักการและเทคนิคของการจัดแสง ระบบแสงประเภท ต่าง ๆ การจัดแสงแบบสามจุด การจัดและการจำลองแสงธรรมชาติ การจำลอง แสงธรรมชาติโดยใช้ช่วงพลวัตร เทคนิคการสร้างความสว่างโดยอ้อม เทคนิคของการเรนเดอร์และการจัดแสง",
    prerequisites: null,
  },
  "EN 843 109": {
    descriptionEn: "Creating 3D model by sculpting technique, human anatomy, setting structure from basic sculpture model, setting structure and adding details from low-polygon model, retopology, 3D digital sculpturing process",
    descriptionTh: "การขึ้นโมเดลสามมิติโดยเทคนิคการการปั้น กายวิภาคของมนุษย์ การขึ้นรูปจากโมเดลปั้นพื้นฐาน และการขึ้นโครงสร้างและการเพิ่ม รายละเอียดจากโมเดลที่มีโพลีกอนต่ า เทคนิคการรีโทโปโลจี กระบวนการ ใช้งานโปรแกรมปฏิมากรรมดิจิทัลสามมิติ",
    prerequisites: null,
  },
  "EN 843 110": {
    descriptionEn: "Design of characters to be able to convey meanings, human anatomy, single character design, multiple characters design, creating data illustrating feelings and manners of characters, inspirations, styles, fashion, setting",
    descriptionTh: "ออกแบบตัวละครให้สามารถสื่อความหมาย กายวิภาคของมนุษย์ การออกแบบตัวละครเดี่ยว การออกแบบตัวละครหลายตัว การสร้างข้อมูล แสดงความรู้สึกและแสดงท่าทางของตัวละคร แรงบันดาลใจ กระบวนแบบ สมัยนิยม ฉากท้องเรื่อง",
    prerequisites: null,
  },
  "EN 843 111": {
    descriptionEn: "Integrate graphics and overlay graphics, layer, keying, matt, various effects, decorate graphics, colors, proper mixture and reality",
    descriptionTh: "วิธีการผสมภาพและซ้อนภาพ เลเยอร์ คีย์ แมทท์ เอฟเฟกต์ ต่างๆ การตกแต่งภาพ สี  ความกลมกลืนและสมจริง",
    prerequisites: null,
  },
  "EN 843 116": {
    descriptionEn: "Character rigging, pivot positions, skeleton system, forward and inverse kinematics, deformers, constraints, scripting, expressions, character dynamics, muscle, appendages, cloth and hair set up",
    descriptionTh: "การริกกิ้งตัวละคร ตำแหน่งแกนหมุน ระบบโครงกระดูก การ เคลื่อนที่ของวัตถุแบบไปข้างหน้าและตรงกันข้าม การเสียรูป การจำกัด การเขียนสคริปท์  นิพจน์ การเคลื่อนที่ของตัวละคร กล้ามเนื้อ รยางค์ เสื้อผ้า และสร้างเส้นผม",
    prerequisites: null,
  },
  "EN 843 117": {
    descriptionEn: "Graphics rendering pipeline, the graphics processing unit, transforms, shading basics, texturing, shadows, light and color, physically based shading, local illumination, global illumination, image-space effects, volumetric and translucency rendering, non-photorealistic rendering, polygonal techniques, curves and curved surfaces and graphics hardware",
    descriptionTh: "การทำงานแบบสายท่อชองการให้แสงและเงาภาพกราฟิกส์ หน่วยประมวลผลกราฟิกส์ การเปลี่ยนรูป พื้นฐานการให้แสงและเงา พื้นผิว เงา แสงและสี การให้แสงและเงาโดยใช้กายภาพป็นรากฐาน การ ส่องสว่างเฉพาะที่ การส่องสว่างแบบครอบคลุม ผลกระทบของรูปภาพและ ที่ว่าง การให้แสงและเงาเชิงปริมาตรและความฝ้ามัว การให้แสงและเงา แบบไม่เหมือนแสง เทคนิคทางโพลีกอน เส้นโค้งและผิ้นผิวโค้ง และ ฮาร์ดแวร์สำหรับงานกราฟิกส์",
    prerequisites: null,
  },
  "EN 843 201": {
    descriptionEn: "Overview of video game, principle of video game, video game design, game interactions, game development process, game evaluation and testing, game industry",
    descriptionTh: "ภาพรวมของวิดีโอเกม หลักการพื้นฐานของวิดีโอเกม การออกแบบ วิดีโอเกม การปฏิสัมพันธ์ในเกม กระบวนการพัฒนาเกม  การประเมินและ ทดสอบเกม อุตสาหกรรมเกม",
    prerequisites: null,
  },
  "EN 843 202": {
    descriptionEn: "Advanced programming techniques for game development, C++, JAVA, script, advanced network programming, online game development, social networking, game development framework, advanced artificial intelligence, game development suite",
    descriptionTh: "เทคนิคขั้นสูงการโปรแกรมสำหรับการพัฒนาเกม ภาษาซีพลัสพลัส จาวา สคริปต์ การโปรแกรมเครือข่ายขั้นสูง การพัฒนาเกมออนไลน์ เครือข่ายสังคม กรอบการพัฒนาเกม ปัญญาประดิษฐ์ขั้นสูง ชุดพัฒนาเกม",
    prerequisites: null,
  },
  "EN 843 210": {
    descriptionEn: "Overview of game quality assurance, principle of game testing, game evaluation and testing, game balancing, game theory, test cases, postmortem, test management",
    descriptionTh: "ภาพรวมของการประกันคุณภาพเกม หลักการพื้นฐานการ ทดสอบเกม การประเมินและทดสอบเกม สมดุลเกม ทฤษฎีเกม กรณี ทดสอบ  การชันสูตร การบริหารการทดสอบ",
    prerequisites: null,
  },
  "EN 843 301": {
    descriptionEn: "Design theories, selection of colors, formats and font sizes, selection of images and symbolic media, theories of interaction between users and media, samples of designs",
    descriptionTh: "ทฤษฎีการออกแบบ การเลือกใช้สี รูปแบบและขนาดตัวอักษร การเลือกใช้ภาพและสื่อสัญลักษณ์ ทฤษฎีการปฏิสัมพันธ์ระหว่างผู้ใช้กับสื่อ ตัวอย่างผลงานการออกแบบ",
    prerequisites: null,
  },
  "EN 843 304": {
    descriptionEn: "Computer networks, communication protocols, internet TCP/IP and applications, wireless communications, network security, computer network workshop practice",
    descriptionTh: "เครือข่ายคอมพิวเตอร์ โพรโทคอลการสื่อสาร เกณฑ์วิธีควบคุม การขนส่งข้อมูล/เกณฑ์วิธีอินเทอร์เน็ต การสื่อสารไร้สาย ความมั่นคงของ เครือข่าย การฝึกปฏิบัติการเครือข่ายคอมพิวเตอร์",
    prerequisites: null,
  },
  "EN 843 317": {
    descriptionEn: "Using game engine to design and develop a mobile game and a mobile app, mobile app user interface design",
    descriptionTh: "การใช้เกมเอนจินเพื่อการออกแบบและพัฒนาโมบายเกมและโม บายแอป การออกแบบส่วนติดต่อผู้ใช้ของโมบายแอป",
    prerequisites: "EN 842 314",
  },
  "EN 843 318": {
    descriptionEn: "Developing web application interface (frontend web development) and data processing (backend web development), developing and invoking Web API",
    descriptionTh: "การพัฒนาเว็บแอปพลิเคชันในส่วนที่แสดงผลและส่วน ประมวลผล การพัฒนาและเรียกใช้เว็บเอพีไอ",
    prerequisites: "EN 842 314",
  },
  "EN 843 402": {
    descriptionEn: "Introduction to digital image processing, digital image fundamentals, image enhancement in the spatial domain, image enhancement in the frequency domain, image restoration, colorimage processing, image compression, image segmentation and morphological image processing, introduction to computer vision, related fields in computer vision, typical tasks of computer vision, recognition, motion analysis, scene reconstruction, image restoration, computer vision systems, applications for computer vision",
    descriptionTh: "การประมวลผลภาพเชิงดิจิทัลขั้นแนะนำ หลักมูลภาพเชิงดิจิทัล การปรับปรุงภาพในพิสัยเชิงพื้นที่ การปรับปรุงภาพในพิสัยความถี่ การซ่อม คืนสภาพภาพ การประมวลผลภาพสี การบีบอัดภาพ การแบ่งส่วนภาพ และ การประมวลผลภาพเชิงสัณฐาน คอมพิวเตอร์วิทัศน์ขั้นแนะนำ สาขาที่ เกี่ยวข้องกับคอมพิวเตอร์วิทัศน์ ภารกิจตรงแบบคอมพิวเตอร์วิทัศน์ การรู้จำ การวิเคราะห์การเคลื่อนที่ การประกอบให้คืนสภาพของฉาก การคืนสภาพ ของภาพ ระบบคอมพิวเตอร์วิทัศน์ การประยุกต์คอมพิวเตอร์วิทัศน์",
    prerequisites: null,
  },
  "EN 843 403": {
    descriptionEn: "Introduction to Data Science, Data Analysis Methodology, Data Exploration, Data Visualization, Data Preprocessing, Machine Learning for Data Science, Regression, Classification, Association Analysis, Clustering Analysis, Anomaly Detection",
    descriptionTh: "วิทยาการข้อมูลขั้นแนะนำ กระบวนการในการวิเคราะห์ข้อมูล การสำรวจข้อมูล การนำเสนอข้อมูลเชิงภาพ การเตรียมข้อมูล แบบจำลอง การเรียนรู้ของเครื่องสำหรับวิทยาการข้อมูล การพยากรณ์ การจำแนก รูปแบบ การวิเคราะห์ความสัมพันธ์ข้อมูล การวิเคราะห์การจัดกลุ่ม การ ตรวจจับสิ่งผิดปกติ",
    prerequisites: null,
  },
  "EN 843 404": {
    descriptionEn: "Cognitive capabilities, perception, attention, anticipation, planning, memory, learning, reasoning, social capabilities, communication, collaborative task execution, artificial intelligence and cognitive science",
    descriptionTh: "ความสามารถในการรับรู้ ความเข้าใจ ความสนใจ ความ คาดหมาย การวางแผน ความจำ การเรียนรู้ การให้เหตุผล ความสามารถ ทางสังคม  การสื่อสาร การร่วมมือทำงาน ปัญญาประดิษฐ์ และ วิทยาการ การรู้",
    prerequisites: null,
  },
  "EN 843 405": {
    descriptionEn: "Deep Learning, Image Fundamentals, Neural Network Fundamentals, Convolutional Neural Networks, Image Classification and Object Detection",
    descriptionTh: "การเรียนรู้เชิงลึก ความรู้พื้นฐานเกี่ยวกับภาพ ความรู้พื้นฐาน เกี่ยวกับโครงข่ายประสาทเทียม โครงข่ายประสาทแบบคอนโวลูชัน การ จำแนกภาพ และ การตรวจจับวัตถุ",
    prerequisites: "EN 843 402",
  },
  "EN 843 407": {
    descriptionEn: "Artificial Intelligence (AI) for computer games, AI design in computer games, deterministic AI, non-deterministic AI,  searching, decision tree, finite state machine, fuzzy logic, rule-based system, scripted AI, planning, bayesian networks, genetic algorithm, natural language processing, neural networks, stochastic model,  pathfinding by using A* and F* algorithm, strategies in games",
    descriptionTh: "ป ญญาประดิษฐ สำหรับเกมคอมพิวเตอร  การออกแบบ ปัญญาประดิษฐ ในเกมคอมพิวเตอร์ ป ญญาประดิษฐ เชิงกำหนด ป ญญา ประดิษฐ เชิงไม่กำหนด การค้นหา ต้นไม้การตัดสินใจ เครื่องสถานะจำกัด ตรรกศาสตร์คลุมเครือ ระบบตามกฏ ปญญาประดิษฐ์ตามบท การวางแผน เครือข่ายเบย์ ขั้นตอนวิธีพันธุกรรม การประมวลผลภาษาธรรมชาติ โครงข่ายประสาทเทียม แบบจำลองเฟ้นสุ่ม การค นหา เส นทางโดยใช ขั้นตอนวิธี A* และ F*  กลยุทธในเกม",
    prerequisites: null,
  },
  "EN 843 501": {
    descriptionEn: "acoustics, music theory and music appreciation, music and audio production, live sound reinforcement, advanced studio equipment and studies, music mixing and mastering techniques",
    descriptionTh: "อุโฆษศาสตร์ ทฤษฎีดนตรีและสังคีตนิยม การผลิตงานดนตรีและ เสียง การปรับแต่งคุณภาพเสียงเพื่อการแสดง การใช้งานอุปกรณ์สตูดิโอขั้น สูงและการศึกษา เทคนิคการผสมเสียง และการทำมาสเตอร์ดนตรี",
    prerequisites: null,
  },
  "EN 843 796": {
    descriptionEn: "obtain a   permission from the department before Practical training at industrial plants or working units relating to digital media engineering field",
    descriptionTh: "ฝึกงานในโรงงานอุตสาหกรรมหรือหน่วยงานที่มีความสัมพันธ์และ เกี่ยวข้องกับสาขาวิชาวิศวกรรมสื่อดิจิทัล",
    prerequisites: "The third year student or The student must",
  },
  "EN 844 020": {
    descriptionEn: "Introduction to extended reality, metaverse virtual environment, virtual reality, augmented reality, mixed reality, real-time rendering, 3D display systems, sensors, tracking, feedback, presence, immersion, ubiquitous computing, context aware computing, localization, internet of thing",
    descriptionTh: "ความเป็นจริงขยายขั้นแนะนำ เมตาเวิร์ส สิ่งแวดล้อม เสมือน ความเป็นจริงเสมือน ความเป็นจริงเสริม ความเป็นจริงผสม การ เรนเดอร์แบบทันที ระบบจอแสดงผลสามมิติ เซ็นเซอร์ การติดตาม การ ป้อนกลับ การอยู่ต่อหน้า การจุ่ม ยูบิควิตัสคอมพิวติง การคำนวณแบบรู้ บริบท การระบุตำแหน่ง อินเทอร์เน็ตของสรรพสิ่ง",
    prerequisites: null,
  },
  "EN 844 112": {
    descriptionEn: "Preparation of 2D and 3D computer graphics for games, creating pixel images, creating 3D model, creating animation for 2D and 3D games, displaying 3D environment, 3D object texture, lighting",
    descriptionTh: "การเตรียมคอมพิวเตอร์กราฟิกแบบสองและสามมิติ สำหรับเกม การสร้างภาพแบบพิกเซล การสร้างโมเดลสามมิติ การสร้างแอนิเมชัน สำหรับเกมสองและสามมิติ การแสดงสภาพแวดล้อมสามมิติ พื้นผิววัตถุ สามมิติ การให้แสง",
    prerequisites: null,
  },
  "EN 844 113": {
    descriptionEn: "Compositing, 2D visual effects, motion graphics, color correction, final output",
    descriptionTh: "การซ้อนภาพ วิชวลเอฟเฟกต์สองมิติ กราฟิกเคลื่อนไหว การ ปรับแก้สี  การส่งออกผลงานสมบูรณ์",
    prerequisites: null,
  },
  "EN 844 114": {
    descriptionEn: "Animation model data, 3D character movement, bone system, motion simulation, interactive media response simulation",
    descriptionTh: "ข้อมูลโมเดลแอนิเมชัน การเคลื่อนที่ของตัวละครสามมิติ ระบบ กระดูก การจำลองการเคลื่อนไหว  การจำลองการตอบโต้สื่อปฎิสัมพันธ์",
    prerequisites: null,
  },
  "EN 844 115": {
    descriptionEn: "Production pipeline’s components, 3D animation preproduction, idea, story, storyboard, animatic, design, production, layout, research and developement",
    descriptionTh: "องค์ประกอบการผลิตแบบสายท่อ ชั้นตอนก่อนการผลิต แอนิเมชันสามมิติ มโนคติ เรื่องราว บทภาพ แอนิเมติก การออกแบบ การ ผลิต ผัง การวิจัยและพัฒนา",
    prerequisites: null,
  },
  "EN 844 204": {
    descriptionEn: "Introduction to online game,  network programming, C++, JAVA, Python, database design, client and server architecture, cloud computing, non-player characters, AI for online game, massive multiplayer online game, social network game",
    descriptionTh: "เกมออนไลน์ขั้นแนะนำ การโปรแกรมเครือข่าย ซีพลัสพลัส จาวา ไพธอน การออกแบบฐานข้อมูล สถาปัตยกรรมไคลเอนและเซิฟเวอร์ การคำนวณแบบกลุ่มเมฆ  ตัวละครที่ไม่ใช่ผู้เล่น ปัญญาประดิษฐ์สำหรับ เกมออนไลน์ เกมออนไลน์หลายผู้เล่นจำนวนมาก เกมเครือข่ายสังคม",
    prerequisites: null,
  },
  "EN 844 207": {
    descriptionEn: "Simulation approaches,  stock/flow systems, cellular automata, networks, physics, agents, prototype, visual design communication, simulation in computer games and animations",
    descriptionTh: "วิธีการจำลอง ระบบหุ้นและการไหล เซลลูลาร์ออโตมาตา เครือข่าย ฟิสิกส์ ตัวแทน ต้นแบบ การสื่อสารออกแบบการเห็น การจำลอง ในเกมคอมพิวเตอร์และแอนิเมชัน",
    prerequisites: null,
  },
  "EN 844 209": {
    descriptionEn: "Concepts of game culture and digital game theory, game taxonomies, definitions, simulations, training,  game-based learning, methodologies, gameplay, interactive narratives, storytelling, addictive game, gamification, game development tools",
    descriptionTh: "แนวคิดวัฒนธรรมเกมและทฤษฎีเกมดิจิทัล อนุกรมวิธานเกม นิยามซีเรียสเกม การจำลอง การฝึก การเรียนรู้โดยใช้เกมเป็นฐาน ระเบียบ วิธี รูปแบบการเล น การเล่าเรื่องเชิงโต้ตอบ การเล าเรื่อง เกมทำให ติด เกมิฟิเคชั่น เครื่องมือพัฒนาเกม",
    prerequisites: null,
  },
  "EN 844 306": {
    descriptionEn: "Fundamentals of the visualization design, development and utilization of information architecture, concepts to create and manager informational systems in the virtual and real world",
    descriptionTh: "หลักมูลของการออกแบบการสร้างมโนภาพ การพัฒนาและการ ใช้ประโยชน์สถาปัตยกรรมสารสนเทศ แนวคิดในการสร้างและจัดการ ระบบสารสนเทศในโลกเสมือนและโลกที่เป็นจริง",
    prerequisites: null,
  },
  "EN 844 307": {
    descriptionEn: "Introduction to ubiquitous computing, pervasive computing, context aware computing, sensors, localization, wireless network, Internet of things, privacy, social concerns",
    descriptionTh: "ยูบิควิตัสคอมพิวติงขั้นแนะนำ การคำนวณแพร่หลาย การคำนวณ แบบรู้บริบท เซ็นเซอร์ การระบุตำแหน่ง  เครือข่ายไร้สาย อินเทอร์เน็ตของ สรรพสิ่ง ความเป็นส่วนตัว ความกังวลของสังคม",
    prerequisites: null,
  },
  "EN 844 308": {
    descriptionEn: "Foundations and designs of  interaction, human- computer interaction, user interfaces, usability engineering, task analysis, user-centered design, universal design, prototyping, conceptual models and metaphors, software design rationale, windows menus and commands design, voice and natural language I/O, response time and feedback, color, icons and sound, internationalization, localization, user interface architectures and APIs, case studies",
    descriptionTh: "พื้นฐานและการออกแบบปฏิสัมพันธ์  ปฏิสัมพันธ์ระหว่างมนุษย์ กับคอมพิวเตอร์ ส่วนติดต่อกับผู้ใช้ วิศวกรรมการใช้ประโยชน์  การ วิเคราะห์งาน การออกแบบที่เน้นผู้ใช้เป็นศูนย์กลาง การออกแบบเพื่อคน ทุกคน การทำต้นแบบ แบบจำลองแนวความคิดและการใช้คำเปรียบเทียบ เหตุผลในการออบแบบซอฟต์แวร์ การออกแบบหน้าต่าง เมนูและคำสั่ง การติดต่อโดยใช้เสียงพูดและภาษาธรรมชาติ เวลาที่การตอบกลับและการ ตอบสนอง สี  ไอคอน เสียง การทำให้เป็นสากล การทำให้เข้ากับท้องถิ่น สถาปัตยกรรมส่วนติดต่อกับผู้ใช้และส่วนต่อประสานโปรแกรมประยุกต์ กรณีศึกษา",
    prerequisites: null,
  },
  "EN 844 309": {
    descriptionEn: "Introduction to computer networks, internet protocol, data encryption, TCP/IP network programming, sockets programming",
    descriptionTh: "เครือข่ายคอมพิวเตอร์ขั้นแนะนำ อินเทอร์เน็ตโพรโทคอล การ เข้ารหัสข้อมูล การโปรแกรมเครือข่ายทีซีพี/ไอพี การโปรแกรม ซ็อกเก็ต",
    prerequisites: null,
  },
  "EN 844 312": {
    descriptionEn: "Introduction to software engineering, software development processes, agile processes, software requirements, software modeling, software design, software construction, software testing, software verification, software validation, software quality assurance, software project management, software configuration management",
    descriptionTh: "วิศวกรรมซอฟต์แวร์ขั้นแนะนำ  กระบวนการพัฒนาซอฟแวร์ กระบวนการคล่องตัว ข้อกำหนดซอฟต์แวร์  ตัวแบบซอฟต์แวร์ การ ออกแบบซอฟต์แวร์ การสร้างซอฟต์แวร์  การทดสอบซอฟต์แวร์ การทวน สอบซอฟต์แวร์ การตรวจสอบซอฟต์แวร์ การประกันคุณภาพซอฟต์แวร์ การจัดการโครงการซอฟต์แวร์ การจัดการโครงแบบซอฟต์แวร์",
    prerequisites: null,
  },
  "EN 844 406": {
    descriptionEn: "Introduction to data visualization, Static Visualization, Interactive Visualization, Interactive Visualization of Data across Strata, Interactive Visualization of Data across Time and Interactive Visualization of Geographical Data",
    descriptionTh: "ความรู้เบื้องต้นเกี่ยวกับการสร้างภาพข้อมูล การแสดงภาพแบบ คงที่การแสดงภาพเชิงโต้ตอบ  การแสดงภาพเชิงโต้ตอบของข้อมูลตามช่วง ชั้น การแสดงภาพข้อมูลเชิงโต้ตอบตามเวลา และการแสดงภาพเชิงโต้ตอบ ของข้อมูลทางภูมิศาสตร์",
    prerequisites: "EN 842 401",
  },
  "EN 844 502": {
    descriptionEn: "Acting through human voices, describing, emotions and feelings, wordings, audio fineness, sounds and audio recording technology, co-relate rhythm in animation and game",
    descriptionTh: "การแสดงผ่านเสียงมนุษย์  การบรรยาย  อารมณ์และความรู้สึก วิธีใช้คำพูด การออกเสียง เสียงและเทคโนโลยีการบันทึกเสียง การประสาน จังหวะในงานแอนิเมชันและเกม",
    prerequisites: null,
  },
  "EN 844 774": {
    descriptionEn: "Lectures and discussions on current topics of interest in digital media engineering Cooperative Education in Digital Media Engineering",
    descriptionTh: "บรรยายและอภิปรายในหัวข้อปัจจุบันที่น่าสนใจในสาขา วิศวกรรมสื่อดิจิทัล EN 844 785 สหกิจศึกษาทางวิศวกรรมสื่อดิจิทัล 6 หน่วยกิต เงื่อนไขของรายวิชา :  IC 011 015 และเป็นนักศึกษาชั้นปีที่ 4  หรือ นักศึกษาต้องได้รับอนุญาตจากสาขาวิชาฯ ก่อนลงทะเบียน",
    prerequisites: null,
  },
  "IC 011 001": {
    descriptionEn: "English language reading and writing skills that emphasizes analysis and critical evaluation of texts, and writing that emphasizes organization and creativity in different communication settings",
    descriptionTh: "ทักษะการอ่านและการเขียนภาษาอังกฤษ  การฝึกการอ่านที่เน้นการ ประเมิน การวิเคราะห์วิพากษ์ อย่างเป็นระบบ การฝึกการเขียนที่เน้นการ ค้นคว้า การเรียบเรียง การสร้างงานเขียนหนังสือสำหรับความมุ่งหมายต่าง ๆ",
    prerequisites: null,
  },
  "IC 011 002": {
    descriptionEn: "Essential academic English language skills in speaking, listening, reading and writing",
    descriptionTh: "ทักษะภาษาอังกฤษ ด้านการพูด ฟัง อ่านและเขียน เชิงวิชาการที่จำเป็น",
    prerequisites: null,
  },
  "IC 011 012": {
    descriptionEn: "Knowledge and understanding of leadership theories, leadership function and styles, change management leadership and change management, and factors affecting organizational change",
    descriptionTh: "ความรู้และความเข้าใจเกี่ยวกับทฤษฎีภาวะผู้นำ หน้าที่ของภาวะ ผู้นำและการจัดการการเปลี่ยนแปลง ภาวะผู้นำและการจัดการการ เปลี่ยนแปลงและปัจจัยที่มีผลต่อการเปลี่ยนแปลงองค์กร",
    prerequisites: null,
  },
  "IC 011 015": {
    descriptionEn: "Components of projecting professional image, on interpersonal communication and relationship development mission statement development, writing goals, telephoning skills, e- mail and business etiquette, listening and speaking techniques, resume writing, preparation for job interview",
    descriptionTh: "องค์ประกอบในการสร้างภาพลักษณ์มืออาชีพ การสื่อสารระหว่าง บุคคลและการพัฒนาความสัมพันธ์ การพัฒนาพันธกิจ การเขียนเป้าหมาย ทักษะทางโทรศัพท์ มารยาททางจดหมายอิเล็กทรอนิกส์และธุรกิจ เทคนิคการ ฟังและการพูด การเขียนประวัติย่อ การเตรียมตัวสำหรับการสัมภาษณ์งาน",
    prerequisites: null,
  },
  "IC 011 016": {
    descriptionEn: "Concepts and important information, processes development of information literacy skills, information searching, selecting sources of information, evaluation of information values, information analysis and synthesis, information composition and presentation in various formats",
    descriptionTh: "แนวคิดและความสำคัญของสารสนเทศ กระบวนการการพัฒนา ทักษะการเรียนรู้ด้านสารสนเทศ การสืบค้นสารสนเทศ การคัดเลือกแหล่ง สารสนเทศ การประเมินคุณค่าของสารสนเทศ การวิเคราะห์และสังเคราะห์ สารสนเทศ การเรียบเรียงและการนำเสนอสารสนเทศในรูปแบบต่าง ๆ",
    prerequisites: null,
  },
  "IC 011 018": {
    descriptionEn: "Principles, concepts, processes in logical thinking and problem solving, information and knowledge searching, argument and reasoning processes, techniques and applications for a logical approach to rational thinking, problem solving, and decision making",
    descriptionTh: "หลักการ แนวคิด กระบวนการ การคิดเชิงตรรกะและการแก้ปัญหา การค้นหาข้อมูลและความรู้ การโต้แย้ง และกระบวนการการให้เหตุผล เทคนิค และการประยุกต์สำหรับแนวทางตรรกะในการคิดอย่างมีเหตุผล การแก้ปัญหา และการตัดสินใจ",
    prerequisites: null,
  },
  "IC 011 019": {
    descriptionEn: "Entrepreneurship characteristics, ethics for entrepreneurs, corporate social responsibility, motivation, decisions- making, marketing analysis, investment funding, business plan development, branding and trademarking, basic accounting, tax payment, business evaluation",
    descriptionTh: "คุณลักษณะผู้ประกอบการ จริยธรรมสำหรับผู้ประกอบการ ความ รับผิดชอบต่อสังคมขององค์กร แรงจูงใจ การตัดสินใจ การวิเคราะห์ตลาด การ ระดมทุนเพื่อการลงทุน การพัฒนาแผนธุรกิจ การสร้างแบรนด์และ เครื่องหมายการค้า บัญชีขั้นพื้นฐาน การชำระภาษี การประเมินธุรกิจ",
    prerequisites: null,
  },
  "IC 011 020": {
    descriptionEn: "Basic personal financial planning fundamentals, budgeting, money management, acquiring credit, responsible use of credit, banking, investment, insurance, tax planning, and retirement planning Engineering), University of Michigan, U.S.A., 2546 - M.S. (Computer Science and Engineering), University of Michigan, U.S.A., 2542 - B.S. (Electrical and Computer Engineering), Carnegie Mellon University, U.S.A., 2540 The University of Manchester, United Kingdom, 2542 x-xxxx-xxxxx-xx-x Engineering), University of Regina, Canada, 2552 x-xxxx-xxxxx-xx-x - D. Eng. (Microelectronics and Embeded Systems), Asian Institute of Technology, 2561 - M. Sc. (Microelectronics and Microsystems), Hamburg University of Technology, Germany, 2549 Colorado State University, U.S.A., 2553 - M.Eng. (Computer Science), Asian Institute of Technology, 2 - Ph.D. (Electrical and Computer Engineering), Carnegie Mellon University, U.S.A., 2554 - M.S. (Electrical and Computer Engineering), Carnegie Mellon University, U.S.A., 2548 - B.S. (Electrical and Computer Engineering), Carnegie MellonUniversity, U.S.A., 2546 Liverpool University, UK., 2552 - M.S. (Computer Science), Asian Institute of Technology, 2546 - B.S. (Mathematics, concentration in Computer Science), Cornell University, U.S.A., 2544 x-xxxx-xxxxx-xx-x - D.Eng. (Computer Science), Asian Institute of Technology, 2548 - M.Eng. (Computer Engineering), Asian Institute of Technology, 2542 x-xxxx-xxxxx-xx-x - D.Eng. (Computer Science), Asian Institute of Technology, 2550 - M.S. (Computer Engineering), Case Western Reserve University, U.S.A., 2543 1 (0-3-1) responsibility) analysis, communication & information technology skills) (Curriculum Mapping) Visualizer LCD Projector",
    descriptionTh: "ความรู้พื้นฐานในการวางแผนการเงินส่วนบุคคล การจัดทำงบประมาณ การจัดการเงิน การจัดหาสินเชื่อ ความรับผิดชอบต่อการใช้สินเชื่อ การธนาคาร การลงทุน ประกัน การวางแผนภาษี การวางแผนการเกษียณอายุ 3.2 ชื่อ เลขประจำตัวบัตรประชาชน ตำแหน่งและคุณวุฒิของอาจารย์ 3.2.1 อาจารย์ประจำหลักสูตร ที่ ชื่อ นามสกุล เลขประจำตัว บัตรประชาชน ตำแหน่งทาง วิชาการ คุณวุฒิ 1 นางกานดา สายแก้ว x-xxxx-xxxxx-xx-x รองศาสตราจารย์ - Ph.D. (Computer Science and 2 นายจิระเดช พลสวัสดิ์ x-xxxx-xxxxx-xx-x ผู้ช่วยศาสตราจารย์ - วศ.ด. (วิศวกรรมคอมพิวเตอร์), จุฬาลงกรณ์มหาวิทยาลัย, 2556 - วศ.ม. (วิศวกรรมคอมพิวเตอร์), จุฬาลงกรณ์มหาวิทยาลัย, 2547 - วศ.บ. (วิศวกรรมคอมพิวเตอร์), มหาวิทยาลัยขอนแก่น, 2543 3 นายภาณุพงษ์ วันจันทึก x-xxxx-xxxxx-xx-x ผู้ช่วยศาสตราจารย์ - M.Phil. (Computer Science), - วศ.บ. (วิศวกรรมคอมพิวเตอร์), มหาวิทยาลัยขอนแก่น, 2538 4 นายวิชชา  เฟื่องจันทร์ ผู้ช่วยศาสตราจารย์ - Ph.D. (Electronic Systems - วท.ม. (วิทยาการคอมพิวเตอร์), จุฬาลงกรณ์มหาวิทยาลัย, 2545 - วศ.บ. (วิศวกรรมคอมพิวเตอร์), มหาวิทยาลัยแก่น, 2543 ที่ ชื่อ นามสกุล เลขประจำตัวบัตร ประชาชน ตำแหน่งทาง วิชาการ คุณวุฒิ 5 นายชวิศ  ศรีจันทร์ อาจารย์ - วศ.บ. (วิศวกรรมคอมพิวเตอร์), มหาวิทยาลัยแก่น, 2545 หมายเหตุ  รายละเอียดเกี่ยวกับประวัติ ผลงานทางวิชาการ และภาระงานสอน (เอกสารแนบท้ายหมายเลข 3) 3.2.2  อาจารย์ประจำ ที่ ชื่อ นามสกุล เลขประจำตัวบัตร ประชาชน ตำแหน่งทาง วิชาการ คุณวุฒิ 1 นายธัชพงศ์ กตัญญูกุล x-xxxx-xxxxx-xx-x รองศาสตราจารย์ - Ph.D. (Mechanical Engineering), ไทย., 2543 - วศ.บ. (วิศวกรรมอิเล็กทรอนิกส์), สถาบันเทคโนโลยีพระจอมเกล้าเจ้า คุณทหารลาดกระบัง, ไทย., 2539 นางสาวกรชวัล  ชายผา x-xxxx-xxxxx-xx-x ผู้ช่วย ศาสตราจารย์ ที่ ชื่อ นามสกุล เลขประจำตัวบัตร ประชาชน ตำแหน่งทาง วิชาการ คุณวุฒิ 3 นายภัทรวิทย์ พลพินิจ   x-xxxx-xxxxx-xx-x ผู้ช่วยศาสตราจารย์ - Ph.D. (Computer Science), 4 นายกิตติ์ เธียรธโนปจัย อาจารย์ - วศ.บ. (วิศวกรรมคอมพิวเตอร์), มหาวิทยาลัยแก่น, 2538 5 นายวาธิส  ลีลาภัทร อาจารย์ - วศ.บ. (วิศวกรรมคอมพิวเตอร์), มหาวิทยาลัยแก่น, 2538 1.2.3 อาจารย์พิเศษ อาจารย์พิเศษ (อาจารย ภายนอกมหาวิทยาลัยขอนแก น)  สาขาวิชาฯ จะทำการเชิญ อาจารย์พิเศษมาสอนตามความจำเป็น 4. องค์ประกอบเกี่ยวกับประสบการณ์ภาคสนาม (การฝึกงาน และสหกิจศึกษา) จากผลการประเมินความพึงพอใจจากผู้ใช้บัณฑิต มีความต้องการให้บัณฑิตมีประสบการณ์ใน วิชาชีพก่อนเข้าสู่การทำงานจริง ดังนั้นในหลักสูตรจึงมีรายวิชาประสบการณ์ภาคสนาม เพื่อฝึกให้นักศึกษา รู้จักการประยุกต์ใช้ความรู้ที่เรียนมา มาใช้กับสภาพการทำงานจริง และเพื่อเป็นการเตรียมความพร้อมใน ทุกๆ ด้าน ก่อนออกไปทำงานจริง ดังนี้ รายวิชาประสบการณ์ภาคสนาม EN 843 796  การฝึกงาน EN 844 785  สหกิจศึกษาทางวิศวกรรมสื่อดิจิทัล 6 หน่วยกิต โดยการฝึกงานนั้นนักศึกษาแต่ละคนต้องทำการฝึกงานอย่างน้อย 30 วันทำการติดต่อกัน กับ หน่วยงานที่ภาควิชาฯ เห็นชอบ และต้องนำเสนอรายงานการฝึกงานและถูกประเมินโดยคณะกรรมการ ประเมินผลของรายวิชา ส่วนสหกิจศึกษานนั้นนักศึกษาต้องปฏิบัติงานจริงด้วยความรับผิดชอบในงานสาขา วิศวกรรมสื่อดิจิทัล โดยต้องปฏิบัติงานเต็มเวลาตามแผนการทำงานที่ชัดเจนตามที่ได้รับมอบหมายจาก พนักงานที่ปรึกษาอย่างน้อย 16 สัปดาห์ โดยที่ลักษณะงานต้องแตกต่างไปจากการดูงานหรือฝึกงานทั่วไป นักศึกษาต้องเขียนรายงานเชิงเทคนิคและถูกประเมินโดยคณะกรรมการประเมินผลของรายวิชา 4.1 มาตรฐานผลการเรียนรู้ของประสบการณ์ภาคสนาม ความคาดหวังในผลการเรียนรู้ประสบการณ์ภาคสนามของนักศึกษา มีดังนี้ 4.1.1 ทักษะในการปฏิบัติงานจากสถานประกอบการ ตลอดจนมีความเข้าใจในหลักการ ความ จำเป็นในการเรียนรู้ทฤษฎีมากยิ่งขึ้น 4.1.2 บูรณาการความรู้ที่เรียนมาเพื่อนำไปแก้ปัญหาทางระบบคอมพิวเตอร์ได้ 4.1.3 มีมนุษยสัมพันธ์และสามารถทำงานร่วมกับผู้อื่นได้ดี 4.1.4 มีระเบียบวินัย ตรงเวลา และเข้าใจวัฒนธรรมขององค์กร ตลอดจนสามารถปรับตัวให้เข้า กับสถานประกอบการได้ 4.1.5 มีความกล้าในการแสดงออก และนำความคิดสร้างสรรค์ไปใช้ประโยชน์ในงานได้ 4.1.6 มีทักษะการสื่อสารด้านการพูด เขียน คิดวิเคราะห์ประมวลผล 4.2 ช่วงเวลา 4.2.1 สำหรับรายวิชาฝึกงาน ฝึกปฏิบัติการในหน่วยงานของรัฐและ/หรือเอกชน โดยเฉลี่ย 8 ชั่วโมงต่อวัน ในภาค การศึกษาพิเศษ ชั้นปีที่ 3 ระยะเวลารวมไม่น้อยกว่า 30 วันทำการ 4.2.2 สำหรับรายวิชาสหกิจศึกษา ฝึกปฏิบัติการในหน่วยงานของรัฐและ/หรือเอกชน โดยเฉลี่ย 8 ชั่วโมงต่อวัน ในภาค การศึกษาที่ 2 ชั้นปีที่ 4 ระยะเวลารวมไม่น้อยกว่า 16 สัปดาห์ 4.3 การจัดเวลาและตารางสอน วันจันทร์-ศุกร์ เวลา 08.00 - 17.00 น. หรือเป็นไปตามที่หน่วยงานที่นักศึกษาเข้าฝึกงานจะ กำหนด หมวดที่ 4.  ผลการเรียนรู้ กลยุทธ์การสอนและการประเมินผล 1. การพัฒนาคุณลักษณะพิเศษของนักศึกษา คุณลักษณะพิเศษ กลยุทธ์หรือกิจกรรมการดำเนินการ (1) มีคุณธรรม จริยธรรม ถ่อมตนและ ทำหน้าที่เป็นพลเมืองดี รับผิดชอบต่อ ตนเอง วิชาชีพและสังคม - ส่งเสริมและสอดแทรกให้นักศึกษามีจรรยาบรรณในวิชาชีพ เคารพในสิทธิทางปัญญาและข้อมูลส่วนบุคคล การใช้เทคโนโลยี ในการพัฒนาสังคมที่ถูกต้อง นอกจากนี้อาจมีการจัดกิจกรรม ค่ายวิชาการ เพื่อให้นักศึกษามีโอกาสประยุกต์หรือเผยแพร่ ความรู้ที่ได้ศึกษามาแก่ชุมชน (2) มีความรู้พื้นฐานในศาสตร์ที่ เกี่ยวข้องทั้งภาคทฤษฎีและภาคปฏิบัติ อยู่ในเกณฑ์ดี สามารถประยุกต์ได้ อย่างเหมาะสมในการประกอบวิชาชีพ และศึกษาต่อในระดับสูง - รายวิชาบังคับของหลักสูตรปูพื้นฐานของศาสตร์และสร้าง ความเชื่อมโยงระหว่างภาคทฤษฎีและปฏิบัติ มีปฏิบัติการ แบบฝึกหัด โครงงาน และกรณีศึกษาให้นักศึกษาเข้าใจการ ประยุกต์องค์ความรู้กับปัญหาจริง (3) มีความรู้ทันสมัย ใฝ่รู้ และมี ความสามารถพัฒนาความรู้ เพื่อ พัฒนาตนเอง พัฒนางานและพัฒนา สังคม - รายวิชาเลือกที่เปิดสอนต่อยอดความรู้พื้นฐานในภาคบังคับ และปรับตามวิวัฒนาการของศาสตร์ มีโจทย์ปัญหาที่ท้าทายให้ นักศึกษาค้นคว้าหาความรู้ในการพัฒนาศักยภาพ (4) คิดเป็น ทำเป็น และเลือกวิธีการ แก้ปัญหาได้อย่างเป็นระบบและ เหมาะสม - รายวิชามีโจทย์ปัญหา แบบฝึกหัด หรือโครงงาน ให้นักศึกษา ได้ฝึกคิด ฝึกปฏิบัติ ฝึกแก้ปัญหา แทนการท่องจำ (5) มีความสามารถทำงานร่วมกับผู้อื่น มีทักษะการบริหารจัดการและทำงาน เป็นหมู่คณะ - โจทย์ปัญหาและโครงงานของรายวิชาต่าง ๆ จัดแบบ คณะทำงาน  เพื่อส่งเสริมให้นักศึกษาได้ฝึกฝนการทำงานเป็น หมู่คณะ (6) รู้จักแสวงหาความรู้ด้วยตนเองและ สามารถติดต่อสื่อสารกับผู้อื่นได้เป็น อย่างดี - ต้องมีการมอบหมายงานให้นักศึกษาได้สืบค้นข้อมูล รวบรวม ความรู้ที่นอกเหนือจากที่ได้นำเสนอในชั้นเรียน และเผยแพร่ ความรู้ที่ได้ระหว่างนักศึกษาด้วยกัน หรือให้กับผู้สนใจภายนอก (7) มีความสามารถในการใช้ภาษาไทย และภาษาต่าง ประเทศในการสื่อสาร และใช้เทคโนโลยีได้ดี - มีระบบเพื่อสื่อสารแลกเปลี่ยนความคิดเห็นในหมู่นักศึกษา หรือบุคคลภายนอกที่ส่งเสริมให้เกิดการแสวงหาความรู้ที่ ทันสมัย การเผยแพร่ การถามตอบ และการแลกเปลี่ยนความรู้ คุณลักษณะพิเศษ กลยุทธ์หรือกิจกรรมการดำเนินการ (8) มีความสามารถวิเคราะห์ ออกแบบ พัฒนา ติดตั้ง และปรับปรุงระบบ คอมพิวเตอร์ให้ตรงตามข้อกำหนด - มีวิชาโครงงานวิศวกรรม เป็นวิชาที่บูรณาการองค์ความรู้ที่ได้ ศึกษามา ในการวิเคราะห์ ออกแบบ พัฒนา ติดตั้ง และปรับปรุง ระบบคอมพิวเตอร์ตามข้อกำหนดของโจทย์ปัญหาที่ได้รับ 2. การพัฒนาผลการเรียนรู้ในแต่ละด้าน 2.1 คุณธรรม และจริยธรรม (Ethics & Moral) 2.1.1 ผลการเรียนรู้ด้านคุณธรรมและจริยธรรม (1) PLO 1.1 เข้าใจและซาบซึ้งในวัฒนธรรมไทย ตระหนักในคุณค่าของระบบคุณธรรม จริยธรรมเสียสละ และ ซื่อสัตย์สุจริต (2) PLO 1.2 มีวินัย ตรงต่อเวลา รับผิดชอบต่อตนเองและสังคม เคารพกฎระเบียบและ ข้อบังคับต่างๆ ขององค์กรและสังคม (3) PLO 1.3 มีภาวะความเป็นผู้นำและผู้ตาม สามารถทำงานเป็นหมู่คณะ สามารถ แก้ไขข้อขัดแย้งตามลำดับความสำคัญ เคารพสิทธิและรับฟังความคิดเห็น ของผู้อื่น รวมทั้งเคารพในคุณค่าและศักดิ์ศรีของความเป็นมนุษย์ (4) PLO 1.4 สามารถวิเคราะห์และประเมินผลกระทบจากการใช้ความรู้ทางวิศวกรรม ต่อบุคคล องค์กรสังคมและสิ่งแวดล้อม (5) PLO 1.5 มีจรรยาบรรณทางวิชาการและวิชาชีพ และมีความรับผิดชอบในฐานะผู้ ประกอบวิชาชีพรวมถึงเข้าใจถึงบริบททางสังคมของวิชาชีพวิศวกรรม ตั้งแต่อดีตจนถึงปัจจุบัน 2.1.2 กลยุทธ์การสอนที่ใช้ในการพัฒนาการเรียนรู้ด้านคุณธรรมและจริยธรรม (1) สอนสอดแทรกเรื่องคุณธรรมและจริยธรรมในรายวิชาต่าง ๆ (2) สอนสอดแทรกเรื่องคุณธรรมและจริยธรรมในรูปแบบกรณีศึกษา (Case study) ตาม โอกาสอันควร (3) การเรียนรู้จากการสอนโดยใช้สถานการณ์และประสบการณ์จริง กำหนดให้มี วัฒนธรรมองค์กร เพื่อปลูกฝังให้นักศึกษามีระเบียบ วินัย การปฏิบัติตามกฎ กติกาที่ กำหนดหรือได้ตกลงกันไว้ 2.1.3 กลยุทธ์การประเมินผลการเรียนรู้ด้านคุณธรรมและจริยธรรม (1) ประเมินจากการตรงเวลาของนักศึกษาในการเข าชั้นเรียน การส งงานตามกำหนด ระยะเวลาที่มอบหมาย การทำกิจกรรม การทำงานเป็นกลุ่ม (2) ประเมินจากพฤติกรรมการแสดงออกหรือการไม่ลอกงานผู้อื่น (3) ประเมินจากความรับผิดชอบในหน าที่ที่ได รับมอบหมาย และสังเกตพฤติกรรมการ แสดงออกในโอกาสต่าง ๆ 2.2 ความรู้ (Knowledge) 2.2.1 ผลการเรียนรู้ด้านความรู้ (1) PLO 2.1 มีความรู้และความเข้าใจทางคณิตศาสตร์พื้นฐาน วิทยาศาสตร์พื้นฐาน วิศวกรรมพื้นฐาน เศรษฐศาสตร์ และปัญญาประดิษฐ์ เพื่อการประยุกต์ใช้ กับงานทางด้านวิศวกรรมสื่อดิจิทัล และการสร้างนวัตกรรมทางเทคโนโลยี (2) PLO 2.2 มีความรู้และความเข้าใจเกี่ยวกับหลักการที่สำคัญ ทั้งในเชิงทฤษฎีและ ปฏิบัติ ในเนื้อหาของสาขาวิชาเฉพาะด้านทางวิศวกรรมสื่อดิจิทัล (3) PLO 2.3 สามารถบูรณาการความรู้ในสาขาวิชาวิศวกรรมสื่อดิจิทัล กับความรู้ใน ศาสตร์อื่นๆ ที่เกี่ยวข้อง (4) PLO 2.4 สามารถวิเคราะห์และแก้ไขปัญหา ด้วยวิธีการที่เหมาะสม รวมถึงการ ประยุกต์ใช้เครื่องมือที่เหมาะสม เช่น โปรแกรมคอมพิวเตอร์ เป็นต้น (5) PLO 2.5 สามารถใช้ความรู้และทักษะในสาขาวิชาวิศวกรรมสื่อดิจิทัลในการ ประยุกต์แก้ไขปัญหาในงานจริงได้ 2.2.2 กลยุทธ์การสอนที่ใช้ในการพัฒนาการเรียนรู้ด้านความรู้ (1) การสอนหลายรูปแบบในรายวิชาตามหลักสูตร ได้แก่ การบรรยาย อภิปราย การจัด กิจกรรมการเรียนรู้ การให้ศึกษาค้นคว้าด้วยตนเอง (2) การฝึกปฏิบัติ การฝึกงาน การได้ฝึกการทำงาน (3) การศึกษาดูงาน การเข้าร่วมประชุมสัมมนา 2.2.3 กลยุทธ์การประเมินผลการเรียนรู้ด้านความรู้ (1) ประเมินประเมินผลการเรียนรู้จากการเรียนรายวิชา โดยการสอบข้อเขียน สอบ ภาคปฏิบัติ การทำแบบฝึกหัด การทำรายงาน และโครงงานที่นำเสนอ (2) ผลการฝึกประสบการณ์จากสถานประกอบการหรือสหกิจศึกษา (3) ประเมินคุณลักษณะบัณฑิต โดยผู้ใช้บัณฑิต 2.3 ทักษะทางปัญญา (Cognitive skills) 2.3.1 ผลการเรียนรู้ด้านทักษะทางปัญญา (1) PLO 3.1 มีความคิดอย่างมีวิจารณญาณที่ดี (2) PLO 3.2 สามารถรวบรวม ศึกษา วิเคราะห์ และ สรุปประเด็นปัญหาและความ ต้องการ (3) PLO 3.3 สามารถคิด วิเคราะห์ และแก้ไขปัญหาได้อย่างมีระบบ รวมถึงการใช้ข้อมูล ประกอบการตัดสินใจในการทำงานได้อย่างมีประสิทธิภาพ (4) PLO 3.4 มีจินตนาการและความยืดหยุ่นในการปรับใช้องค์ความรู้ด้านวิศวกรรมสื่อ ดิจิทัลได้อย่างเหมาะสม ในการพัฒนานวัตกรรมหรือต่อยอดองค์ความรู้ จากเดิมได้อย่างสร้างสรรค์ มีแนวคิดและทักษะของการเป็นผู้ประกอบการ นวัตกรรม (5) PLO 3.5 สามารถสืบค้นข้อมูลและแสวงหาความรู้เพิ่มเติมได้ด้วยตนเอง เพื่อการ เรียนรู้ตลอดชีวิตและทันต่อการเปลี่ยนแปลงทางองค์ความรู้และ เทคโนโลยีใหม่ ๆ 2.3.2 กลยุทธ์การสอนที่ใช้ในการพัฒนาการเรียนรู้ด้านทักษะทางปัญญา (1) กรณีศึกษาทางการประยุกต์จากงานทางด้านวิศวกรรมสื่อดิจิทัล (2) การทดลองในห องปฏิบัติการเพื่อให เกิดแนวคิดสนับสนุนการเรียนการสอน ภาคทฤษฎี (3) การให้ศึกษาค้นคว้าด้วยตนเอง การจัดทำรายงาน และการนำเสนอ การสัมมนา การ ทำโครงงาน (4) จัดกิจกรรมส่งเสริมทักษะการเป็นผู้ประกอบการให้มีความสามารถในการนำเสนอ เพื่ออธิบายโครงการทางด้านธุรกิจ และการเข้าใจความรู้ในการประกอบอาชีพที่เป็น ธุรกิจของตนเอง 2.3.3 กลยุทธ์การประเมินผลการเรียนรู้ด้านทักษะทางปัญญา (1) ประเมินผลการเรียนรู้จากการเรียนรายวิชา โดยการสอบข้อเขียน สอบภาคปฏิบัติ การทำแบบฝึกหัด การทำรายงาน (2) ประเมินโดยใช้แบบทดสอบหรือสัมภาษณ์ (3) ประเมินตามสภาพจริงจากการศึกษาค้นคว้าด้วยตนเอง การโครงงาน การทำวิจัย ผลงานของรายงาน และการรายงานหน้าชั้นเรียน (4) ประเมินผลจากการเข้าร่วมกิจกรรมโดยใช้แบบทดสอบ (5) ประเมินคุณลักษณะบัณฑิต โดยผู้ใช้บัณฑิต 2.4 ทักษะความสัมพันธ์ระหว่างบุคคลและความรับผิดชอบ (Interpersonal skills & 2.4.1 ผลการเรียนรู้ด้านทักษะความสัมพันธ์ระหว่างบุคคลและความรับผิดชอบ (1) PLO 4.1 สามารถสื่อสารกับกลุ่มคนที่หลากหลาย และสามารถสนทนาทั้งภาษาไทย และภาษาต่างประเทศได้อย่างมีประสิทธิภาพ สามารถใช้ความรู้ในสาขา วิชาชีพมาสื่อสารต่อสังคมได้ในประเด็นที่เหมาะสม (2) PLO 4.2 สามารถเป็นผู้ริเริ่มแสดงประเด็นในการแก้ไขสถานการณ์เชิงสร้างสรรค์ทั้ง ส่วนตัวและส่วนรวม พร้อมทั้งแสดงจุดยืนอย่างพอเหมาะทั้งของตนเอง และของกลุ่ม รวมทั้งให้ความช่วยเหลือและอำนวยความสะดวกในการ แก้ไขปัญหาสถานการณ์ต่างๆ (3) PLO 4.3 สามารถวางแผนและรับผิดชอบในการพัฒนาการเรียนรู้ทั้งของตนเอง และ สอดคล้องกับทางวิชาชีพอย่างต่อเนื่อง (4) PLO 4.4 รู้จักบทบาท หน้าที่ และมีความรับผิดชอบในการทำงานตามที่มอบหมาย ทั้งงานบุคคลและงานกลุ่ม สามารถปรับตัวและทำงานร่วมกับผู้อื่นทั้งใน ฐานะผู้นำและผู้ตามได้อย่างมีประสิทธิภาพ สามารถวางตัวได้อย่าง เหมาะสมกับความรับผิดชอบ (5) PLO 4.5 มีจิตสำนึกความรับผิดชอบด้านความปลอดภัยในการทำงาน และการ รักษาสภาพแวดล้อมต่อสังคม 2.4.2 กลยุทธ์การสอนที่ใช้ในการพัฒนาการเรียนรู้ด้านทักษะความสัมพันธ์ระหว่างบุคคล และความรับผิดชอบ (1) ส่งเสริมให้นักศึกษากล้าแสดงออกและเสนอความคิดเห็นโดยการจัดอภิปรายและ เสวนางานที่มอบหมายที่ให้ค้นคว้า (2) การสอนในรายวิชาต่าง ๆ ตามหลักสูตรสอดแทรกจิตสำนึกความรับผิดชอบด้าน ความปลอดภัยในการทำงาน และการรักษาสภาพแวดล้อมต่อสังคม โดยเน้นการ ทำงานเป็นกลุ่ม (3) ปลูกฝังให้มีความรับผิดชอบต่อหน้าที่ เคารพสิทธิและการรับฟังความคิดเห็นของผู้อื่น (4) การจัดให้มีรายวิชาฝึกงาน ฝึกภาคสนาม ฝึกประสบการณ์วิชาชีพ หรือสหกิจศึกษา 2.4.3 กลยุทธ์การประเมินผลการเรียนรู้ด้านทักษะความสัมพันธ์ระหว่างบุคคลและ ความรับผิดชอบ (1) ประเมินจากผลงานการอภิปรายและเสาวนา และสังเกตจากพฤติกรรมจากการเข้า ร่วมกิจกรรม (2) ประเมินผลการเรียนรู้จากรายวิชาต่าง ๆ ที่มีการส่งเสริมให้ทำงานกลุ่ม (3) ติดตามการทำงานร่วมกับสมาชิกกลุ่มของนักศึกษาเป็นระยะ พร้อมบันทึกพฤติกรรม เป็นรายบุคคล (4) ประเมินผลการเรียนรายวิชาฝึกงาน ฝึกประสบการณ์วิชาชีพ หรือสหกิจศึกษา (5) ประเมินคุณลักษณะบัณฑิต โดยผู้ใช้บัณฑิต 2.5 ทักษะในการวิเคราะห์เชิงตัวเลข การสื่อสารและเทคโนโลยีสารสนเทศ (Numerical 2.5.1 ผลการเรียนรู้ด้านทักษะในการวิเคราะห์เชิงตัวเลข การสื่อสารและเทคโนโลยี สารสนเทศ (1) PLO 5.1 มีทักษะในการใช คอมพิวเตอร  สำหรับการทำงานที่เกี่ยวข องกับวิชาชีพได เปนอยางดี (2) PLO 5.2 มีทักษะในการวิเคราะห ข อมูลสารสนเทศทางคณิตศาสตร หรือการแสดง สถิติประยุกต์ตอการแกปญหาที่เกี่ยวของไดอยางสรางสรรค์ (3) PLO 5.3 สามารถประยุกตใชเทคโนโลยีสารสนเทศและการสื่อสารที่ทันสมัยไดอยาง เหมาะสมและ มีประสิทธิภาพ (4) PLO 5.4 มีทักษะในการสื่อสารข อมูลทั้งทางการพูด การเขียน และการสื่อ ความหมายโดยใชสัญลักษณ (5) PLO 5.5 สามารถใช เครื่องมือการคำนวณและเครื่องมือทางวิศวกรรม เพื่อประกอบ วิชาชีพในสาขาวิศวกรรมสื่อดิจิทัลได้ 2.5.2 กลยุทธ์การสอนที่ใช้ในการพัฒนาการเรียนรู้ด้านทักษะในการวิเคราะห์เชิงตัวเลข การสื่อสารและเทคโนโลยีสารสนเทศ (1) การสอนในรายวิชาวิจัย หรือสถิติ หรือรายวิชาศึกษาทั่วไป หรือรายวิชาพื้นฐาน วิชาชีพ (2) การเรียนรู้ด้วยตนเองผ่านระบบ e-Learning และการทดสอบความรู้พื้นฐานด้าน คอมพิวเตอร์และเทคโนโลยีสารสนเทศตามเกณฑ์มาตรฐานของมหาวิทยาลัย 2.5.3 กลยุทธ์การประเมินผลการเรียนรู้ด้านทักษะในการวิเคราะห์เชิงตัวเลข การสื่อสารและ เทคโนโลยีสารสนเทศ (1) ประเมินจากการนำเสนอทั้งในรูปแบบรายงาน และแบบปากเปล่า ข้อเขียน สอบ ภาคปฏิบัติ การทำแบบฝึกหัด การทำรายงาน (2) ประเมินจากเทคนิคการนำเสนอโดยใช้ทฤษฎีการเลือกใช้เครื่องมือทางเทคโนโลยี สารสนเทศ หรือคณิตศาสตร์ และสถิติที่เกี่ยวข้องทางวิศวกรรมศาสตร์ (3) ประเมินจากเทคนิคในการวิเคราะห ข อมูลสารสนเทศทางคณิตศาสตร หรือการแสดง สถิติประยุกตในการแกปญหาโจทยการคำนวณ 3. ผลการเรียนรู้ในแต่ละชั้นปี PLO ชั้นปีที่ 1 มีความรู้พื้นฐานทางสื่อดิจิทัล คณิตศาสตร์ การออกแบบกราฟิก การเขียนโปรแกรม การเรียนรู้ ของเครื่อง และได้ประสบการณ์จากการพัฒนาผลงานด้านการออกแบบกราฟิก และ การพัฒนาผลการ เรียนรู้ใน PLO 1-5 PLO ชั้นปีที่ 2 มีความรู้พื้นฐานในด้านโครงสร้างข้อมูลและอัลกอริธึม สื่อดิจิทัลอิเล็กทรอนิกส์ การเขียน โปรแกรมแบบมีปฏิสัมพันธ์ การพัฒนาซอฟต์แวร์ คอมพิวเตอร์กราฟิก และได้ประสบการณ์จากการพัฒนา ผลงานด้านการเขียนโปรแกรมแบบมีปฏิสัมพันธ์ และ การพัฒนาผลการเรียนรู้ใน PLO 1-5 PLO ชั้นปีที่ 3 มีความรู้ด้านการประมวลผลสื่อดิจิทัล เครือข่ายคอมพิวเตอร์และเทคโนโลยีอินเทอร์เน็ต ได้ ประสบการณ์จากการพัฒนาผลงานด้าน แอนิเมชันสามมิติ และการพัฒนาเกม ได้รับความรู้เฉพาะด้านที่ นักศึกษาสนใจด้าน อุตสาหกรรมสื่อดิจิทัล ปฏิสัมพันธ์สื่อดิจิทัล ปัญญาประดิษฐ์ หรือการพัฒนาซอฟต์แวร์ และ การพัฒนาผลการเรียนรู้ใน PLO 1-5 PLO ชั้นปีที่ 4 มีความรู้ด้านความเป็นจริงขยาย ได้รับความรู้เฉพาะด้านที่นักศึกษาสนใจด้าน อุตสาหกรรมสื่อดิจิทัล ปฏิสัมพันธ์สื่อดิจิทัล ปัญญาประดิษฐ์ หรือการพัฒนาซอฟต์แวร์ และได้ฝึกประสบการณ์ในสถาน ประกอบการมีความ พร้อมทำงานในภาคอุตสาหกรรมด้านสื่อดิจิทัลทั้งในประเทศและต่างประเทศ และ การพัฒนาผลการเรียนรู้ใน PLO 1-5 4.   แผนที่แสดงการกระจายความรับผิดชอบมาตรฐานผลการเรียนรู้จากหลักสูตรสู่รายวิชา (เอกสารแนบท้ายหมายเลข 1) หมวดที่ 5.  หลักเกณฑ์ในการประเมินผลนักศึกษา 1. กฎระเบียบหรือหลักเกณฑ์ในการให้ระดับคะแนน เป็นไปตามระเบียบมหาวิทยาลัยขอนแก่น ว่าด้วย การศึกษาขั้นปริญญาตรี พ.ศ. 2562 หมวดที่ 8 ข้อ 29 และ 30 (เอกสารแนบท้ายหมายเลข 5) หรือระเบียบที่จะปรับปรุงใหม่ 2. กระบวนการทวนสอบมาตรฐานผลสัมฤทธิ์ของนักศึกษา อาจารย์ผู้สอนแต่ละรายวิชา ทวนสอบมาตรฐานผลสัมฤทธิ์ของนักศึกษาโดย 2.1 เทียบเคียงผลการเรียนของนักศึกษาที่เรียนในรายวิชา ซึ่งอาจเป็น ต่างกลุ่ม ต่างชั้นปี ต่างคณะ แล้วแต่กรณี เพื่อนำผลมาใช้ในการปรับปรุงรายวิชา 2.2 ทบทวนเนื้อหารายวิชาทุกปีการศึกษา โดยอาจพิจารณาร่วมกับอาจารย์ผู้สอนรายวิชาอื่นที่มี เนื้อหาใกล้เคียงกัน เพื่อไม่ให้เกิดความซ้ าซ้อน หรือให้เกิดความสัมพันธ์และต่อเนื่อง แล้วแต่กรณี และ ทบทวนเนื้อหาโดยเทียบเคียงกับรายวิชาของสถาบันอื่น หรือเทียบเคียงกับตำราหรือบทความทางวิชาการ หรือผลการวิจัย เพื่อให้เกิดการพัฒนาเนื้อหาให้ทันสมัยและมีมาตรฐานทางวิชาการ 2.3 เทียบเคียงกับข้อสอบมาตรฐานวิชาชีพ และวิเคราะห์ผลการสอบวัดความรู้ตามมาตรฐานวิชาชีพ 3. เกณฑ์การสำเร็จการศึกษาตามหลักสูตร 3.1 เป็นไปตามประกาศกระทรวงศึกษาธิการ เรื่อง เกณฑ์มาตรฐานหลักสูตร ระดับปริญญาตรี พ.ศ. 2558 และ 3.2  เป็นไปตามระเบียบมหาวิทยาลัยขอนแก่น ว่าด้วย การศึกษาขั้นปริญญาตรี พ.ศ. 2562 หมวดที่ 10 ข้อ 36  (เอกสารแนบท้ายหมายเลข 5) หรือระเบียบที่จะปรับปรุงใหม่ 3.3 เข้าร่วมกิจกรรมการเรียนรู้แบบบูรณาการครบตามเกณฑ์ที่กำหนดตามประกาศของมหาวิทยาลัย 3.4 มีผลการสอบวัดความรู้ทางภาษาอังกฤษที่มหาวิทยาลัยขอนแก่นยอมรับ 3.5 ผ่านเงื่อนไขในกลุ่มวิชาบังคับตามที่หลักสูตรกำหนด ดังนี้ 3.5.1 นักศึกษาต้องเรียนและสอบผ่านรายวิชาในกลุ่มวิชาบังคับทุกรายวิชา และ 3.5.2  นักศึกษาต้องได้ระดับคะแนนแต่ละวิชาไม่ต่ ากว่า C หรือต้องได้คะแนนเฉลี่ยสะสม ไม่ต่ ากว่า 2.00 โดยการคิดค่าคะแนนเฉลี่ยสะสม (G.P.A. Point) คำนวณจากระดับคะแนนที่ดีที่สุดของ แต่ละรายวิชาในกลุ่มวิชาบังคับทุกรายวิชา 3.6 การให้อนุปริญญา นักศึกษาคณะวิศวกรรมศาสตร์ ที่สมควรได้รับอนุปริญญาตามหลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมสื่อดิจิทัล (หลักสูตรนานาชาติ) จะต้องมีคุณสมบัติ ดังนี้ 3.6.1 ไม่อยู่ในระหว่างการรับโทษทางวินัยที่ระบุให้งดการเสนอชื่อเพื่อรับปริญญาหรือ อนุปริญญา 3.6.2 ไม่เป็นผู้ค้างหนี้สินกับทางมหาวิทยาลัย 3.6.3 ศึกษาและสอบผ่านรายวิชาต่างๆ ครบตามหลักสูตรแล้ว และมีระดับคะแนนเฉลี่ยสะสมไม่ ถึง 2.00 แต่ไม่ต่ ากว่า 1.75 หมวดที่ 6.  การพัฒนาคณาจารย์ 1. การเตรียมการสำหรับอาจารย์ใหม่ 1.1 การให้เข้ารับการอบรมตามหลักสูตร “การพัฒนาอาจารย์ใหม่” ของมหาวิทยาลัย ซึ่งเป็น หลักเกณฑ์ให้อาจารย์ใหม่ทุกคนต้องเข้ารับการอบรม ให้มีความรู้ความเข้าใจเกี่ยวกับหลักสูตรและการ บริหารวิชาการของมหาวิทยาลัย บทบาทหน้าที่ของอาจารย์มหาวิทยาลัยและจรรยาบรรณครู และให้มี ทักษะเกี่ยวกับการจัดการเรียนการสอนที่เน้นผู้เรียนเป็นสำคัญ การสอนสอดแทรกคุณธรรมและจริยธรรม และการสอนโดยใช้สื่อและเทคโนโลยีสารสนเทศ 1.2 การมอบหมายให้มีอาจารย์พี่เลี้ยงทำหน้าที่ให้คำแนะนำและเป็นที่ปรึกษาในการจัดการเรียนการสอน 1.3 การชี้แจงและแนะนำหลักสูตร รายวิชาในหลักสูตร 1.4 การมอบหมายให้อาจารย์ใหม่ศึกษาค้นคว้า จัดทำเอกสารที่เกี่ยวข้องกับการสอน ในหัวข้อหนึ่ง หรือหลายหัวข้อที่อาจารย์ใหม่มีความรู้และถนัด เพื่อทดลองทำการสอนภายใต้คำแนะนำของอาจารย์พี่ เลี้ยง หรือประธานหลักสูตร 1.5 การกำหนดให้อาจารย์ใหม่เข้าร่วมสังเกตการณ์การสอนของอาจารย์ในหลักสูตร 2. การพัฒนาความรู้และทักษะให้แก่อาจารย์ 2.1 การพัฒนาทักษะการจัดการเรียนการสอน การวัดและการประเมินผล 2.1.1 กำหนดให้อาจารย์ต้องเข้ารับการอบรมเพื่อพัฒนาตนเองด้านการจัดการเรียนการสอน การ วัดและการประเมินผล ตามความต้องการของอาจารย์ และเป็นไปตามนโยบายของมหาวิทยาลัย ซึ่ง มหาวิทยาลัยมีการเปิดหลักสูตรอบรมเพื่อพัฒนาอาจารย์ในหัวข้อต่างๆ ที่เกี่ยวข้องกับการจัดการเรียนการ สอน การวิจัย การผลิตผลงานทางวิชาการ เป็นประจำทุกปี 2.1.2 จัดให้มีการสอนแบบเป็นทีม ซึ่งจะส่งเสริมโอกาสให้อาจารย์ได้มีประสบการณ์การสอน ร่วมกับคนอื่น รวมถึงการมีโอกาสได้เป็นผู้รับผิดชอบรายวิชา ผู้ประสานงาน และผู้ร่วมทีมการสอน 2.1.3 ส่งเสริมหรือสร้างโอกาสให้มีการแลกเปลี่ยนเรียนรู้ประสบการณ์ด้านการจัดการเรียนการ สอนระหว่างอาจารย์ในหลักสูตร หรือทำวิจัยการเรียนการสอนที่สามารถนำไปเผยแพร่ในการประชุม วิชาการที่มีการจัดการเรียนการสอนในสาขาวิชาเดียวกันของหลายๆ สถาบัน 2.2 การพัฒนาวิชาการและวิชาชีพด้านอื่นๆ 2.2.1 ส่งเสริมให้อาจารย์เข้าร่วมการอบรม การประชุมสัมมนาในสาขาวิชาการหรือวิชาชีพที่จัด ทั้งภายในและภายนอกมหาวิทยาลัย อย่างน้อยปีละ 1 ครั้ง 2.2.2 ส่งเสริมให้อาจารย์ผลิตผลงานทางวิชาการในรูปแบบต่างๆ และการนำเสนอผลงานในการ ประชุมวิชาการในสาขาวิชาการหรือวิชาชีพ อย่างน้อยให้มีผลงานการเขียนหรือการนำเสนอปีละ 1 เรื่อง หมวดที่ 7.  การประกันคุณภาพหลักสูตร 1. การกำกับมาตรฐาน การจัดการหลักสูตรของมหาวิทยาลัยขอนแก่น กำหนดให้ทุกหลักสูตรมีคณะกรรมการบริหาร หลักสูตร ซึ่งต้องทำหน้าที่ดังนี้ 1.1 มีอาจารย์ผู้รับผิดชอบหลักสูตรฯที่มีจำนวนและคุณสมบัติตรงตามเกณฑ์มาตรฐานหลักสูตร ปริญญาตรี พ.ศ. 2558 เพื่อทำหน้าที่บริหารและดำเนินการควบคุมคุณภาพการจัดการเรียนการสอน การ ประเมินผล การปรับปรุงและการพัฒนาหลักสูตร โดยมีการประชุมภาคการศึกษาละ 2 ครั้งหรือมากกว่า 1.2 มีคณะกรรมการขับเคลื่อนฝ่ายวิชาการ ระดับคณะ เพื่อควบคุมและดูแลคุณภาพการจัดการเรียน การสอนของหลักสูตรฯ 1.3 คณะกรรมการบริหารหลักสูตรติดตามการจัดทำ มคอ. 3 – 6 ของแต่ละรายวิชา และดำเนินการ จัดทำ มคอ.7 ให้เป็นไปตามระยะเวลาที่กำหนด และนำผลของ มคอ.7 มาวางแผนการจัดการเรียนการ สอน และการปรับปรุงรายวิชาที่รับผิดชอบให้เป็นไปตามมาตรฐานหลักสูตรปริญญาตรี พ.ศ. 2558 2. บัณฑิต 2.1 มีการประเมินคุณภาพของบัณฑิตตามกรอบมาตรฐานคุณวุฒิระดับอุดมศึกษาแห่งชาติจากผู้ใช้ บัณฑิตทุกปีการศึกษา เพื่อนำข้อมูลมาใช้ในการปรับปรุงหลักสูตรครั้งถัดไป 2.2 มีการสำรวจการได้งานทำของบัณฑิตทุกปีการศึกษา 2.3 ติดตามและวิเคราะห์ความต้องการของตลาดแรงงาน ความก้าวหน้าของเทคโนโลยี เพื่อเป็นข้อมูล ในการพัฒนาและปรับปรุงการเรียนการสอนให้ทันสมัย 3. นักศึกษา 3.1 การรับนักศึกษา 3.1.1 มีกระบวนการรับนักศึกษาเพื่อให้ได้นักศึกษาตามเป้าหมายของการรับทั้งด้านปริมาณและ คุณภาพ 3.1.2 มีการเตรียมความพร้อมของนักศึกษาในปีแรกของการเรียน เพื่อให้มีทักษะพื้นฐานที่ จำเป็นสำหรับการเรียนในหลักสูตรฯ 3.2 การส่งเสริมและพัฒนานักศึกษา 3.2.1 หลักสูตรมีการแต่งตั้งอาจารย์ที่ปรึกษาให้แก่นักศึกษาทุกคน โดยนักศึกษาที่มีปัญหาในการ เรียนสามารถปรึกษากับอาจารย์ที่ปรึกษาได้ โดยต้องกำหนดชั่วโมงให้คำปรึกษา (Office hours) เพื่อให้ นักศึกษาเข้าปรึกษาได้ นอกจากนี้ยังมีระบบอาจารย์ที่ปรึกษาโครงงาน ซึ่งจะคอยชี้แนะกระบวนการใน การพัฒนาศักยภาพการเรียนรู้ และการทำโครงงาน และมีระบบให้ข้อมูลย้อนกลับจากผลการศึกษาและ การประเมินด้านต่างๆ เพื่อให้นักศึกษาได้มีการพัฒนาตนเอง 3.2.2 หลักสูตรมีการจัดกิจกรรมวิชาการหรือทางวิชาชีพ เพื่อเพิ่มพูนความรู้ ทักษะและศักยภาพ ให้กับนักศึกษา โดยผู้รับผิดชอบหลักสูตรเป็นผู้กำหนดรูปแบบกิจกรรม ดำเนินการและประเมินผลกิจกรรม เพื่อปรับปรุงกิจกรรมให้มีประโยชน์ตรงตามผลการเรียนรู้ของผู้เรียน 3.3 ผลที่เกิดกับนักศึกษา 3.3.1 ผู้รับผิดชอบหลักสูตรรายงานอัตราการคงอยู่ของนักศึกษา 3.3.2 ผู้รับผิดชอบหลักสูตรและอาจารย์ผู้สอนหาแนวทางในการลดอัตราการตกออกของ นักศึกษา โดยดำเนินการประชุมหารือหลังสิ้นสุดปีการศึกษา 3.3.3 ผู้รับผิดชอบหลักสูตรดำเนินการสำรวจความพึงพอใจต่อการบริหารหลักสูตรในทุกปี การศึกษา และให้นำผลการประเมินไปปรับปรุงคุณภาพของการบริหารหลักสูตร 3.3.4 กรณีที่นักศึกษาสงสัยผลการประเมินในรายวิชาใดๆ สามารถยื่นคำร้องตรวจสอบระดับ คะแนนในแต่ละรายวิชาได้ ตามหลักเกณฑ์ของมหาวิทยาลัย 4. อาจารย์ 4.1 การบริหารและพัฒนาอาจารย์ 4.1.1 มีการวางแผนระยะยาวด้านอัตรากำลังอาจารย์ให้เป็นไปตามเกณฑ์มาตรฐานหลักสูตร 4.1.2  มีระบบการรับอาจารย์ใหม่ที่มีความรู้ความสามารถและความเชี่ยวชาญ รวมทั้งมีการ พัฒนาอาจารย์ที่มีอยู่เดิมอย่างต่อเนื่อง เพื่อให้หลักสูตรมีความเข้มแข็ง อาจารย์ในหลักสูตรสามารถ ส่งเสริมการทำงานตามความชำนาญของแต่ละคนได้อย่างมีประสิทธิภาพ 4.1.3  อาจารย์ประจำหลักสูตรต้องมีวุฒิการศึกษา ตำแหน่งทางวิชาการ และประสบการณ์ ใน จำนวนที่ไม่ต่ ากว่าตามเกณฑ์มาตรฐานหลักสูตรที่กำหนดโดย สกอ. 4.1.4 มีการมอบหมายภาระหน้าที่ให้เหมาะสมกับคุณวุฒิ ความรู้ ความสามารถ และ ประสบการณ์ 4.2 คุณภาพอาจารย์ มีการติดตามและกระตุ้นให้อาจารย์มีตำแหน่งทางวิชาการที่สูงขึ้นผ่านระบบประเมินผลการ ปฏิบัติงานในแต่ละปี 4.3  ผลที่เกิดกับอาจารย์ อาจารย์ผู้รับผิดชอบหลักสูตรมีการติดตามการบริหารจำนวนอาจารย์ที่เหมาะสมต่อจำนวนนักศึกษา อัตราการคงอยู่ของอาจารย์ และความพึงพอใจของอาจารย์ผู้สอนต่อการบริหารงานของหลักสูตร และรายงานให้ อาจารย์ผู้สอนในสาขาวิชาทราบทุกปีการศึกษา เพื่อนำข้อมูลไปพัฒนาคุณภาพของอาจารย์ 5. หลักสูตร การเรียนการสอน การประเมินผู้เรียน 5.1 สาระของรายวิชาในหลักสูตร 5.1.1 มีระบบ กลไก ในการออกแบบหลักสูตรและสาระรายวิชาในหลักสูตรผ่านการวิพากษ์การ เรียนการสอนเมื่อสิ้นสุดแต่ละภาคการศึกษา เพื่อสรุปปัญหาและแนวทางการพัฒนา 5.1.2 เนื้อหาที่กำหนดในรายวิชาไม่มีความซ้ าซ้อน กลุ่มรายวิชามีความต่อเนื่องสัมพันธ์กัน โดย รายวิชามีลำดับก่อนหลังที่เหมาะสม เอื้อให้นักศึกษามีพื้นฐานความรู้ในการเรียนวิชาต่อยอด และมีการ ปรับปรุงให้ทันสมัยตลอดเวลา 5.2 การวางระบบผู้สอนและกระบวนการจัดการเรียนการสอน 5.2.1 อาจารย์ผู้รับผิดชอบหลักสูตรและผู้สอน ประชุมร่วมกันในการวางแผนจัดการเรียนการ สอน ประเมินผล และให้ความเห็นชอบการประเมินผลทุกรายวิชา เพื่อเตรียมข้อมูลไว้สำหรับการปรับปรุง หลักสูตร ตลอดจนปรึกษาหารือแนวทางที่จะทำให้บรรลุเป้าหมายตามหลักสูตร และได้บัณฑิตเป็นไปตาม คุณลักษณะบัณฑิตที่พึงประสงค์ 5.2.2 อาจารย์ผู้รับผิดชอบหลักสูตรกำหนดผู้สอนในแต่ละรายวิชาโดยพิจารณาจากความ เชี่ยวชาญ ผลการประเมินการสอนที่ผ่านมา และภาระงานสอนโดยรวม 5.2.3 อาจารย์ผู้รับผิดชอบหลักสูตรทำหน้าที่ติดตามการจัดทำ มคอ.3 และ มคอ.5 ในแต่ละภาค การศึกษา แล้วนำผลที่ได้มาแลกเปลี่ยนเรียนรู้เรื่องการเรียนการสอนผ่านการประชุมอาจารย์ผู้สอนเมื่อ สิ้นสุดแต่ละภาคการศึกษา 5.2.4 มีระบบการรับการอุทธรณ์ของนักศึกษาผ่านอาจารย์ผู้รับผิดชอบหลักสูตร และนำเข้าที่ ประชุมอาจารย์ผู้รับผิดชอบหลักสูตรเพื่อพิจารณา 5.3 การประเมินผู้เรียน มีการประเมินผลการเรียนรู้ตามกรอบมาตรฐานคุณวุฒิระดับอุดมศึกษาแห่งชาติ เช่น การ ตรวจสอบการประเมินผลการเรียนรู้ของนักศึกษา การประเมินการจัดการเรียนการสอน การทบทวน ผลสัมฤทธิ์ของนักศึกษา โดยการประชุมร่วมกันของผู้รับผิดชอบหลักสูตรและอาจารย์ผู้สอน เมื่อสิ้นสุด ภาคการศึกษา 6. สิ่งสนับสนุนการเรียนรู้ 6.1 การบริหารงบประมาณ คณะจัดสรรงบประมาณประจำปี เพื่อจัดซื้อตำรา สื่อการเรียนการสอน โสตทัศนูปกรณ์ วัสดุและ ครุภัณฑ์อย่างเพียงพอเพื่อสนับสนุนการเรียนการสอนในชั้นเรียนและสร้างสภาพแวดล้อมให้เหมาะสมกับ การเรียนรู้ด้วยตนเองของนักศึกษา 6.2 ทรัพยากรการเรียนการสอนที่มีอยู่เดิม สถานที่ ภาควิชาวิศวกรรมคอมพิวเตอร์ มีสำนักงานอยู่ที่อาคาร EN04 คณะวิศวกรรมศาสตร์ มีพื้นที่ สำหรับการเรียนการสอน และ พื้นที่ใช้สอยของนักศึกษาดังนี้ ห้องปฏิบัติการทางไมโครโปรเซสเซอร์ 1 ห้อง ห้องปฏิบัติการไมโครคอมพิวเตอร์ 2 ห้อง ห้องปฏิบัติการไมโครคอมพิวเตอร์ (ใช้รวมกับของคณะฯ) 1 ห้อง ห้องปฏิบัติการระบบเครือข่าย 1 ห้อง ห้องปฏิบัติการระบบฐานข้อมูล 1 ห้อง ห้องปฏิบัติการการประมวลผลสัญญาณและภาพ 1 ห้อง ห้องประชุม 1 ห้อง ห้องประชุม (ใช้รวมกับของคณะฯ) 3 ห้อง ห้องบรรยาย 5 ห้อง อุปกรณ์การสอน เครื่องไมโครคอมพิวเตอร์ 70 เครื่อง เครื่องรับโทรทัศน์ 1 เครื่อง เครื่องเล่นวีดิทัศน์ 1 เครื่อง เครื่องฉายภาพข้ามศีรษะพร้อมจอรับภาพ (ประจำห้องเรียน) 7 เครื่อง จอฉาย 2  จอ 1  ชุด เครื่องขยายเสียง 1  ชุด 4 เครื่อง",
    prerequisites: null,
  },
};
