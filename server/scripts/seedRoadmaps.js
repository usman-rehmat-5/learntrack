const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Field = require('../models/Field');
const Track = require('../models/Track');
const fieldSeedData = require('../seed/fieldSeedData');

const fieldTracks = {
  'Computer Science': [
    { name: 'Programming Fundamentals', icon: 'python', color: 'from-green-400 to-emerald-600', description: 'Core programming concepts with Python', duration: '2-3 months', difficulty: 'beginner', order: 1, roadmap: [
      { step: 1, title: 'Introduction to Python', description: 'Variables, data types, basic I/O', level: 'beginner', skills: ['Python Syntax', 'Variables', 'Data Types'], technologies: ['Python 3'], duration: '1-2 weeks', icon: 'python' },
      { step: 2, title: 'Control Flow & Functions', description: 'Loops, conditionals, functions', level: 'beginner', skills: ['Loops', 'If/Else', 'Functions', 'Scope'], technologies: ['Python'], duration: '2 weeks', icon: 'sync' },
      { step: 3, title: 'Data Structures in Python', description: 'Lists, tuples, dicts, sets', level: 'beginner', skills: ['Lists', 'Dictionaries', 'Tuples', 'Sets'], technologies: ['Python'], duration: '2 weeks', icon: 'chart' },
      { step: 4, title: 'File I/O & Modules', description: 'File handling, modules, packages', level: 'beginner', skills: ['File Handling', 'Modules', 'Packages'], technologies: ['Python', 'pip'], duration: '1-2 weeks', icon: 'folder' }
    ] },
    { name: 'Data Structures & Algorithms', icon: 'chartline', color: 'from-purple-400 to-violet-600', description: 'Essential algorithms and data structures', duration: '4-6 months', difficulty: 'intermediate', order: 2, roadmap: [
      { step: 1, title: 'Arrays & Strings', description: 'Array manipulation, string algorithms', level: 'beginner', skills: ['Arrays', 'Strings', 'Two Pointers'], technologies: ['Python', 'Java'], duration: '2-3 weeks', icon: 'clipboard' },
      { step: 2, title: 'Linked Lists & Stacks', description: 'Linked lists, stacks, queues', level: 'beginner', skills: ['Linked Lists', 'Stacks', 'Queues'], technologies: ['Python'], duration: '2-3 weeks', icon: 'linkicon' },
      { step: 3, title: 'Trees & Graphs', description: 'Binary trees, BSTs, graph algorithms', level: 'intermediate', skills: ['Trees', 'BST', 'DFS', 'BFS'], technologies: ['Python'], duration: '3-4 weeks', icon: 'layers' },
      { step: 4, title: 'Sorting & Searching', description: 'Sorting algorithms, binary search', level: 'intermediate', skills: ['Sorting', 'Binary Search', 'Complexity Analysis'], technologies: ['Python'], duration: '2-3 weeks', icon: 'search' },
      { step: 5, title: 'Dynamic Programming', description: 'DP patterns, memoization, tabulation', level: 'advanced', skills: ['DP', 'Memoization', 'Tabulation', 'Greedy'], technologies: ['Python'], duration: '4-5 weeks', icon: 'layers' }
    ] },
    { name: 'System Design', icon: 'project', color: 'from-red-400 to-rose-600', description: 'Design scalable software systems', duration: '3-4 months', difficulty: 'advanced', order: 3, roadmap: [
      { step: 1, title: 'Design Fundamentals', description: 'CAP theorem, load balancing, caching', level: 'intermediate', skills: ['CAP Theorem', 'Load Balancing', 'Caching'], technologies: ['Redis', 'Nginx'], duration: '2-3 weeks', icon: 'ruler' },
      { step: 2, title: 'Database Design', description: 'SQL vs NoSQL, sharding, replication', level: 'intermediate', skills: ['Sharding', 'Replication', 'Indexing'], technologies: ['PostgreSQL', 'MongoDB'], duration: '2-3 weeks', icon: 'database' },
      { step: 3, title: 'Microservices Architecture', description: 'Service decomposition, communication', level: 'advanced', skills: ['Microservices', 'API Gateway', 'Service Discovery'], technologies: ['Docker', 'Kubernetes'], duration: '3-4 weeks', icon: 'cogs' },
      { step: 4, title: 'System Design Problems', description: 'Design YouTube, Twitter, Uber etc', level: 'advanced', skills: ['High-level Design', 'Low-level Design', 'Trade-offs'], technologies: ['Draw.io', 'Excalidraw'], duration: '4-5 weeks', icon: 'bolt' }
    ] }
  ],
  'Web Development': [
    { name: 'Frontend Development', icon: 'palette', color: 'from-pink-400 to-rose-600', description: 'Modern frontend with React', duration: '4-6 months', difficulty: 'beginner', order: 1, roadmap: [
      { step: 1, title: 'HTML5 & CSS3', description: 'Semantic HTML, modern CSS', level: 'beginner', skills: ['HTML5', 'CSS3', 'Flexbox', 'Grid'], technologies: ['VS Code'], duration: '3-4 weeks', icon: 'globe' },
      { step: 2, title: 'JavaScript Fundamentals', description: 'ES6+, DOM, events', level: 'beginner', skills: ['JavaScript', 'DOM', 'Events', 'ES6+'], technologies: ['Chrome DevTools'], duration: '5-6 weeks', icon: 'clipboard' },
      { step: 3, title: 'React.js', description: 'Components, hooks, state management', level: 'intermediate', skills: ['React', 'Hooks', 'State', 'Routing'], technologies: ['React', 'React Router'], duration: '6-7 weeks', icon: 'react' },
      { step: 4, title: 'Advanced Frontend', description: 'Next.js, TypeScript, testing', level: 'advanced', skills: ['Next.js', 'TypeScript', 'Testing'], technologies: ['Next.js', 'Jest', 'Cypress'], duration: '4-5 weeks', icon: 'bolt' }
    ] },
    { name: 'Backend Development', icon: 'cogs', color: 'from-gray-600 to-slate-800', description: 'Server-side with Node.js', duration: '4-6 months', difficulty: 'intermediate', order: 2, roadmap: [
      { step: 1, title: 'Node.js Basics', description: 'Event loop, modules, npm', level: 'beginner', skills: ['Node.js', 'npm', 'Modules'], technologies: ['Node.js'], duration: '3-4 weeks', icon: 'node' },
      { step: 2, title: 'Express.js Framework', description: 'Routing, middleware, REST APIs', level: 'intermediate', skills: ['Express', 'Middleware', 'REST'], technologies: ['Express.js'], duration: '4-5 weeks', icon: 'bolt' },
      { step: 3, title: 'Database Integration', description: 'MongoDB, Mongoose, ORMs', level: 'intermediate', skills: ['MongoDB', 'Mongoose', 'SQL'], technologies: ['MongoDB', 'PostgreSQL'], duration: '4-5 weeks', icon: 'database' },
      { step: 4, title: 'Authentication & Security', description: 'JWT, OAuth, security best practices', level: 'advanced', skills: ['JWT', 'OAuth', 'Security'], technologies: ['Passport', 'bcrypt'], duration: '3-4 weeks', icon: 'lock' }
    ] },
    { name: 'Full Stack MERN', icon: 'react', color: 'from-green-400 to-emerald-600', description: 'Complete MERN stack', duration: '5-7 months', difficulty: 'intermediate', order: 3, roadmap: [
      { step: 1, title: 'MongoDB & Express Setup', description: 'Database design, Express API', level: 'beginner', skills: ['MongoDB', 'Express API'], technologies: ['MongoDB Atlas'], duration: '3-4 weeks', icon: 'database' },
      { step: 2, title: 'React Frontend', description: 'React components with API integration', level: 'intermediate', skills: ['React', 'API Integration'], technologies: ['React', 'Axios'], duration: '4-5 weeks', icon: 'react' },
      { step: 3, title: 'Node.js Backend', description: 'Complete backend with auth', level: 'intermediate', skills: ['Node.js', 'Auth', 'CRUD'], technologies: ['Node.js', 'JWT'], duration: '4-5 weeks', icon: 'node' },
      { step: 4, title: 'Full Stack Project', description: 'Build complete MERN application', level: 'advanced', skills: ['Full Stack', 'Deployment'], technologies: ['Vercel', 'Railway'], duration: '5-6 weeks', icon: 'bolt' }
    ] }
  ],
  'Artificial Intelligence': [
    { name: 'Machine Learning', icon: 'chartline', color: 'from-blue-500 to-indigo-600', description: 'Classic ML algorithms', duration: '4-6 months', difficulty: 'intermediate', order: 1, roadmap: [
      { step: 1, title: 'ML Fundamentals', description: 'Supervised, unsupervised learning', level: 'beginner', skills: ['ML Concepts', 'Train/Test Split', 'Evaluation'], technologies: ['Scikit-learn'], duration: '3-4 weeks', icon: 'chart' },
      { step: 2, title: 'Regression Models', description: 'Linear, polynomial, logistic regression', level: 'beginner', skills: ['Linear Regression', 'Logistic Regression'], technologies: ['Scikit-learn', 'Pandas'], duration: '3-4 weeks', icon: 'chartline' },
      { step: 3, title: 'Classification & Clustering', description: 'Decision trees, SVM, K-means', level: 'intermediate', skills: ['Decision Trees', 'SVM', 'K-means'], technologies: ['Scikit-learn'], duration: '4-5 weeks', icon: 'bolt' },
      { step: 4, title: 'Ensemble Methods', description: 'Random forest, XGBoost, stacking', level: 'advanced', skills: ['Random Forest', 'XGBoost', 'Ensemble'], technologies: ['XGBoost', 'LightGBM'], duration: '3-4 weeks', icon: 'layers' }
    ] },
    { name: 'Deep Learning & Neural Networks', icon: 'brain', color: 'from-purple-500 to-violet-600', description: 'Advanced neural networks', duration: '4-6 months', difficulty: 'advanced', order: 2, roadmap: [
      { step: 1, title: 'Neural Network Basics', description: 'Perceptrons, activation functions', level: 'intermediate', skills: ['Neural Networks', 'Backpropagation'], technologies: ['TensorFlow', 'Keras'], duration: '3-4 weeks', icon: 'linkicon' },
      { step: 2, title: 'Convolutional Neural Networks', description: 'CNNs for image processing', level: 'advanced', skills: ['CNNs', 'Pooling', 'Transfer Learning'], technologies: ['PyTorch', 'TensorFlow'], duration: '4-5 weeks', icon: 'eye' },
      { step: 3, title: 'RNNs & Transformers', description: 'Sequence models, attention, BERT', level: 'advanced', skills: ['RNNs', 'LSTM', 'Transformers', 'Attention'], technologies: ['PyTorch', 'Hugging Face'], duration: '4-5 weeks', icon: 'sync' },
      { step: 4, title: 'Generative Models', description: 'GANs, VAEs, diffusion models', level: 'advanced', skills: ['GANs', 'VAEs', 'Diffusion'], technologies: ['PyTorch'], duration: '4-5 weeks', icon: 'star' }
    ] },
    { name: 'Generative AI & LLMs', icon: 'robot', color: 'from-rose-500 to-pink-600', description: 'Work with LLMs and generative AI', duration: '3-4 months', difficulty: 'advanced', order: 3, roadmap: [
      { step: 1, title: 'LLM Fundamentals', description: 'How LLMs work, tokenization', level: 'intermediate', skills: ['Tokenization', 'Embeddings', 'Attention'], technologies: ['Hugging Face'], duration: '3-4 weeks', icon: 'book' },
      { step: 2, title: 'Prompt Engineering', description: 'Crafting effective prompts', level: 'intermediate', skills: ['Prompt Design', 'Chain-of-Thought', 'Few-shot'], technologies: ['OpenAI API', 'LangChain'], duration: '2-3 weeks', icon: 'pen' },
      { step: 3, title: 'RAG & Fine-tuning', description: 'Retrieval augmented generation', level: 'advanced', skills: ['RAG', 'Fine-tuning', 'Vector DBs'], technologies: ['LangChain', 'ChromaDB', 'LlamaIndex'], duration: '4-5 weeks', icon: 'search' },
      { step: 4, title: 'AI Agents & Tools', description: 'Build AI agents and tools', level: 'advanced', skills: ['AI Agents', 'Tool Use', 'Multi-agent'], technologies: ['LangChain', 'AutoGPT', 'CrewAI'], duration: '3-4 weeks', icon: 'robot' }
    ] }
  ],
  'Cyber Security': [
    { name: 'Ethical Hacking', icon: 'eye', color: 'from-red-500 to-rose-600', description: 'Think like a hacker', duration: '4-6 months', difficulty: 'intermediate', order: 1, roadmap: [
      { step: 1, title: 'Reconnaissance', description: 'Information gathering techniques', level: 'beginner', skills: ['OSINT', 'Recon', 'Enumeration'], technologies: ['Nmap', 'theHarvester'], duration: '3-4 weeks', icon: 'search' },
      { step: 2, title: 'Vulnerability Scanning', description: 'Identify system vulnerabilities', level: 'intermediate', skills: ['Vuln Scanning', 'CVE Research'], technologies: ['Nessus', 'OpenVAS'], duration: '3-4 weeks', icon: 'science' },
      { step: 3, title: 'Exploitation Basics', description: 'Metasploit, manual exploitation', level: 'intermediate', skills: ['Exploitation', 'Metasploit'], technologies: ['Metasploit', 'Kali Linux'], duration: '4-5 weeks', icon: 'bolt' },
      { step: 4, title: 'Post-Exploitation & Reporting', description: 'Privilege escalation, pivoting', level: 'advanced', skills: ['Priv Escalation', 'Pivoting', 'Reporting'], technologies: ['Impacket', 'Mimikatz'], duration: '4-5 weeks', icon: 'clipboard' }
    ] },
    { name: 'Penetration Testing', icon: 'bolt', color: 'from-orange-500 to-amber-600', description: 'Professional pentesting', duration: '4-6 months', difficulty: 'advanced', order: 2, roadmap: [
      { step: 1, title: 'Web App Pentesting', description: 'OWASP Top 10 testing', level: 'intermediate', skills: ['OWASP', 'Web Testing'], technologies: ['Burp Suite', 'OWASP ZAP'], duration: '4-5 weeks', icon: 'globe' },
      { step: 2, title: 'Network Pentesting', description: 'Internal and external testing', level: 'intermediate', skills: ['Network Testing', 'Port Scanning'], technologies: ['Nmap', 'BloodHound'], duration: '4-5 weeks', icon: 'linkicon' },
      { step: 3, title: 'Mobile & API Testing', description: 'Mobile app and API security', level: 'advanced', skills: ['Mobile Testing', 'API Testing'], technologies: ['MobSF', 'Postman'], duration: '3-4 weeks', icon: 'mobile' },
      { step: 4, title: 'CTF & Real Labs', description: 'Practice on real platforms', level: 'advanced', skills: ['CTF', 'Bug Bounty', 'Report Writing'], technologies: ['HackTheBox', 'TryHackMe'], duration: '4-6 weeks', icon: 'lock' }
    ] }
  ],
  'Data Science': [
    { name: 'Data Analysis', icon: 'clipboard', color: 'from-blue-400 to-blue-600', description: 'Analyze data with Python', duration: '3-4 months', difficulty: 'beginner', order: 1, roadmap: [
      { step: 1, title: 'Python for Data Analysis', description: 'NumPy, Pandas basics', level: 'beginner', skills: ['NumPy', 'Pandas', 'DataFrames'], technologies: ['Jupyter Notebook'], duration: '3-4 weeks', icon: 'python' },
      { step: 2, title: 'Data Cleaning & Wrangling', description: 'Handle missing data, transformations', level: 'beginner', skills: ['Data Cleaning', 'Transformations'], technologies: ['Pandas'], duration: '3-4 weeks', icon: 'terminal' },
      { step: 3, title: 'Exploratory Data Analysis', description: 'Statistics, correlations, insights', level: 'intermediate', skills: ['EDA', 'Statistics', 'Visualization'], technologies: ['Seaborn', 'Matplotlib'], duration: '3-4 weeks', icon: 'chart' },
      { step: 4, title: 'SQL for Data Analysis', description: 'Advanced SQL queries', level: 'intermediate', skills: ['SQL', 'Joins', 'Window Functions'], technologies: ['PostgreSQL', 'BigQuery'], duration: '3-4 weeks', icon: 'database' }
    ] },
    { name: 'Machine Learning', icon: 'robot', color: 'from-cyan-400 to-teal-600', description: 'Build ML models', duration: '4-6 months', difficulty: 'intermediate', order: 2, roadmap: [
      { step: 1, title: 'ML Pipeline', description: 'Feature engineering, model selection', level: 'beginner', skills: ['Feature Engineering', 'Pipeline'], technologies: ['Scikit-learn'], duration: '3-4 weeks', icon: 'project' },
      { step: 2, title: 'Regression & Classification', description: 'Supervised learning models', level: 'intermediate', skills: ['Supervised Learning', 'Evaluation'], technologies: ['Scikit-learn', 'XGBoost'], duration: '4-5 weeks', icon: 'chartline' },
      { step: 3, title: 'Unsupervised Learning', description: 'Clustering, dimensionality reduction', level: 'intermediate', skills: ['Clustering', 'PCA', 't-SNE'], technologies: ['Scikit-learn'], duration: '3-4 weeks', icon: 'bolt' },
      { step: 4, title: 'Model Deployment', description: 'Deploy models to production', level: 'advanced', skills: ['Deployment', 'API', 'Monitoring'], technologies: ['FastAPI', 'MLflow', 'Docker'], duration: '4-5 weeks', icon: 'bolt' }
    ] }
  ],
  'Cloud Computing': [
    { name: 'AWS Cloud', icon: 'cloud', color: 'from-orange-400 to-amber-600', description: 'Amazon Web Services', duration: '4-6 months', difficulty: 'intermediate', order: 1, roadmap: [
      { step: 1, title: 'AWS Fundamentals', description: 'IAM, EC2, S3, VPC', level: 'beginner', skills: ['IAM', 'EC2', 'S3', 'VPC'], technologies: ['AWS Console', 'AWS CLI'], duration: '4-5 weeks', icon: 'cloud' },
      { step: 2, title: 'Compute & Storage', description: 'Lambda, EBS, EFS, CloudFront', level: 'intermediate', skills: ['Lambda', 'EBS', 'CloudFront'], technologies: ['AWS Lambda', 'S3'], duration: '4-5 weeks', icon: 'storage' },
      { step: 3, title: 'Databases on AWS', description: 'RDS, DynamoDB, ElastiCache', level: 'intermediate', skills: ['RDS', 'DynamoDB', 'Caching'], technologies: ['AWS RDS', 'DynamoDB'], duration: '3-4 weeks', icon: 'database' },
      { step: 4, title: 'AWS Architecture', description: 'High availability, scaling, security', level: 'advanced', skills: ['HA Architecture', 'Auto Scaling', 'Security'], technologies: ['CloudFormation', 'CDK'], duration: '4-5 weeks', icon: 'project' }
    ] },
    { name: 'DevOps & Containers', icon: 'docker', color: 'from-cyan-400 to-blue-600', description: 'CI/CD, Docker, K8s', duration: '4-6 months', difficulty: 'intermediate', order: 2, roadmap: [
      { step: 1, title: 'Docker Mastery', description: 'Containers, compose, registry', level: 'beginner', skills: ['Docker', 'Docker Compose'], technologies: ['Docker Desktop'], duration: '4-5 weeks', icon: 'docker' },
      { step: 2, title: 'Kubernetes Basics', description: 'Pods, services, deployments', level: 'intermediate', skills: ['K8s', 'kubectl', 'Helm'], technologies: ['Minikube', 'K8s'], duration: '5-6 weeks', icon: 'cogs' },
      { step: 3, title: 'CI/CD Pipelines', description: 'Jenkins, GitHub Actions', level: 'intermediate', skills: ['CI/CD', 'Pipeline as Code'], technologies: ['Jenkins', 'GitHub Actions'], duration: '4-5 weeks', icon: 'sync' },
      { step: 4, title: 'Terraform & IaC', description: 'Infrastructure as Code', level: 'advanced', skills: ['Terraform', 'State Management'], technologies: ['Terraform', 'Ansible'], duration: '4-5 weeks', icon: 'clipboard' }
    ] }
  ],
  'Mobile App Development': [
    { name: 'Flutter Development', icon: 'layers', color: 'from-blue-400 to-cyan-600', description: 'Cross-platform with Flutter', duration: '3-5 months', difficulty: 'beginner', order: 1, roadmap: [
      { step: 1, title: 'Dart Language', description: 'Dart syntax, OOP, async', level: 'beginner', skills: ['Dart', 'Async/Await', 'OOP'], technologies: ['Flutter SDK'], duration: '3-4 weeks', icon: 'bolt' },
      { step: 2, title: 'Flutter Widgets', description: 'Widget tree, layouts, navigation', level: 'beginner', skills: ['Widgets', 'Layout', 'Navigation'], technologies: ['Flutter'], duration: '4-5 weeks', icon: 'layers' },
      { step: 3, title: 'State Management', description: 'Provider, Riverpod, Bloc', level: 'intermediate', skills: ['State Management', 'Riverpod'], technologies: ['Flutter'], duration: '3-4 weeks', icon: 'chart' },
      { step: 4, title: 'Firebase & Deployment', description: 'Backend services, app store', level: 'advanced', skills: ['Firebase', 'Deployment'], technologies: ['Firebase', 'Play Store'], duration: '3-4 weeks', icon: 'bolt' }
    ] },
    { name: 'React Native', icon: 'react', color: 'from-blue-500 to-indigo-600', description: 'Cross-platform with RN', duration: '3-5 months', difficulty: 'intermediate', order: 2, roadmap: [
      { step: 1, title: 'React Native Basics', description: 'Components, navigation, styling', level: 'beginner', skills: ['RN Components', 'Navigation'], technologies: ['React Native', 'Expo'], duration: '4-5 weeks', icon: 'react' },
      { step: 2, title: 'Native Features', description: 'Camera, location, notifications', level: 'intermediate', skills: ['Native APIs', 'Permissions'], technologies: ['React Native'], duration: '3-4 weeks', icon: 'mobile' },
      { step: 3, title: 'State & Data Management', description: 'Redux, API integration', level: 'intermediate', skills: ['Redux', 'API', 'Async Storage'], technologies: ['Redux Toolkit'], duration: '3-4 weeks', icon: 'database' },
      { step: 4, title: 'Publishing & Testing', description: 'App store deployment, testing', level: 'advanced', skills: ['Testing', 'Deployment'], technologies: ['App Store', 'Google Play'], duration: '3-4 weeks', icon: 'check' }
    ] }
  ],
  'UI/UX Design': [
    { name: 'Visual Design', icon: 'palette', color: 'from-pink-400 to-rose-600', description: 'Design fundamentals', duration: '2-3 months', difficulty: 'beginner', order: 1, roadmap: [
      { step: 1, title: 'Design Principles', description: 'Color, typography, hierarchy', level: 'beginner', skills: ['Color Theory', 'Typography', 'Layout'], technologies: ['Figma'], duration: '3-4 weeks', icon: 'palette' },
      { step: 2, title: 'Figma Mastery', description: 'Components, auto-layout, prototyping', level: 'beginner', skills: ['Figma', 'Auto Layout', 'Variants'], technologies: ['Figma'], duration: '4-5 weeks', icon: 'pen' },
      { step: 3, title: 'Design Systems', description: 'Build scalable design systems', level: 'advanced', skills: ['Design Tokens', 'Components', 'Documentation'], technologies: ['Figma', 'Storybook'], duration: '4-5 weeks', icon: 'ruler' }
    ] },
    { name: 'UX Research & Strategy', icon: 'search', color: 'from-purple-400 to-violet-600', description: 'User-centered design', duration: '2-3 months', difficulty: 'beginner', order: 2, roadmap: [
      { step: 1, title: 'User Research', description: 'Interviews, surveys, personas', level: 'beginner', skills: ['User Research', 'Personas', 'Journey Maps'], technologies: ['Miro', 'Notion'], duration: '3-4 weeks', icon: 'users' },
      { step: 2, title: 'Wireframing & Prototyping', description: 'Low to high fidelity prototypes', level: 'beginner', skills: ['Wireframing', 'Prototyping'], technologies: ['Figma', 'Balsamiq'], duration: '3-4 weeks', icon: 'pen' },
      { step: 3, title: 'Usability Testing', description: 'Test and iterate designs', level: 'intermediate', skills: ['Usability Testing', 'A/B Testing'], technologies: ['UserTesting', 'Hotjar'], duration: '3-4 weeks', icon: 'science' }
    ] }
  ],
  'Game Development': [
    { name: 'Unity Development', icon: 'bolt', color: 'from-gray-500 to-slate-700', description: '2D/3D games with Unity', duration: '4-6 months', difficulty: 'intermediate', order: 1, roadmap: [
      { step: 1, title: 'Unity Editor & C#', description: 'Editor basics, C# scripting', level: 'beginner', skills: ['Unity Editor', 'C#', 'GameObjects'], technologies: ['Unity', 'Visual Studio'], duration: '4-5 weeks', icon: 'gamepad' },
      { step: 2, title: '2D Game Development', description: 'Sprites, physics, tilemaps', level: 'beginner', skills: ['2D Physics', 'Animation', 'Tilemaps'], technologies: ['Unity 2D'], duration: '5-6 weeks', icon: 'cube' },
      { step: 3, title: '3D Game Development', description: '3D models, lighting, materials', level: 'intermediate', skills: ['3D', 'Lighting', 'Shaders'], technologies: ['Blender', 'Unity 3D'], duration: '6-7 weeks', icon: 'cube' },
      { step: 4, title: 'Multiplayer & Publishing', description: 'Online multiplayer, build & ship', level: 'advanced', skills: ['Networking', 'Build Pipeline'], technologies: ['Photon', 'Steam'], duration: '5-6 weeks', icon: 'globe' }
    ] }
  ],
  'Blockchain Development': [
    { name: 'Smart Contracts', icon: 'clipboard', color: 'from-yellow-400 to-amber-600', description: 'Solidity development', duration: '3-4 months', difficulty: 'advanced', order: 1, roadmap: [
      { step: 1, title: 'Ethereum & Solidity', description: 'Smart contract programming', level: 'beginner', skills: ['Solidity', 'Remix', 'ABI'], technologies: ['Remix', 'Solidity'], duration: '4-5 weeks', icon: 'pen' },
      { step: 2, title: 'Advanced Solidity', description: 'Security, gas optimization', level: 'intermediate', skills: ['Security', 'Gas Optimization', 'Testing'], technologies: ['Hardhat', 'OpenZeppelin'], duration: '4-5 weeks', icon: 'lock' },
      { step: 3, title: 'dApp Development', description: 'Frontend + smart contracts', level: 'advanced', skills: ['Web3.js', 'Ethers.js', 'Wallet'], technologies: ['React', 'Ethers.js'], duration: '4-5 weeks', icon: 'globe' },
      { step: 4, title: 'DeFi & NFTs', description: 'DeFi protocols, NFT marketplaces', level: 'advanced', skills: ['DeFi', 'NFT', 'ERC Standards'], technologies: ['Hardhat', 'IPFS'], duration: '5-6 weeks', icon: 'lock' }
    ] }
  ],
  'DevOps Engineering': [
    { name: 'CI/CD & Automation', icon: 'sync', color: 'from-blue-400 to-indigo-600', description: 'Automate everything', duration: '3-4 months', difficulty: 'intermediate', order: 1, roadmap: [
      { step: 1, title: 'Git & Version Control', description: 'Advanced Git workflows', level: 'beginner', skills: ['Git', 'Branching', 'CI/CD'], technologies: ['Git', 'GitHub'], duration: '2-3 weeks', icon: 'folder' },
      { step: 2, title: 'CI/CD Pipelines', description: 'Jenkins, GitHub Actions', level: 'intermediate', skills: ['Pipeline Design', 'Automation'], technologies: ['Jenkins', 'GitHub Actions'], duration: '4-5 weeks', icon: 'sync' },
      { step: 3, title: 'Container Orchestration', description: 'Kubernetes at scale', level: 'advanced', skills: ['K8s', 'Helm', 'Service Mesh'], technologies: ['Kubernetes', 'Istio'], duration: '5-6 weeks', icon: 'cogs' },
      { step: 4, title: 'Monitoring & Observability', description: 'Prometheus, Grafana, ELK', level: 'advanced', skills: ['Monitoring', 'Alerting', 'Logging'], technologies: ['Prometheus', 'Grafana'], duration: '4-5 weeks', icon: 'chart' }
    ] },
    { name: 'Infrastructure as Code', icon: 'clipboard', color: 'from-green-400 to-emerald-600', description: 'Manage infra with code', duration: '3-4 months', difficulty: 'intermediate', order: 2, roadmap: [
      { step: 1, title: 'Terraform Fundamentals', description: 'HCL, providers, state', level: 'beginner', skills: ['Terraform', 'HCL', 'State'], technologies: ['Terraform', 'AWS'], duration: '4-5 weeks', icon: 'project' },
      { step: 2, title: 'Ansible & Config Management', description: 'Automate configuration', level: 'intermediate', skills: ['Ansible', 'Playbooks', 'Roles'], technologies: ['Ansible'], duration: '3-4 weeks', icon: 'bolt' },
      { step: 3, title: 'Secret & Config Management', description: 'Vault, encrypted secrets', level: 'advanced', skills: ['Vault', 'Secrets', 'Encryption'], technologies: ['HashiCorp Vault', 'SOPS'], duration: '3-4 weeks', icon: 'lock' }
    ] }
  ],
  'Software Engineering': [
    { name: 'Software Design', icon: 'project', color: 'from-blue-400 to-indigo-600', description: 'Design patterns & architecture', duration: '3-4 months', difficulty: 'intermediate', order: 1, roadmap: [
      { step: 1, title: 'Design Patterns', description: 'GoF patterns, SOLID', level: 'intermediate', skills: ['Creational', 'Structural', 'Behavioral'], technologies: ['UML', 'Draw.io'], duration: '4-5 weeks', icon: 'project' },
      { step: 2, title: 'Clean Architecture', description: 'Hexagonal, onion, clean arch', level: 'advanced', skills: ['Clean Architecture', 'DDD', 'CQRS'], technologies: ['TypeScript', 'NestJS'], duration: '4-5 weeks', icon: 'project' },
      { step: 3, title: 'Microservices Design', description: 'Service decomposition, events', level: 'advanced', skills: ['Microservices', 'Event-driven', 'Saga'], technologies: ['Kafka', 'Docker'], duration: '4-5 weeks', icon: 'cogs' }
    ] },
    { name: 'Testing & Quality', icon: 'science', color: 'from-green-400 to-emerald-600', description: 'Software testing practices', duration: '2-3 months', difficulty: 'intermediate', order: 2, roadmap: [
      { step: 1, title: 'Test-Driven Development', description: 'TDD cycle, unit testing', level: 'beginner', skills: ['TDD', 'Unit Testing', 'Mocking'], technologies: ['Jest', 'pytest'], duration: '3-4 weeks', icon: 'science' },
      { step: 2, title: 'Integration & E2E Testing', description: 'API testing, browser tests', level: 'intermediate', skills: ['Integration Testing', 'E2E'], technologies: ['Cypress', 'Supertest'], duration: '3-4 weeks', icon: 'linkicon' },
      { step: 3, title: 'CI Testing & Quality Gates', description: 'Automated testing in CI', level: 'advanced', skills: ['CI Testing', 'Coverage', 'Linting'], technologies: ['GitHub Actions', 'SonarQube'], duration: '2-3 weeks', icon: 'check' }
    ] }
  ],
  'Networking': [
    { name: 'CCNA Routing & Switching', icon: 'syncalt', color: 'from-green-400 to-emerald-600', description: 'Cisco networking fundamentals', duration: '4-6 months', difficulty: 'beginner', order: 1, roadmap: [
      { step: 1, title: 'Network Fundamentals', description: 'OSI, TCP/IP, Ethernet', level: 'beginner', skills: ['OSI Model', 'TCP/IP', 'Ethernet'], technologies: ['Packet Tracer'], duration: '4-5 weeks', icon: 'globe' },
      { step: 2, title: 'Switching Concepts', description: 'VLANs, STP, trunking', level: 'beginner', skills: ['VLAN', 'STP', 'EtherChannel'], technologies: ['Cisco IOS', 'Packet Tracer'], duration: '5-6 weeks', icon: 'syncalt' },
      { step: 3, title: 'Routing Protocols', description: 'OSPF, EIGRP, BGP basics', level: 'intermediate', skills: ['OSPF', 'EIGRP', 'Route Redistribution'], technologies: ['Cisco IOS', 'GNS3'], duration: '6-7 weeks', icon: 'network' },
      { step: 4, title: 'Network Security & Automation', description: 'ACLs, VPNs, network automation', level: 'advanced', skills: ['Security', 'Automation', 'Troubleshooting'], technologies: ['Ansible', 'Python'], duration: '4-5 weeks', icon: 'lock' }
    ] }
  ]
};

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Field.deleteMany({});
    await Track.deleteMany({});
    console.log('Cleared existing fields and tracks');

    const insertedFields = [];
    for (const fieldData of fieldSeedData) {
      const field = await Field.create(fieldData);
      insertedFields.push(field);
      console.log(`Created field: ${field.name}`);

      const tracks = fieldTracks[field.name] || [];
      for (const trackData of tracks) {
        await Track.create({
          ...trackData,
          fieldId: field._id,
          totalSteps: trackData.roadmap?.length || 0
        });
        console.log(`  Created track: ${trackData.name}`);
      }
    }

    console.log(`\n✅ Seeded ${insertedFields.length} fields with tracks successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seedDatabase();
