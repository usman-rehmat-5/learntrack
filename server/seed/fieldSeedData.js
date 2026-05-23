const fields = [
  {
    name: 'Computer Science',
    icon: 'code',
    color: 'from-blue-600 to-indigo-800',
    bannerColor: 'bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900',
    description: 'Master the fundamentals of computing, algorithms, and software systems',
    longDescription: 'Computer Science is the foundation of all modern technology. This comprehensive path covers everything from programming fundamentals to advanced system design, preparing you for a career in software engineering, research, or academia.',
    overview: 'A complete journey from programming basics to advanced computer science concepts.',
    order: 1,
    difficulty: 'all-levels',
    totalDuration: '12-18 months',
    prerequisites: ['Basic computer literacy', 'High school mathematics'],
    technologies: ['Python', 'Java', 'C++', 'Git', 'Linux', 'Docker', 'SQL'],
    subFields: [
      { name: 'Programming Fundamentals', icon: 'python', description: 'Learn core programming concepts', color: 'from-green-400 to-emerald-600', order: 1, skills: ['Variables', 'Data Types', 'Control Flow', 'Functions', 'File I/O'], technologies: ['Python', 'VS Code', 'Git'], duration: '2-3 months' },
      { name: 'Object-Oriented Programming', icon: 'java', description: 'Master OOP principles and design', color: 'from-blue-400 to-indigo-600', order: 2, skills: ['Classes', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction', 'SOLID'], technologies: ['Java', 'C++', 'Python'], duration: '2-3 months' },
      { name: 'Data Structures & Algorithms', icon: 'chart', description: 'Essential DSA for problem solving', color: 'from-purple-400 to-violet-600', order: 3, skills: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Sorting', 'Searching', 'DP'], technologies: ['Python', 'Java', 'LeetCode'], duration: '4-6 months' },
      { name: 'Operating Systems', icon: 'cogs', description: 'Understand how OS works', color: 'from-gray-500 to-slate-700', order: 4, skills: ['Process Management', 'Memory Management', 'File Systems', 'Scheduling'], technologies: ['Linux', 'C', 'Unix'], duration: '2-3 months' },
      { name: 'Database Management Systems', icon: 'database', description: 'Design and manage databases', color: 'from-cyan-400 to-teal-600', order: 5, skills: ['SQL', 'Normalization', 'Indexing', 'Transactions', 'ER Diagrams'], technologies: ['MySQL', 'PostgreSQL', 'MongoDB'], duration: '2-3 months' },
      { name: 'Computer Networks', icon: 'globe', description: 'Learn networking fundamentals', color: 'from-sky-400 to-blue-600', order: 6, skills: ['TCP/IP', 'OSI Model', 'Routing', 'DNS', 'HTTP/HTTPS'], technologies: ['Wireshark', 'Cisco Packet Tracer', 'Linux'], duration: '2-3 months' },
      { name: 'Software Engineering', icon: 'build', description: 'Professional software development', color: 'from-amber-400 to-orange-600', order: 7, skills: ['SDLC', 'Agile', 'Design Patterns', 'Testing', 'CI/CD'], technologies: ['Git', 'Jira', 'Docker', 'Jenkins'], duration: '2-3 months' },
      { name: 'System Design', icon: 'project', description: 'Design scalable systems', color: 'from-red-400 to-rose-600', order: 8, skills: ['Microservices', 'Load Balancing', 'Caching', 'Database Design', 'API Design'], technologies: ['AWS', 'Redis', 'Kafka', 'Docker'], duration: '3-4 months' }
    ],
    roadmap: [
      { step: 1, title: 'Introduction to Programming', description: 'Start with Python basics - variables, loops, functions', level: 'beginner', skills: ['Basic Syntax', 'Variables', 'Control Flow'], technologies: ['Python 3', 'VS Code'], duration: '4-6 weeks', prerequisites: [] },
      { step: 2, title: 'Data Structures Fundamentals', description: 'Learn arrays, linked lists, stacks, queues', level: 'beginner', skills: ['Arrays', 'Linked Lists', 'Stacks', 'Queues'], technologies: ['Python', 'Java'], duration: '4-6 weeks', prerequisites: ['Introduction to Programming'] },
      { step: 3, title: 'Object-Oriented Programming', description: 'Master classes, inheritance, polymorphism', level: 'beginner', skills: ['OOP Concepts', 'Class Design', 'Inheritance'], technologies: ['Java', 'C++'], duration: '4-6 weeks', prerequisites: ['Data Structures Fundamentals'] },
      { step: 4, title: 'Advanced Algorithms', description: 'Trees, graphs, dynamic programming', level: 'intermediate', skills: ['Trees', 'Graphs', 'Dynamic Programming', 'Greedy'], technologies: ['Python', 'LeetCode'], duration: '8-12 weeks', prerequisites: ['Object-Oriented Programming'] },
      { step: 5, title: 'Operating Systems Concepts', description: 'Processes, threads, memory management', level: 'intermediate', skills: ['Process Scheduling', 'Memory Management', 'Concurrency'], technologies: ['Linux', 'C'], duration: '6-8 weeks', prerequisites: ['Advanced Algorithms'] },
      { step: 6, title: 'Database Design & SQL', description: 'Relational databases, queries, normalization', level: 'intermediate', skills: ['SQL', 'Database Design', 'Normalization'], technologies: ['PostgreSQL', 'MySQL'], duration: '4-6 weeks', prerequisites: ['Operating Systems Concepts'] },
      { step: 7, title: 'Computer Networks', description: 'TCP/IP, HTTP, DNS, network security', level: 'intermediate', skills: ['Networking', 'Protocols', 'Security Basics'], technologies: ['Wireshark', 'Cisco'], duration: '4-6 weeks', prerequisites: ['Database Design & SQL'] },
      { step: 8, title: 'System Design & Architecture', description: 'Design scalable distributed systems', level: 'advanced', skills: ['Microservices', 'Scalability', 'Design Patterns'], technologies: ['AWS', 'Docker', 'Kafka'], duration: '8-12 weeks', prerequisites: ['Computer Networks'] }
    ],
    careerPaths: [
      { title: 'Software Engineer', description: 'Build and maintain software applications', roles: ['Junior Developer', 'Software Engineer', 'Senior Engineer', 'Tech Lead'], salary: '$70K - $200K+', demand: 'very-high', growth: '25%' },
      { title: 'Systems Architect', description: 'Design high-level system architecture', roles: ['Solutions Architect', 'Enterprise Architect', 'Cloud Architect'], salary: '$120K - $250K+', demand: 'high', growth: '15%' },
      { title: 'Research Scientist', description: 'Advance computing through research', roles: ['Research Assistant', 'PhD Researcher', 'AI Scientist'], salary: '$80K - $180K+', demand: 'medium', growth: '20%' }
    ]
  },
  {
    name: 'Web Development',
    icon: 'globe',
    color: 'from-blue-500 to-cyan-500',
    bannerColor: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600',
    description: 'Build modern, responsive websites and web applications',
    longDescription: 'Web Development is one of the most in-demand skills in tech. From frontend interfaces to backend APIs, this path covers everything you need to become a professional web developer.',
    overview: 'From HTML basics to full-stack applications with modern frameworks.',
    order: 2,
    difficulty: 'all-levels',
    totalDuration: '8-14 months',
    prerequisites: ['Basic computer skills'],
    technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
    subFields: [
      { name: 'Frontend Development', icon: 'palette', description: 'Build beautiful user interfaces', color: 'from-pink-400 to-rose-600', order: 1, skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Responsive Design'], technologies: ['React', 'Tailwind CSS', 'Next.js', 'TypeScript'], duration: '4-6 months' },
      { name: 'Backend Development', icon: 'cogs', description: 'Create powerful server-side applications', color: 'from-gray-600 to-slate-800', order: 2, skills: ['Node.js', 'Express', 'APIs', 'Databases', 'Authentication'], technologies: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL'], duration: '4-6 months' },
      { name: 'Full Stack Development', icon: 'mobile', description: 'Master both frontend and backend', color: 'from-purple-500 to-indigo-600', order: 3, skills: ['Frontend', 'Backend', 'DevOps', 'Deployment'], technologies: ['MERN', 'Next.js', 'Docker', 'AWS'], duration: '8-12 months' },
      { name: 'MERN Stack', icon: 'react', description: 'MongoDB, Express, React, Node.js', color: 'from-green-400 to-emerald-600', order: 4, skills: ['MongoDB', 'Express', 'React', 'Node.js'], technologies: ['MongoDB', 'Express', 'React', 'Node.js'], duration: '5-7 months' }
    ],
    roadmap: [
      { step: 1, title: 'HTML & CSS Fundamentals', description: 'Learn semantic HTML and modern CSS', level: 'beginner', skills: ['HTML5', 'CSS3', 'Semantic Markup', 'Box Model'], technologies: ['VS Code', 'Chrome DevTools'], duration: '3-4 weeks', prerequisites: [] },
      { step: 2, title: 'JavaScript Essentials', description: 'Core JavaScript - ES6+, DOM manipulation', level: 'beginner', skills: ['Variables', 'Functions', 'DOM', 'Events', 'Async/Await'], technologies: ['JavaScript', 'Node.js'], duration: '5-7 weeks', prerequisites: ['HTML & CSS Fundamentals'] },
      { step: 3, title: 'Responsive Design & CSS Frameworks', description: 'Build responsive layouts with modern CSS', level: 'beginner', skills: ['Flexbox', 'Grid', 'Media Queries', 'Tailwind CSS'], technologies: ['Tailwind CSS', 'Bootstrap'], duration: '3-4 weeks', prerequisites: ['JavaScript Essentials'] },
      { step: 4, title: 'React.js Fundamentals', description: 'Build modern UIs with React', level: 'intermediate', skills: ['Components', 'Hooks', 'State Management', 'Routing'], technologies: ['React', 'React Router'], duration: '6-8 weeks', prerequisites: ['Responsive Design & CSS Frameworks'] },
      { step: 5, title: 'Node.js & Express.js', description: 'Server-side JavaScript with Express', level: 'intermediate', skills: ['REST APIs', 'Middleware', 'Routing', 'Error Handling'], technologies: ['Node.js', 'Express.js'], duration: '4-6 weeks', prerequisites: ['React.js Fundamentals'] },
      { step: 6, title: 'Database Integration', description: 'MongoDB and SQL databases', level: 'intermediate', skills: ['CRUD', 'Schemas', 'Relationships', 'Aggregation'], technologies: ['MongoDB', 'Mongoose', 'PostgreSQL'], duration: '4-5 weeks', prerequisites: ['Node.js & Express.js'] },
      { step: 7, title: 'Authentication & Security', description: 'JWT, OAuth, security best practices', level: 'intermediate', skills: ['JWT', 'OAuth', 'BCrypt', 'Session Management'], technologies: ['Passport.js', 'JWT', 'bcrypt'], duration: '2-3 weeks', prerequisites: ['Database Integration'] },
      { step: 8, title: 'Full Stack Project & Deployment', description: 'Build and deploy a complete full-stack app', level: 'advanced', skills: ['Full Stack', 'DevOps', 'CI/CD', 'Cloud Deployment'], technologies: ['AWS', 'Vercel', 'Docker', 'GitHub Actions'], duration: '6-8 weeks', prerequisites: ['Authentication & Security'] }
    ],
    careerPaths: [
      { title: 'Frontend Developer', description: 'Build user interfaces and experiences', roles: ['Junior Frontend Dev', 'Frontend Engineer', 'UI Engineer'], salary: '$65K - $180K+', demand: 'very-high', growth: '20%' },
      { title: 'Backend Developer', description: 'Design and build server-side systems', roles: ['Backend Dev', 'API Engineer', 'Server Engineer'], salary: '$70K - $190K+', demand: 'very-high', growth: '22%' },
      { title: 'Full Stack Developer', description: 'Build complete web applications', roles: ['Full Stack Dev', 'Web Developer', 'Software Engineer'], salary: '$75K - $200K+', demand: 'very-high', growth: '25%' }
    ]
  },
  {
    name: 'Artificial Intelligence',
    icon: 'robot',
    color: 'from-purple-600 to-pink-600',
    bannerColor: 'bg-gradient-to-br from-purple-700 via-violet-800 to-pink-900',
    description: 'Build intelligent systems and AI-powered applications',
    longDescription: 'Artificial Intelligence is revolutionizing every industry. From machine learning to generative AI, this path covers the complete AI ecosystem.',
    overview: 'From Python basics to advanced deep learning and generative AI.',
    order: 3,
    difficulty: 'advanced',
    totalDuration: '12-18 months',
    prerequisites: ['Programming basics', 'Linear algebra', 'Statistics'],
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'LangChain', 'Hugging Face'],
    subFields: [
      { name: 'Machine Learning', icon: 'chartline', description: 'Build predictive models', color: 'from-blue-500 to-indigo-600', order: 1, skills: ['Regression', 'Classification', 'Clustering', 'Feature Engineering'], technologies: ['Scikit-learn', 'XGBoost', 'Pandas'], duration: '4-6 months' },
      { name: 'Deep Learning', icon: 'brain', description: 'Neural networks and advanced AI', color: 'from-purple-500 to-violet-600', order: 2, skills: ['Neural Networks', 'CNNs', 'RNNs', 'Transformers'], technologies: ['TensorFlow', 'PyTorch', 'Keras'], duration: '4-6 months' },
      { name: 'Natural Language Processing', icon: 'language', description: 'Process and understand text', color: 'from-green-500 to-emerald-600', order: 3, skills: ['Text Processing', 'Word Embeddings', 'Seq2Seq', 'Attention'], technologies: ['NLTK', 'spaCy', 'Hugging Face', 'BERT'], duration: '3-4 months' },
      { name: 'Computer Vision', icon: 'eye', description: 'Teach machines to see', color: 'from-amber-500 to-orange-600', order: 4, skills: ['Image Processing', 'Object Detection', 'Segmentation'], technologies: ['OpenCV', 'YOLO', 'Detectron2'], duration: '3-4 months' },
      { name: 'Generative AI & LLMs', icon: 'star', description: 'Create with generative models', color: 'from-rose-500 to-pink-600', order: 5, skills: ['Prompt Engineering', 'Fine-tuning', 'RAG', 'LLM Ops'], technologies: ['LangChain', 'OpenAI', 'LlamaIndex', 'ChromaDB'], duration: '3-4 months' }
    ],
    roadmap: [
      { step: 1, title: 'Python for AI/ML', description: 'Python fundamentals with NumPy and Pandas', level: 'beginner', skills: ['Python', 'NumPy', 'Pandas', 'Data Visualization'], technologies: ['Python', 'Jupyter', 'Matplotlib'], duration: '4-6 weeks', prerequisites: [] },
      { step: 2, title: 'Mathematics for AI', description: 'Linear algebra, calculus, probability', level: 'beginner', skills: ['Linear Algebra', 'Calculus', 'Statistics', 'Probability'], technologies: ['NumPy', 'SymPy'], duration: '6-8 weeks', prerequisites: ['Python for AI/ML'] },
      { step: 3, title: 'Machine Learning Fundamentals', description: 'Supervised and unsupervised learning', level: 'intermediate', skills: ['Regression', 'Classification', 'Clustering', 'Evaluation'], technologies: ['Scikit-learn', 'Pandas', 'Matplotlib'], duration: '8-10 weeks', prerequisites: ['Mathematics for AI'] },
      { step: 4, title: 'Deep Learning Basics', description: 'Neural networks with TensorFlow/PyTorch', level: 'intermediate', skills: ['Neural Networks', 'Backpropagation', 'CNNs'], technologies: ['TensorFlow', 'PyTorch', 'Keras'], duration: '8-10 weeks', prerequisites: ['Machine Learning Fundamentals'] },
      { step: 5, title: 'Natural Language Processing', description: 'Process text and build NLP models', level: 'advanced', skills: ['Tokenization', 'Embeddings', 'Transformers', 'BERT'], technologies: ['Hugging Face', 'spaCy', 'NLTK'], duration: '6-8 weeks', prerequisites: ['Deep Learning Basics'] },
      { step: 6, title: 'Computer Vision', description: 'Image processing and object detection', level: 'advanced', skills: ['Image Processing', 'CNNs', 'Object Detection', 'Segmentation'], technologies: ['OpenCV', 'YOLO', 'PyTorch'], duration: '6-8 weeks', prerequisites: ['Deep Learning Basics'] },
      { step: 7, title: 'Generative AI & LLMs', description: 'Build with large language models', level: 'advanced', skills: ['Prompt Engineering', 'RAG', 'Fine-tuning', 'AI Agents'], technologies: ['LangChain', 'OpenAI API', 'LlamaIndex'], duration: '6-8 weeks', prerequisites: ['Natural Language Processing'] },
      { step: 8, title: 'MLOps & Deployment', description: 'Deploy and monitor AI models', level: 'advanced', skills: ['Model Deployment', 'ML Pipelines', 'Monitoring', 'A/B Testing'], technologies: ['Docker', 'AWS SageMaker', 'MLflow', 'FastAPI'], duration: '4-6 weeks', prerequisites: ['Generative AI & LLMs'] }
    ],
    careerPaths: [
      { title: 'Machine Learning Engineer', description: 'Build and deploy ML models', roles: ['ML Engineer', 'AI Engineer', 'Data Scientist'], salary: '$100K - $250K+', demand: 'very-high', growth: '35%' },
      { title: 'AI Research Scientist', description: 'Advance AI through research', roles: ['Research Scientist', 'AI Researcher', 'PhD Scientist'], salary: '$120K - $300K+', demand: 'high', growth: '30%' },
      { title: 'Prompt Engineer / LLM Specialist', description: 'Work with large language models', roles: ['Prompt Engineer', 'LLM Engineer', 'AI Specialist'], salary: '$90K - $220K+', demand: 'very-high', growth: '40%' }
    ]
  },
  {
    name: 'Cyber Security',
    icon: 'shield',
    color: 'from-red-600 to-red-800',
    bannerColor: 'bg-gradient-to-br from-red-700 via-rose-800 to-orange-900',
    description: 'Protect systems, networks, and data from cyber threats',
    longDescription: 'Cyber Security is critical for every organization. Learn to defend against attacks, perform penetration testing, and build secure systems.',
    overview: 'From security basics to advanced penetration testing and defense.',
    order: 4,
    difficulty: 'intermediate',
    totalDuration: '10-16 months',
    prerequisites: ['Basic networking knowledge', 'Linux fundamentals'],
    technologies: ['Kali Linux', 'Wireshark', 'Metasploit', 'Burp Suite', 'Nmap'],
    subFields: [
      { name: 'Ethical Hacking', icon: 'eye', description: 'Think like a hacker to defend', color: 'from-red-500 to-rose-600', order: 1, skills: ['Reconnaissance', 'Exploitation', 'Post-exploitation'], technologies: ['Kali Linux', 'Metasploit', 'Burp Suite'], duration: '4-6 months' },
      { name: 'Penetration Testing', icon: 'bolt', description: 'Systematic security testing', color: 'from-orange-500 to-amber-600', order: 2, skills: ['Vulnerability Assessment', 'Web App Testing', 'Network Testing'], technologies: ['Nmap', 'Nessus', 'OWASP ZAP'], duration: '4-6 months' },
      { name: 'SOC Analysis', icon: 'shield', description: 'Monitor and respond to threats', color: 'from-blue-500 to-indigo-600', order: 3, skills: ['Threat Detection', 'Incident Response', 'SIEM'], technologies: ['Splunk', 'ELK Stack', 'Wireshark'], duration: '3-4 months' },
      { name: 'Cloud Security', icon: 'cloud', description: 'Secure cloud infrastructure', color: 'from-sky-500 to-cyan-600', order: 4, skills: ['Cloud Architecture', 'IAM', 'Compliance'], technologies: ['AWS Security', 'Azure Security', 'Terraform'], duration: '3-4 months' }
    ],
    roadmap: [
      { step: 1, title: 'Networking Fundamentals', description: 'TCP/IP, OSI model, network protocols', level: 'beginner', skills: ['TCP/IP', 'OSI Model', 'Subnetting', 'DNS'], technologies: ['Cisco Packet Tracer', 'Wireshark'], duration: '4-6 weeks', prerequisites: [] },
      { step: 2, title: 'Linux for Security', description: 'Linux command line and security tools', level: 'beginner', skills: ['Linux CLI', 'File Permissions', 'Process Management', 'Shell Scripting'], technologies: ['Ubuntu', 'Kali Linux', 'Bash'], duration: '4-6 weeks', prerequisites: ['Networking Fundamentals'] },
      { step: 3, title: 'Security Fundamentals', description: 'CIA triad, cryptography, security models', level: 'beginner', skills: ['CIA Triad', 'Encryption', 'Hashing', 'PKI'], technologies: ['OpenSSL', 'GPG'], duration: '4-5 weeks', prerequisites: ['Linux for Security'] },
      { step: 4, title: 'Web Application Security', description: 'OWASP Top 10, web vulnerabilities', level: 'intermediate', skills: ['SQL Injection', 'XSS', 'CSRF', 'Authentication Flaws'], technologies: ['Burp Suite', 'OWASP ZAP'], duration: '6-8 weeks', prerequisites: ['Security Fundamentals'] },
      { step: 5, title: 'Network Security & Scanning', description: 'Network enumeration and vulnerability scanning', level: 'intermediate', skills: ['Port Scanning', 'Service Enumeration', 'Vulnerability Assessment'], technologies: ['Nmap', 'Nessus', 'OpenVAS'], duration: '4-6 weeks', prerequisites: ['Web Application Security'] },
      { step: 6, title: 'Exploitation & Post-Exploitation', description: 'Metasploit framework, privilege escalation', level: 'advanced', skills: ['Exploit Development', 'Privilege Escalation', 'Pivoting'], technologies: ['Metasploit', 'Impacket', 'PowerShell'], duration: '6-8 weeks', prerequisites: ['Network Security & Scanning'] },
      { step: 7, title: 'SOC & Incident Response', description: 'Threat detection, SIEM, incident handling', level: 'advanced', skills: ['SIEM', 'Threat Hunting', 'Incident Response', 'Forensics'], technologies: ['Splunk', 'ELK', 'TheHive'], duration: '6-8 weeks', prerequisites: ['Exploitation & Post-Exploitation'] },
      { step: 8, title: 'Certification Prep & Labs', description: 'Prepare for OSCP, CEH, real-world labs', level: 'advanced', skills: ['CTF', 'Bug Bounty', 'Report Writing'], technologies: ['HackTheBox', 'TryHackMe', 'PentesterLab'], duration: '8-12 weeks', prerequisites: ['SOC & Incident Response'] }
    ],
    careerPaths: [
      { title: 'Penetration Tester', description: 'Test systems for vulnerabilities', roles: ['Pentester', 'Security Consultant', 'Red Team'], salary: '$80K - $200K+', demand: 'high', growth: '30%' },
      { title: 'SOC Analyst', description: 'Monitor and defend networks', roles: ['SOC Analyst', 'Security Analyst', 'Incident Responder'], salary: '$60K - $150K+', demand: 'very-high', growth: '35%' },
      { title: 'Security Engineer', description: 'Build secure infrastructure', roles: ['Security Engineer', 'Cloud Security Engineer'], salary: '$90K - $220K+', demand: 'very-high', growth: '30%' }
    ]
  },
  {
    name: 'Data Science',
    icon: 'chart',
    color: 'from-green-500 to-emerald-700',
    bannerColor: 'bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800',
    description: 'Extract insights and knowledge from data',
    longDescription: 'Data Science combines statistics, programming, and domain expertise to uncover patterns in data. Drive decision-making with data-driven insights.',
    overview: 'From data analysis to advanced machine learning and big data.',
    order: 5,
    difficulty: 'intermediate',
    totalDuration: '10-14 months',
    prerequisites: ['Basic statistics', 'Programming fundamentals'],
    technologies: ['Python', 'R', 'SQL', 'Pandas', 'Tableau', 'Spark'],
    subFields: [
      { name: 'Data Analysis', icon: 'clipboard', description: 'Analyze and interpret data', color: 'from-blue-400 to-blue-600', order: 1, skills: ['Data Cleaning', 'EDA', 'Statistical Analysis', 'Reporting'], technologies: ['Pandas', 'NumPy', 'Excel', 'Tableau'], duration: '3-4 months' },
      { name: 'Data Visualization', icon: 'chartline', description: 'Create compelling data visuals', color: 'from-purple-400 to-violet-600', order: 2, skills: ['Charts', 'Dashboards', 'Storytelling', 'Interactive Viz'], technologies: ['Matplotlib', 'Plotly', 'Power BI', 'D3.js'], duration: '2-3 months' },
      { name: 'Big Data', icon: 'storage', description: 'Process massive datasets', color: 'from-orange-400 to-amber-600', order: 3, skills: ['Distributed Computing', 'Data Pipelines', 'ETL'], technologies: ['Spark', 'Hadoop', 'Airflow', 'Kafka'], duration: '4-5 months' },
      { name: 'Machine Learning', icon: 'robot', description: 'Build predictive models at scale', color: 'from-cyan-400 to-teal-600', order: 4, skills: ['Feature Engineering', 'Model Selection', 'Hyperparameter Tuning'], technologies: ['Scikit-learn', 'XGBoost', 'MLflow'], duration: '4-6 months' }
    ],
    roadmap: [
      { step: 1, title: 'Python for Data Science', description: 'Python with Pandas, NumPy, Matplotlib', level: 'beginner', skills: ['Python', 'Data Manipulation', 'Basic Visualization'], technologies: ['Jupyter', 'Pandas', 'NumPy'], duration: '4-6 weeks', prerequisites: [] },
      { step: 2, title: 'Statistics & Probability', description: 'Descriptive and inferential statistics', level: 'beginner', skills: ['Descriptive Stats', 'Hypothesis Testing', 'Probability Distributions'], technologies: ['SciPy', 'StatsModels'], duration: '4-6 weeks', prerequisites: ['Python for Data Science'] },
      { step: 3, title: 'Data Wrangling & SQL', description: 'Clean, transform, and query data', level: 'beginner', skills: ['Data Cleaning', 'SQL Queries', 'Joins', 'Window Functions'], technologies: ['PostgreSQL', 'Pandas', 'SQLite'], duration: '4-5 weeks', prerequisites: ['Statistics & Probability'] },
      { step: 4, title: 'Exploratory Data Analysis', description: 'Analyze patterns and insights', level: 'intermediate', skills: ['EDA', 'Feature Engineering', 'Correlation Analysis'], technologies: ['Seaborn', 'Plotly', 'Pandas'], duration: '3-4 weeks', prerequisites: ['Data Wrangling & SQL'] },
      { step: 5, title: 'Machine Learning Basics', description: 'Regression, classification, clustering', level: 'intermediate', skills: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation'], technologies: ['Scikit-learn', 'XGBoost'], duration: '8-10 weeks', prerequisites: ['Exploratory Data Analysis'] },
      { step: 6, title: 'Data Visualization & BI', description: 'Create dashboards and reports', level: 'intermediate', skills: ['Dashboard Design', 'Storytelling', 'BI Tools'], technologies: ['Tableau', 'Power BI', 'Plotly Dash'], duration: '4-5 weeks', prerequisites: ['Machine Learning Basics'] },
      { step: 7, title: 'Big Data Technologies', description: 'Process data at scale', level: 'advanced', skills: ['Spark', 'Data Pipelines', 'Cloud Data'], technologies: ['PySpark', 'AWS', 'Airflow'], duration: '6-8 weeks', prerequisites: ['Data Visualization & BI'] },
      { step: 8, title: 'MLOps & Production', description: 'Deploy ML models to production', level: 'advanced', skills: ['Model Deployment', 'A/B Testing', 'Monitoring'], technologies: ['MLflow', 'Docker', 'FastAPI', 'AWS SageMaker'], duration: '4-6 weeks', prerequisites: ['Big Data Technologies'] }
    ],
    careerPaths: [
      { title: 'Data Scientist', description: 'Extract insights from complex data', roles: ['Data Scientist', 'ML Scientist', 'AI Specialist'], salary: '$90K - $220K+', demand: 'very-high', growth: '30%' },
      { title: 'Data Analyst', description: 'Analyze data for business decisions', roles: ['Data Analyst', 'BI Analyst', 'Business Analyst'], salary: '$60K - $140K+', demand: 'very-high', growth: '25%' },
      { title: 'Data Engineer', description: 'Build data infrastructure', roles: ['Data Engineer', 'Big Data Engineer', 'Pipeline Engineer'], salary: '$90K - $200K+', demand: 'very-high', growth: '35%' }
    ]
  },
  {
    name: 'Cloud Computing',
    icon: 'cloud',
    color: 'from-sky-500 to-blue-700',
    bannerColor: 'bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800',
    description: 'Design, deploy, and manage cloud infrastructure',
    longDescription: 'Cloud Computing powers modern applications. Learn to architect, deploy, and manage infrastructure on AWS, Azure, and Google Cloud.',
    overview: 'From cloud basics to advanced DevOps and Kubernetes.',
    order: 6,
    difficulty: 'intermediate',
    totalDuration: '8-14 months',
    prerequisites: ['Basic IT knowledge', 'Linux fundamentals'],
    technologies: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform'],
    subFields: [
      { name: 'AWS Cloud', icon: 'aws', description: 'Amazon Web Services', color: 'from-orange-400 to-amber-600', order: 1, skills: ['EC2', 'S3', 'Lambda', 'RDS', 'VPC'], technologies: ['AWS CLI', 'CloudFormation', 'CDK'], duration: '4-6 months' },
      { name: 'Microsoft Azure', icon: 'azure', description: 'Microsoft cloud platform', color: 'from-blue-400 to-indigo-600', order: 2, skills: ['Azure VMs', 'Azure Functions', 'Azure SQL', 'Active Directory'], technologies: ['Azure CLI', 'ARM Templates', 'Bicep'], duration: '4-6 months' },
      { name: 'Google Cloud', icon: 'gcp', description: 'Google Cloud Platform', color: 'from-green-400 to-teal-600', order: 3, skills: ['Compute Engine', 'Cloud Storage', 'BigQuery', 'GKE'], technologies: ['gcloud CLI', 'Cloud Deployment Manager'], duration: '4-6 months' },
      { name: 'DevOps & Containerization', icon: 'docker', description: 'CI/CD, Docker, Kubernetes', color: 'from-cyan-400 to-blue-600', order: 4, skills: ['CI/CD', 'Containerization', 'Orchestration', 'IaC'], technologies: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform'], duration: '4-6 months' }
    ],
    roadmap: [
      { step: 1, title: 'Cloud Computing Fundamentals', description: 'IaaS, PaaS, SaaS, cloud deployment models', level: 'beginner', skills: ['Cloud Concepts', 'Virtualization', 'Billing & Pricing'], technologies: ['AWS Free Tier', 'Azure Portal'], duration: '3-4 weeks', prerequisites: [] },
      { step: 2, title: 'Linux & Scripting', description: 'Linux administration and shell scripting', level: 'beginner', skills: ['Linux CLI', 'Bash Scripting', 'System Administration'], technologies: ['Ubuntu', 'Bash', 'SSH'], duration: '4-6 weeks', prerequisites: ['Cloud Computing Fundamentals'] },
      { step: 3, title: 'Core Cloud Services', description: 'Compute, storage, networking', level: 'beginner', skills: ['EC2/VMs', 'S3/Blob Storage', 'VPC/VNet', 'Load Balancers'], technologies: ['AWS', 'Azure', 'GCP'], duration: '6-8 weeks', prerequisites: ['Linux & Scripting'] },
      { step: 4, title: 'Databases on Cloud', description: 'Managed database services', level: 'intermediate', skills: ['RDS', 'DynamoDB', 'Cloud SQL', 'Cosmos DB'], technologies: ['AWS RDS', 'DynamoDB', 'Azure SQL'], duration: '3-4 weeks', prerequisites: ['Core Cloud Services'] },
      { step: 5, title: 'Infrastructure as Code', description: 'Terraform, CloudFormation, automation', level: 'intermediate', skills: ['IaC', 'Configuration Management', 'Automation'], technologies: ['Terraform', 'CloudFormation', 'Ansible'], duration: '4-6 weeks', prerequisites: ['Databases on Cloud'] },
      { step: 6, title: 'Docker & Containerization', description: 'Containerize applications', level: 'intermediate', skills: ['Docker', 'Docker Compose', 'Container Registry'], technologies: ['Docker', 'Amazon ECR', 'ACR'], duration: '4-5 weeks', prerequisites: ['Infrastructure as Code'] },
      { step: 7, title: 'Kubernetes & Orchestration', description: 'Orchestrate containers at scale', level: 'advanced', skills: ['Pods', 'Services', 'Deployments', 'Helm'], technologies: ['Kubernetes', 'EKS', 'AKS', 'GKE'], duration: '6-8 weeks', prerequisites: ['Docker & Containerization'] },
      { step: 8, title: 'Cloud Security & Architecture', description: 'Secure cloud architecture patterns', level: 'advanced', skills: ['IAM', 'Security Groups', 'Encryption', 'Compliance'], technologies: ['AWS IAM', 'Azure AD', 'KMS'], duration: '4-6 weeks', prerequisites: ['Kubernetes & Orchestration'] }
    ],
    careerPaths: [
      { title: 'Cloud Architect', description: 'Design cloud infrastructure', roles: ['Cloud Architect', 'Solutions Architect', 'Infrastructure Architect'], salary: '$120K - $250K+', demand: 'very-high', growth: '25%' },
      { title: 'DevOps Engineer', description: 'CI/CD and infrastructure automation', roles: ['DevOps Engineer', 'Platform Engineer', 'SRE'], salary: '$90K - $200K+', demand: 'very-high', growth: '30%' },
      { title: 'Cloud Developer', description: 'Build cloud-native applications', roles: ['Cloud Developer', 'Serverless Developer'], salary: '$85K - $180K+', demand: 'high', growth: '25%' }
    ]
  },
  {
    name: 'Mobile App Development',
    icon: 'mobile',
    color: 'from-green-500 to-emerald-600',
    bannerColor: 'bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700',
    description: 'Build native and cross-platform mobile applications',
    longDescription: 'Mobile apps dominate the digital landscape. Learn to create apps for Android, iOS, and cross-platform frameworks like Flutter and React Native.',
    overview: 'From mobile basics to publishing apps on App Store and Play Store.',
    order: 7,
    difficulty: 'intermediate',
    totalDuration: '8-14 months',
    prerequisites: ['Programming fundamentals', 'Basic UI/UX concepts'],
    technologies: ['Kotlin', 'Swift', 'Flutter', 'React Native', 'Firebase'],
    subFields: [
      { name: 'Android Development', icon: 'robot', description: 'Native Android apps with Kotlin', color: 'from-green-400 to-emerald-600', order: 1, skills: ['Kotlin', 'Jetpack Compose', 'Android SDK', 'Material Design'], technologies: ['Android Studio', 'Kotlin', 'Firebase'], duration: '4-6 months' },
      { name: 'iOS Development', icon: 'apple', description: 'Native iOS apps with Swift', color: 'from-gray-500 to-slate-700', order: 2, skills: ['Swift', 'SwiftUI', 'UIKit', 'Core Data'], technologies: ['Xcode', 'Swift', 'CocoaPods'], duration: '4-6 months' },
      { name: 'Flutter Development', icon: 'layers', description: 'Cross-platform with Flutter', color: 'from-blue-400 to-cyan-600', order: 3, skills: ['Dart', 'Widgets', 'State Management', 'Firebase'], technologies: ['Flutter', 'Dart', 'Firebase'], duration: '3-5 months' },
      { name: 'React Native', icon: 'react', description: 'Cross-platform with React Native', color: 'from-blue-500 to-indigo-600', order: 4, skills: ['React Native', 'Expo', 'Navigation', 'Native Modules'], technologies: ['React Native', 'Expo', 'TypeScript'], duration: '3-5 months' }
    ],
    roadmap: [
      { step: 1, title: 'Mobile Development Fundamentals', description: 'Platform basics, app architecture', level: 'beginner', skills: ['Mobile UI', 'App Lifecycle', 'Platform Guidelines'], technologies: ['Android Studio', 'Xcode'], duration: '3-4 weeks', prerequisites: [] },
      { step: 2, title: 'Core Programming Language', description: 'Kotlin/Swift/Dart/JS basics', level: 'beginner', skills: ['Language Syntax', 'OOP', 'Async Programming'], technologies: ['Kotlin', 'Swift', 'Dart', 'TypeScript'], duration: '5-7 weeks', prerequisites: ['Mobile Development Fundamentals'] },
      { step: 3, title: 'UI Framework & Components', description: 'Build app interfaces', level: 'beginner', skills: ['Widgets/Components', 'Layouts', 'Navigation', 'Theming'], technologies: ['Jetpack Compose', 'SwiftUI', 'Flutter Widgets'], duration: '5-6 weeks', prerequisites: ['Core Programming Language'] },
      { step: 4, title: 'State Management & Data', description: 'Manage app state and data', level: 'intermediate', skills: ['State Management', 'Local Storage', 'API Integration'], technologies: ['Riverpod', 'Redux', 'Room', 'Core Data'], duration: '4-5 weeks', prerequisites: ['UI Framework & Components'] },
      { step: 5, title: 'Firebase & Backend Services', description: 'Authentication, database, cloud functions', level: 'intermediate', skills: ['Auth', 'Cloud DB', 'Push Notifications'], technologies: ['Firebase', 'Supabase', 'AWS Amplify'], duration: '3-4 weeks', prerequisites: ['State Management & Data'] },
      { step: 6, title: 'Testing & Debugging', description: 'Unit tests, UI tests, debugging', level: 'intermediate', skills: ['Unit Testing', 'UI Testing', 'Performance Optimization'], technologies: ['JUnit', 'XCTest', 'Flutter Test'], duration: '2-3 weeks', prerequisites: ['Firebase & Backend Services'] },
      { step: 7, title: 'App Store Deployment', description: 'Publish to App Store and Play Store', level: 'advanced', skills: ['App Signing', 'Store Listing', 'Review Process'], technologies: ['Google Play Console', 'App Store Connect'], duration: '2-3 weeks', prerequisites: ['Testing & Debugging'] },
      { step: 8, title: 'Advanced Topics & Production', description: 'Performance, CI/CD, app analytics', level: 'advanced', skills: ['Performance', 'CI/CD', 'Analytics', 'Monetization'], technologies: ['Fastlane', 'Firebase Analytics', 'AdMob'], duration: '4-5 weeks', prerequisites: ['App Store Deployment'] }
    ],
    careerPaths: [
      { title: 'Mobile App Developer', description: 'Build mobile applications', roles: ['Android Developer', 'iOS Developer', 'Mobile Engineer'], salary: '$70K - $180K+', demand: 'high', growth: '20%' },
      { title: 'Cross-Platform Developer', description: 'Build apps for both platforms', roles: ['Flutter Developer', 'React Native Developer'], salary: '$75K - $170K+', demand: 'very-high', growth: '25%' }
    ]
  },
  {
    name: 'UI/UX Design',
    icon: 'palette',
    color: 'from-pink-500 to-rose-600',
    bannerColor: 'bg-gradient-to-br from-pink-500 via-rose-600 to-purple-700',
    description: 'Design beautiful and intuitive user experiences',
    longDescription: 'UI/UX Design is about creating products that are both beautiful and functional. Learn user research, wireframing, prototyping, and visual design.',
    overview: 'From design fundamentals to advanced prototyping and design systems.',
    order: 8,
    difficulty: 'beginner',
    totalDuration: '6-10 months',
    prerequisites: ['Basic computer skills', 'Creativity and curiosity'],
    technologies: ['Figma', 'Adobe XD', 'Sketch', 'Framer', 'Miro'],
    subFields: [
      { name: 'Visual Design', icon: 'pen', description: 'Colors, typography, layout', color: 'from-pink-400 to-rose-600', order: 1, skills: ['Color Theory', 'Typography', 'Layout', 'Visual Hierarchy'], technologies: ['Figma', 'Adobe Illustrator'], duration: '2-3 months' },
      { name: 'UX Research', icon: 'search', description: 'Understand user needs', color: 'from-purple-400 to-violet-600', order: 2, skills: ['User Interviews', 'Surveys', 'Personas', 'Journey Mapping'], technologies: ['Miro', 'Notion', 'Dovetail'], duration: '2-3 months' },
      { name: 'Interaction Design', icon: 'sync', description: 'Design interactive experiences', color: 'from-blue-400 to-indigo-600', order: 3, skills: ['Wireframing', 'Prototyping', 'Micro-interactions', 'Animation'], technologies: ['Figma', 'Framer', 'Principle'], duration: '2-3 months' },
      { name: 'Design Systems', icon: 'build', description: 'Create scalable design systems', color: 'from-cyan-400 to-teal-600', order: 4, skills: ['Component Libraries', 'Design Tokens', 'Documentation'], technologies: ['Figma', 'Storybook', 'Zeroheight'], duration: '2-3 months' }
    ],
    roadmap: [
      { step: 1, title: 'Design Fundamentals', description: 'Color theory, typography, layout principles', level: 'beginner', skills: ['Color Theory', 'Typography', 'Layout', 'Composition'], technologies: ['Figma', 'Pen & Paper'], duration: '4-5 weeks', prerequisites: [] },
      { step: 2, title: 'User Research Methods', description: 'Learn to research and understand users', level: 'beginner', skills: ['User Interviews', 'Surveys', 'Competitive Analysis'], technologies: ['Miro', 'Google Forms', 'Notion'], duration: '3-4 weeks', prerequisites: ['Design Fundamentals'] },
      { step: 3, title: 'Wireframing & Prototyping', description: 'Create low and high fidelity prototypes', level: 'beginner', skills: ['Wireframing', 'Prototyping', 'Information Architecture'], technologies: ['Figma', 'Balsamiq'], duration: '4-5 weeks', prerequisites: ['User Research Methods'] },
      { step: 4, title: 'Visual Design & Branding', description: 'Create stunning visual interfaces', level: 'intermediate', skills: ['Visual Design', 'Iconography', 'Brand Guidelines'], technologies: ['Figma', 'Illustrator'], duration: '4-5 weeks', prerequisites: ['Wireframing & Prototyping'] },
      { step: 5, title: 'Interaction Design & Animation', description: 'Delightful micro-interactions', level: 'intermediate', skills: ['Micro-interactions', 'Animation', 'Motion Design'], technologies: ['Figma', 'Framer', 'After Effects'], duration: '3-4 weeks', prerequisites: ['Visual Design & Branding'] },
      { step: 6, title: 'Usability Testing', description: 'Test and iterate designs', level: 'intermediate', skills: ['Usability Testing', 'A/B Testing', 'Heatmaps'], technologies: ['UserTesting', 'Hotjar', 'Optimal Workshop'], duration: '3-4 weeks', prerequisites: ['Interaction Design & Animation'] },
      { step: 7, title: 'Design Systems', description: 'Build scalable design systems', level: 'advanced', skills: ['Component Libraries', 'Design Tokens', 'Documentation'], technologies: ['Figma', 'Storybook', 'Zeroheight'], duration: '4-5 weeks', prerequisites: ['Usability Testing'] },
      { step: 8, title: 'Portfolio & Career', description: 'Build a professional portfolio', level: 'advanced', skills: ['Portfolio Building', 'Case Studies', 'Presentation'], technologies: ['Figma', 'Webflow', 'Behance'], duration: '4-5 weeks', prerequisites: ['Design Systems'] }
    ],
    careerPaths: [
      { title: 'UI/UX Designer', description: 'Design product experiences', roles: ['UI Designer', 'UX Designer', 'Product Designer'], salary: '$65K - $180K+', demand: 'very-high', growth: '20%' },
      { title: 'UX Researcher', description: 'Research and validate designs', roles: ['UX Researcher', 'User Researcher', 'Research Lead'], salary: '$70K - $170K+', demand: 'high', growth: '15%' },
      { title: 'Design System Lead', description: 'Build and maintain design systems', roles: ['Design Systems Designer', 'Design Ops'], salary: '$90K - $190K+', demand: 'medium', growth: '20%' }
    ]
  },
  {
    name: 'Game Development',
    icon: 'gamepad',
    color: 'from-purple-500 to-indigo-700',
    bannerColor: 'bg-gradient-to-br from-purple-600 via-violet-700 to-indigo-800',
    description: 'Create immersive gaming experiences',
    longDescription: 'Game Development combines programming, art, and design. Learn to create games using Unity, Unreal Engine, and modern game development practices.',
    overview: 'From game design basics to building and publishing games.',
    order: 9,
    difficulty: 'advanced',
    totalDuration: '10-16 months',
    prerequisites: ['Programming fundamentals', 'Basic math (vectors, matrices)'],
    technologies: ['Unity', 'Unreal Engine', 'C#', 'C++', 'Blender'],
    subFields: [
      { name: 'Unity Development', icon: 'bolt', description: '2D and 3D games with Unity', color: 'from-gray-500 to-slate-700', order: 1, skills: ['C# Scripting', 'Physics', 'Animation', 'UI Systems'], technologies: ['Unity', 'C#', 'PlayMaker'], duration: '4-6 months' },
      { name: 'Unreal Engine', icon: 'java', description: 'High-quality games with Unreal', color: 'from-cyan-400 to-blue-600', order: 2, skills: ['Blueprints', 'C++', 'Materials', 'Lighting'], technologies: ['Unreal Engine 5', 'C++', 'Blueprints'], duration: '4-6 months' },
      { name: '2D Game Development', icon: 'cube', description: 'Create 2D platformers and more', color: 'from-green-400 to-emerald-600', order: 3, skills: ['Sprites', 'Tilemaps', '2D Physics', 'Parallax'], technologies: ['Unity 2D', 'Godot', 'Aseprite'], duration: '3-4 months' },
      { name: '3D Game Development', icon: 'cube', description: 'Build 3D worlds and characters', color: 'from-indigo-400 to-purple-600', order: 4, skills: ['3D Modeling', 'Texturing', 'Lighting', 'Shaders'], technologies: ['Blender', 'Unity 3D', 'Unreal Engine'], duration: '4-6 months' }
    ],
    roadmap: [
      { step: 1, title: 'Game Design Fundamentals', description: 'Game mechanics, loops, player experience', level: 'beginner', skills: ['Game Design', 'Level Design', 'Game Loops'], technologies: ['Pen & Paper', 'Unity'], duration: '3-4 weeks', prerequisites: [] },
      { step: 2, title: 'Programming for Games', description: 'C# or C++ for game development', level: 'beginner', skills: ['C#/C++', 'OOP', 'Game Math'], technologies: ['Visual Studio', 'C#', 'Unity'], duration: '6-8 weeks', prerequisites: ['Game Design Fundamentals'] },
      { step: 3, title: '2D Game Development', description: 'Build your first 2D game', level: 'beginner', skills: ['Sprites', 'Tilemaps', '2D Physics', 'Input Handling'], technologies: ['Unity 2D', 'Aseprite'], duration: '6-8 weeks', prerequisites: ['Programming for Games'] },
      { step: 4, title: '3D Game Development', description: 'Create 3D environments and characters', level: 'intermediate', skills: ['3D Modeling', 'Materials', 'Lighting', 'Animation'], technologies: ['Blender', 'Unity 3D'], duration: '8-10 weeks', prerequisites: ['2D Game Development'] },
      { step: 5, title: 'Audio & Visual Effects', description: 'Sound design, particle effects, shaders', level: 'intermediate', skills: ['Sound Design', 'Particle Systems', 'Shader Graph'], technologies: ['FMOD', 'Shader Graph', 'Audacity'], duration: '4-5 weeks', prerequisites: ['3D Game Development'] },
      { step: 6, title: 'AI & Gameplay Systems', description: 'NPC behavior, pathfinding, game logic', level: 'advanced', skills: ['AI Behavior', 'Pathfinding', 'State Machines'], technologies: ['Unity ML-Agents', 'NavMesh'], duration: '5-6 weeks', prerequisites: ['Audio & Visual Effects'] },
      { step: 7, title: 'Multiplayer & Networking', description: 'Online multiplayer game development', level: 'advanced', skills: ['Networking', 'Multiplayer Architecture', 'Matchmaking'], technologies: ['Photon', 'Mirror', 'Steamworks'], duration: '5-6 weeks', prerequisites: ['AI & Gameplay Systems'] },
      { step: 8, title: 'Publishing & Monetization', description: 'Release your game to the world', level: 'advanced', skills: ['Platform Publishing', 'Monetization', 'Marketing'], technologies: ['Steam', 'App Store', 'Itch.io'], duration: '4-5 weeks', prerequisites: ['Multiplayer & Networking'] }
    ],
    careerPaths: [
      { title: 'Game Developer', description: 'Build and ship games', roles: ['Game Developer', 'Gameplay Programmer', 'Tools Developer'], salary: '$60K - $160K+', demand: 'medium', growth: '15%' },
      { title: 'Unity/Unreal Developer', description: 'Specialize in game engines', roles: ['Unity Developer', 'Unreal Developer', 'Graphics Engineer'], salary: '$70K - $180K+', demand: 'high', growth: '20%' },
      { title: 'Technical Artist', description: 'Bridge art and programming', roles: ['Technical Artist', 'VFX Artist', 'Shader Artist'], salary: '$65K - $150K+', demand: 'medium', growth: '15%' }
    ]
  },
  {
    name: 'Blockchain Development',
    icon: 'link',
    color: 'from-yellow-500 to-orange-600',
    bannerColor: 'bg-gradient-to-br from-yellow-500 via-orange-600 to-red-700',
    description: 'Build decentralized applications and smart contracts',
    longDescription: 'Blockchain technology powers Web3, DeFi, and NFTs. Learn to develop smart contracts, dApps, and decentralized protocols.',
    overview: 'From blockchain basics to advanced smart contract development.',
    order: 10,
    difficulty: 'advanced',
    totalDuration: '8-14 months',
    prerequisites: ['Programming fundamentals', 'Basic cryptography concepts'],
    technologies: ['Solidity', 'Ethereum', 'Hardhat', 'Web3.js', 'IPFS'],
    subFields: [
      { name: 'Smart Contracts', icon: 'clipboard', description: 'Write secure smart contracts', color: 'from-yellow-400 to-amber-600', order: 1, skills: ['Solidity', 'Smart Contract Security', 'Gas Optimization'], technologies: ['Solidity', 'Hardhat', 'OpenZeppelin'], duration: '3-4 months' },
      { name: 'Web3 Development', icon: 'globe', description: 'Build dApp frontends', color: 'from-purple-400 to-violet-600', order: 2, skills: ['Web3.js', 'Ethers.js', 'Wallet Integration', 'IPFS'], technologies: ['React', 'Web3.js', 'Ethers.js', 'IPFS'], duration: '3-4 months' },
      { name: 'DeFi Development', icon: 'lock', description: 'Build DeFi protocols', color: 'from-green-400 to-emerald-600', order: 3, skills: ['DeFi Primitives', 'AMMs', 'Lending Protocols', 'Yield Farming'], technologies: ['Solidity', 'Hardhat', 'Uniswap V3'], duration: '4-5 months' },
      { name: 'NFT & Gaming', icon: 'layers', description: 'NFTs and blockchain gaming', color: 'from-pink-400 to-rose-600', order: 4, skills: ['ERC-721', 'ERC-1155', 'Marketplace', 'Gaming'], technologies: ['Solidity', 'IPFS', 'Polygon'], duration: '3-4 months' }
    ],
    roadmap: [
      { step: 1, title: 'Blockchain Fundamentals', description: 'Distributed ledger, consensus, crypto', level: 'beginner', skills: ['Blockchain Concepts', 'Cryptography', 'Consensus Mechanisms'], technologies: ['Bitcoin', 'Ethereum'], duration: '4-5 weeks', prerequisites: [] },
      { step: 2, title: 'Ethereum & EVM', description: 'Ethereum Virtual Machine, gas, accounts', level: 'beginner', skills: ['EVM', 'Gas', 'Transactions', 'Accounts'], technologies: ['Ethereum', 'MetaMask', 'Remix'], duration: '3-4 weeks', prerequisites: ['Blockchain Fundamentals'] },
      { step: 3, title: 'Solidity Programming', description: 'Write smart contracts in Solidity', level: 'beginner', skills: ['Solidity Syntax', 'Data Types', 'Functions', 'Events'], technologies: ['Solidity', 'Remix', 'Hardhat'], duration: '6-8 weeks', prerequisites: ['Ethereum & EVM'] },
      { step: 4, title: 'Smart Contract Security', description: 'Secure contract development', level: 'intermediate', skills: ['Reentrancy', 'Access Control', 'Integer Overflow', 'Auditing'], technologies: ['OpenZeppelin', 'Slither', 'Echidna'], duration: '4-5 weeks', prerequisites: ['Solidity Programming'] },
      { step: 5, title: 'Web3 Frontend Development', description: 'Connect dApps to blockchain', level: 'intermediate', skills: ['Web3.js', 'Ethers.js', 'WalletConnect', 'Signing'], technologies: ['React', 'Ethers.js', 'RainbowKit'], duration: '4-5 weeks', prerequisites: ['Smart Contract Security'] },
      { step: 6, title: 'DeFi Development', description: 'Build DeFi applications', level: 'advanced', skills: ['AMMs', 'Lending', 'Staking', 'Oracles'], technologies: ['Uniswap', 'Chainlink', 'Aave'], duration: '6-8 weeks', prerequisites: ['Web3 Frontend Development'] },
      { step: 7, title: 'NFT & Token Standards', description: 'ERC-20, ERC-721, ERC-1155', level: 'advanced', skills: ['Token Standards', 'NFT Minting', 'Marketplaces'], technologies: ['OpenZeppelin', 'IPFS', 'Pinata'], duration: '4-5 weeks', prerequisites: ['DeFi Development'] },
      { step: 8, title: 'Testing & Deployment', description: 'Test, audit, and deploy contracts', level: 'advanced', skills: ['Unit Testing', 'Integration Testing', 'Mainnet Deployment'], technologies: ['Hardhat', 'Foundry', 'Etherscan'], duration: '4-5 weeks', prerequisites: ['NFT & Token Standards'] }
    ],
    careerPaths: [
      { title: 'Blockchain Developer', description: 'Build decentralized applications', roles: ['Solidity Developer', 'Smart Contract Developer', 'Blockchain Engineer'], salary: '$80K - $220K+', demand: 'high', growth: '30%' },
      { title: 'Web3 Developer', description: 'Build Web3 frontends and dApps', roles: ['Web3 Developer', 'dApp Developer'], salary: '$75K - $200K+', demand: 'high', growth: '25%' },
      { title: 'DeFi Specialist', description: 'Build DeFi protocols and tools', roles: ['DeFi Developer', 'Protocol Engineer'], salary: '$100K - $250K+', demand: 'medium', growth: '20%' }
    ]
  },
  {
    name: 'DevOps Engineering',
    icon: 'sync',
    color: 'from-cyan-500 to-blue-700',
    bannerColor: 'bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800',
    description: 'Automate infrastructure and streamline deployment',
    longDescription: 'DevOps bridges development and operations. Master CI/CD, containerization, infrastructure as code, and monitoring to deliver software faster and reliably.',
    overview: 'From DevOps fundamentals to advanced platform engineering.',
    order: 11,
    difficulty: 'intermediate',
    totalDuration: '8-12 months',
    prerequisites: ['Linux basics', 'Programming fundamentals'],
    technologies: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Ansible', 'GitHub Actions'],
    subFields: [
      { name: 'CI/CD Pipelines', icon: 'sync', description: 'Automate build and deployment', color: 'from-blue-400 to-indigo-600', order: 1, skills: ['Pipeline Design', 'Automation', 'Artifact Management'], technologies: ['Jenkins', 'GitHub Actions', 'GitLab CI'], duration: '3-4 months' },
      { name: 'Container Orchestration', icon: 'docker', description: 'Docker and Kubernetes', color: 'from-sky-400 to-cyan-600', order: 2, skills: ['Docker', 'K8s', 'Service Mesh', 'Helm'], technologies: ['Docker', 'Kubernetes', 'Istio'], duration: '4-5 months' },
      { name: 'Infrastructure as Code', icon: 'clipboard', description: 'Manage infra with code', color: 'from-green-400 to-emerald-600', order: 3, skills: ['Terraform', 'CloudFormation', 'Config Management'], technologies: ['Terraform', 'Ansible', 'Pulumi'], duration: '3-4 months' },
      { name: 'Monitoring & Observability', icon: 'chart', description: 'Monitor systems and apps', color: 'from-orange-400 to-amber-600', order: 4, skills: ['Metrics', 'Logging', 'Tracing', 'Alerting'], technologies: ['Prometheus', 'Grafana', 'ELK Stack'], duration: '3-4 months' }
    ],
    roadmap: [
      { step: 1, title: 'DevOps Culture & Fundamentals', description: 'DevOps principles, Agile, methodologies', level: 'beginner', skills: ['DevOps Culture', 'Agile', 'Version Control'], technologies: ['Git', 'GitHub', 'Jira'], duration: '3-4 weeks', prerequisites: [] },
      { step: 2, title: 'Linux Administration', description: 'Linux systems, scripting, networking', level: 'beginner', skills: ['Linux CLI', 'Shell Scripting', 'Systemd', 'Permissions'], technologies: ['Ubuntu', 'Bash', 'awk/sed'], duration: '5-6 weeks', prerequisites: ['DevOps Culture & Fundamentals'] },
      { step: 3, title: 'Version Control & Collaboration', description: 'Git branching, code review, collaboration', level: 'beginner', skills: ['Git Branching', 'Code Review', 'Git Flow'], technologies: ['Git', 'GitHub', 'GitLab'], duration: '3-4 weeks', prerequisites: ['Linux Administration'] },
      { step: 4, title: 'CI/CD Pipelines', description: 'Automate testing and deployment', level: 'intermediate', skills: ['Pipeline as Code', 'Automated Testing', 'Deployment Strategies'], technologies: ['Jenkins', 'GitHub Actions', 'GitLab CI'], duration: '5-6 weeks', prerequisites: ['Version Control & Collaboration'] },
      { step: 5, title: 'Docker & Containerization', description: 'Containerize applications', level: 'intermediate', skills: ['Dockerfile', 'Compose', 'Registry', 'Networking'], technologies: ['Docker', 'Docker Compose', 'Harbor'], duration: '4-5 weeks', prerequisites: ['CI/CD Pipelines'] },
      { step: 6, title: 'Kubernetes Orchestration', description: 'Orchestrate containers at scale', level: 'advanced', skills: ['Pods', 'Services', 'Deployments', 'Helm Charts'], technologies: ['Kubernetes', 'kubectl', 'Helm'], duration: '7-8 weeks', prerequisites: ['Docker & Containerization'] },
      { step: 7, title: 'Infrastructure as Code', description: 'Terraform, Ansible, Cloud automation', level: 'advanced', skills: ['IaC', 'Config Management', 'Secret Management'], technologies: ['Terraform', 'Ansible', 'Vault'], duration: '5-6 weeks', prerequisites: ['Kubernetes Orchestration'] },
      { step: 8, title: 'Monitoring & Observability', description: 'Comprehensive system monitoring', level: 'advanced', skills: ['Metrics', 'Logging', 'Tracing', 'Alerting'], technologies: ['Prometheus', 'Grafana', 'ELK', 'Datadog'], duration: '4-5 weeks', prerequisites: ['Infrastructure as Code'] }
    ],
    careerPaths: [
      { title: 'DevOps Engineer', description: 'Build and maintain CI/CD infrastructure', roles: ['DevOps Engineer', 'Build Engineer', 'Release Engineer'], salary: '$90K - $200K+', demand: 'very-high', growth: '30%' },
      { title: 'Platform Engineer', description: 'Build internal developer platforms', roles: ['Platform Engineer', 'Cloud Engineer', 'SRE'], salary: '$100K - $220K+', demand: 'very-high', growth: '35%' },
      { title: 'Site Reliability Engineer', description: 'Ensure system reliability and uptime', roles: ['SRE', 'Reliability Engineer', 'Production Engineer'], salary: '$110K - $250K+', demand: 'high', growth: '25%' }
    ]
  },
  {
    name: 'Software Engineering',
    icon: 'build',
    color: 'from-indigo-500 to-purple-700',
    bannerColor: 'bg-gradient-to-br from-indigo-600 via-purple-700 to-violet-800',
    description: 'Master professional software development practices',
    longDescription: 'Software Engineering is about building reliable, maintainable, and scalable software. Master the entire software development lifecycle, from requirements to deployment.',
    overview: 'From coding basics to software architecture and team leadership.',
    order: 12,
    difficulty: 'all-levels',
    totalDuration: '8-14 months',
    prerequisites: ['Programming basics', 'Problem-solving skills'],
    technologies: ['Git', 'Docker', 'Jira', 'Postman', 'VS Code', 'AWS'],
    subFields: [
      { name: 'Software Design Patterns', icon: 'project', description: 'Reusable solutions to common problems', color: 'from-blue-400 to-indigo-600', order: 1, skills: ['Creational', 'Structural', 'Behavioral', 'Anti-patterns'], technologies: ['UML', 'Draw.io'], duration: '3-4 months' },
      { name: 'Software Architecture', icon: 'project', description: 'Design software structure', color: 'from-purple-400 to-violet-600', order: 2, skills: ['Microservices', 'Event-driven', 'Layered Architecture', 'DDD'], technologies: ['Docker', 'Kafka', 'gRPC'], duration: '4-5 months' },
      { name: 'Testing & QA', icon: 'science', description: 'Ensure software quality', color: 'from-green-400 to-emerald-600', order: 3, skills: ['Unit Testing', 'Integration Testing', 'E2E Testing', 'TDD'], technologies: ['Jest', 'Cypress', 'Selenium'], duration: '2-3 months' },
      { name: 'Agile & Project Management', icon: 'clipboard', description: 'Manage software projects', color: 'from-amber-400 to-orange-600', order: 4, skills: ['Scrum', 'Kanban', 'Estimation', 'Retrospectives'], technologies: ['Jira', 'Notion', 'Confluence'], duration: '2-3 months' }
    ],
    roadmap: [
      { step: 1, title: 'Software Development Lifecycle', description: 'Requirements, design, implementation, testing', level: 'beginner', skills: ['SDLC Phases', 'Requirements Analysis', 'Documentation'], technologies: ['Jira', 'Confluence'], duration: '3-4 weeks', prerequisites: [] },
      { step: 2, title: 'Version Control & Collaboration', description: 'Git workflows, code review, team collaboration', level: 'beginner', skills: ['Git', 'Pull Requests', 'Code Review', 'Git Flow'], technologies: ['Git', 'GitHub', 'GitLab'], duration: '3-4 weeks', prerequisites: ['Software Development Lifecycle'] },
      { step: 3, title: 'Object-Oriented Design', description: 'SOLID principles, design patterns', level: 'beginner', skills: ['SOLID', 'UML', 'Design Patterns'], technologies: ['Java', 'Python', 'Draw.io'], duration: '5-6 weeks', prerequisites: ['Version Control & Collaboration'] },
      { step: 4, title: 'Database Design & Management', description: 'Schema design, ORM, migrations', level: 'intermediate', skills: ['Schema Design', 'ORM', 'Migrations', 'Query Optimization'], technologies: ['PostgreSQL', 'Prisma', 'TypeORM'], duration: '4-5 weeks', prerequisites: ['Object-Oriented Design'] },
      { step: 5, title: 'API Design & Development', description: 'REST, GraphQL, API best practices', level: 'intermediate', skills: ['REST API', 'GraphQL', 'API Versioning', 'Documentation'], technologies: ['Postman', 'Swagger', 'Express'], duration: '4-5 weeks', prerequisites: ['Database Design & Management'] },
      { step: 6, title: 'Software Testing', description: 'Unit, integration, E2E testing', level: 'intermediate', skills: ['TDD', 'Unit Testing', 'Mocking', 'CI Testing'], technologies: ['Jest', 'Mocha', 'Cypress'], duration: '4-5 weeks', prerequisites: ['API Design & Development'] },
      { step: 7, title: 'Software Architecture Patterns', description: 'Microservices, event-driven, clean architecture', level: 'advanced', skills: ['Architecture Patterns', 'DDD', 'CQRS', 'Event Sourcing'], technologies: ['Docker', 'Kafka', 'gRPC'], duration: '7-8 weeks', prerequisites: ['Software Testing'] },
      { step: 8, title: 'Team Leadership & Agile', description: 'Lead teams, agile practices, delivery', level: 'advanced', skills: ['Scrum Master', 'Technical Leadership', 'Estimation', 'Mentoring'], technologies: ['Jira', 'Miro', 'Retro tools'], duration: '4-5 weeks', prerequisites: ['Software Architecture Patterns'] }
    ],
    careerPaths: [
      { title: 'Software Engineer', description: 'Build and maintain software systems', roles: ['Junior Engineer', 'Software Engineer', 'Senior Engineer', 'Staff Engineer'], salary: '$70K - $250K+', demand: 'very-high', growth: '20%' },
      { title: 'Software Architect', description: 'Design software architecture', roles: ['Software Architect', 'Technical Architect', 'Principal Engineer'], salary: '$120K - $300K+', demand: 'high', growth: '15%' },
      { title: 'Engineering Manager', description: 'Lead engineering teams', roles: ['Engineering Manager', 'Tech Lead', 'VP Engineering'], salary: '$130K - $350K+', demand: 'high', growth: '15%' }
    ]
  },
  {
    name: 'Networking',
    icon: 'network',
    color: 'from-teal-500 to-cyan-700',
    bannerColor: 'bg-gradient-to-br from-teal-600 via-cyan-700 to-blue-800',
    description: 'Design, configure, and manage computer networks',
    longDescription: 'Networking is the backbone of IT. Learn to design, implement, and troubleshoot networks of all sizes, from small offices to global infrastructures.',
    overview: 'From network basics to advanced routing and security.',
    order: 13,
    difficulty: 'intermediate',
    totalDuration: '8-12 months',
    prerequisites: ['Basic computer knowledge', 'Logical thinking'],
    technologies: ['Cisco IOS', 'Wireshark', 'GNS3', 'Packet Tracer', 'Linux'],
    subFields: [
      { name: 'Network Fundamentals', icon: 'bolt', description: 'Core networking concepts', color: 'from-blue-400 to-indigo-600', order: 1, skills: ['OSI Model', 'TCP/IP', 'Subnetting', 'Ethernet'], technologies: ['Cisco Packet Tracer', 'Wireshark'], duration: '2-3 months' },
      { name: 'Routing & Switching', icon: 'syncalt', description: 'Configure routers and switches', color: 'from-green-400 to-emerald-600', order: 2, skills: ['Routing Protocols', 'VLANs', 'STP', 'EtherChannel'], technologies: ['Cisco IOS', 'GNS3', 'Cisco Hardware'], duration: '3-4 months' },
      { name: 'Network Security', icon: 'shield', description: 'Secure network infrastructure', color: 'from-red-400 to-rose-600', order: 3, skills: ['Firewalls', 'VPNs', 'ACLs', 'NAT'], technologies: ['Cisco ASA', 'pfSense', 'IPSec'], duration: '3-4 months' },
      { name: 'Wireless & SDN', icon: 'network', description: 'Wireless networks and SDN', color: 'from-purple-400 to-violet-600', order: 4, skills: ['Wireless Standards', 'SDN', 'Network Automation'], technologies: ['Cisco Wireless', 'OpenFlow', 'Ansible'], duration: '2-3 months' }
    ],
    roadmap: [
      { step: 1, title: 'Networking Fundamentals', description: 'OSI model, TCP/IP, network topologies', level: 'beginner', skills: ['OSI Model', 'TCP/IP Stack', 'Network Topologies', 'Cabling'], technologies: ['Cisco Packet Tracer'], duration: '4-5 weeks', prerequisites: [] },
      { step: 2, title: 'IP Addressing & Subnetting', description: 'IPv4, IPv6, subnetting, VLSM', level: 'beginner', skills: ['IPv4', 'IPv6', 'Subnetting', 'VLSM', 'CIDR'], technologies: ['Packet Tracer', 'Wireshark'], duration: '4-5 weeks', prerequisites: ['Networking Fundamentals'] },
      { step: 3, title: 'Ethernet & Switching', description: 'Switches, VLANs, STP, trunking', level: 'beginner', skills: ['Ethernet', 'VLAN', 'STP', 'Trunking', 'Port Security'], technologies: ['Cisco IOS', 'Packet Tracer'], duration: '5-6 weeks', prerequisites: ['IP Addressing & Subnetting'] },
      { step: 4, title: 'Routing Protocols', description: 'Static, RIP, OSPF, EIGRP, BGP', level: 'intermediate', skills: ['Static Routing', 'OSPF', 'EIGRP', 'BGP', 'Route Redistribution'], technologies: ['Cisco IOS', 'GNS3', 'EVE-NG'], duration: '7-8 weeks', prerequisites: ['Ethernet & Switching'] },
      { step: 5, title: 'WAN Technologies', description: 'MPLS, VPN, leased lines, SD-WAN', level: 'intermediate', skills: ['MPLS', 'VPN', 'SD-WAN', 'PPP', 'Frame Relay'], technologies: ['Cisco IOS', 'GNS3'], duration: '4-5 weeks', prerequisites: ['Routing Protocols'] },
      { step: 6, title: 'Network Security', description: 'Firewalls, ACLs, VPNs, IPSec', level: 'intermediate', skills: ['ACLs', 'Firewalls', 'NAT/PAT', 'VPN', 'IPSec'], technologies: ['Cisco ASA', 'pfSense', 'Wireshark'], duration: '5-6 weeks', prerequisites: ['WAN Technologies'] },
      { step: 7, title: 'Wireless Networks', description: 'WLAN standards, controllers, security', level: 'advanced', skills: ['Wi-Fi Standards', 'WLC', 'Roaming', 'Wireless Security'], technologies: ['Cisco Wireless', 'Ekahau'], duration: '3-4 weeks', prerequisites: ['Network Security'] },
      { step: 8, title: 'Network Automation & SDN', description: 'Automate network configuration', level: 'advanced', skills: ['Network Automation', 'SDN', 'Python Scripting', 'REST APIs'], technologies: ['Ansible', 'Python', 'Postman', 'OpenFlow'], duration: '4-5 weeks', prerequisites: ['Wireless Networks'] }
    ],
    careerPaths: [
      { title: 'Network Engineer', description: 'Design and manage networks', roles: ['Network Engineer', 'Network Admin', 'Network Architect'], salary: '$65K - $170K+', demand: 'high', growth: '15%' },
      { title: 'Security Engineer', description: 'Secure network infrastructure', roles: ['Network Security Engineer', 'Firewall Engineer'], salary: '$80K - $190K+', demand: 'very-high', growth: '25%' },
      { title: 'Network Architect', description: 'Design enterprise networks', roles: ['Network Architect', 'Infrastructure Architect'], salary: '$110K - $220K+', demand: 'high', growth: '15%' }
    ]
  }
];

module.exports = fields;
