/**
 * TECHFEST 30 / VERIFIED CONTENT AND LINK REGISTRY
 * Verified against official Techfest portals (techfest.org & ca.techfest.org)
 * Checked: 04 November 2026
 */

export interface DomainItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  keyAspects: string[];
  officialUrl: string;
  astrolabeTargetRing: number; // 0: inner, 1: middle, 2: outer, 3: zodiac
}

export interface CompetitionItem {
  id: string;
  name: string;
  category: string;
  summary: string;
  details: string;
  officialUrl: string;
  featuredTag?: string;
}

export interface LearningItem {
  id: string;
  type: 'Workshop' | 'Exhibition' | 'Lecture' | 'Showcase';
  title: string;
  focus: string;
  summary: string;
  officialUrl: string;
}

export interface AtmosphereItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlight: string;
}

export const TECHFEST_CONFIG = {
  edition: '30th Edition',
  name: 'Techfest 2026',
  institution: 'IIT Bombay',
  fullTitle: 'Techfest 30, IIT Bombay',
  theme: 'An Aetherial Renaissance',
  themeSubtitle: 'The Revival of Scientific Curiosity & Engineering Mastery',
  dates: 'December 16–18, 2026',
  accommodationDates: 'December 15–19, 2026',
  venue: 'Indian Institute of Technology Bombay, Powai, Mumbai, Maharashtra 400076',
  narrativeLead: 'From the first calibrated brass astrolabes that charted celestial spheres to autonomous orbital systems and neural architectures — Techfest 30 revives the timeless spirit of curiosity. Step inside the Living Atlas.',
  
  urls: {
    officialSite: 'https://techfest.org',
    competitions: 'https://techfest.org/competitions',
    workshops: 'https://techfest.org/workshops',
    exhibitions: 'https://techfest.org/exhibitions',
    lectures: 'https://techfest.org/lectures',
    collegeAmbassador: 'https://ca.techfest.org',
    caWebTask: 'https://ca.techfest.org/tasks/web-development',
    iitBombay: 'https://www.iitb.ac.in',
  },

  socials: [
    { label: 'Instagram', url: 'https://www.instagram.com/techfest_iitbombay' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/company/techfest' },
    { label: 'YouTube', url: 'https://www.youtube.com/c/TechfestIITBombay' },
    { label: 'X (Twitter)', url: 'https://twitter.com/Techfest_IITB' },
  ],

  disclaimer: 'Independent College Ambassador concept and submission for Techfest 30, IIT Bombay. Built by JNikhil11 for the CA Web Development task. All official trademarks, event identities, and logos remain the exclusive intellectual property of Techfest, IIT Bombay.',
};

export const DOMAINS: DomainItem[] = [
  {
    id: 'robotics',
    number: '01',
    title: 'Robotics & Autonomous Kinetic Systems',
    tagline: 'Mechanical precision meets intelligent perception',
    description: 'Autonomous navigation, high-impact combat robotics, and agile kinematic mechanisms pushing the boundaries of physical computation.',
    keyAspects: ['Combat Robotics', 'Autonomous Maze Solving', 'Kinematic Manipulators', 'Computer Vision Guidance'],
    officialUrl: TECHFEST_CONFIG.urls.competitions,
    astrolabeTargetRing: 0,
  },
  {
    id: 'aerospace',
    number: '02',
    title: 'Aerospace & Atmospheric Dynamics',
    tagline: 'From low-altitude aerodynamics to interplanetary propulsion',
    description: 'Micro-UAV design, autonomous drone swarms, thrust vectoring, and high-altitude aerodynamic research challenging aerial engineering.',
    keyAspects: ['Fixed-Wing Aerodynamics', 'FPV Drone Maneuvers', 'Autonomous Avionics', 'Propulsion Modeling'],
    officialUrl: TECHFEST_CONFIG.urls.competitions,
    astrolabeTargetRing: 1,
  },
  {
    id: 'ai-computing',
    number: '03',
    title: 'Cognitive Computing & Intelligence',
    tagline: 'Architecting models that reason, synthesize, and adapt',
    description: 'Foundational transformer architectures, edge intelligence, multimodal inference, and real-time algorithmic problem solving at scale.',
    keyAspects: ['Large Language Models', 'Edge ML Interfacing', 'Competitive Programming', 'Cybersecurity CTFs'],
    officialUrl: TECHFEST_CONFIG.urls.workshops,
    astrolabeTargetRing: 2,
  },
  {
    id: 'clean-innovation',
    number: '04',
    title: 'Sustainable Engineering & Earth Systems',
    tagline: 'Translating grassroots technology into ecological resilience',
    description: 'Scalable renewable energy cycles, circular resource networks, and clean-tech innovations addressing planet-scale sustainability challenges.',
    keyAspects: ['InnovateX Challenges', 'Decarbonized Systems', 'Clean Water Engineering', 'Smart Power Grids'],
    officialUrl: TECHFEST_CONFIG.urls.competitions,
    astrolabeTargetRing: 3,
  },
];

export const COMPETITIONS: CompetitionItem[] = [
  {
    id: 'robowars',
    name: 'International Robowars',
    category: 'Combat Robotics',
    summary: 'Asia’s premier high-energy combat robotics arena featuring custom-engineered 15kg and 60kg machines.',
    details: 'Teams construct battle-tested armored gladiators with pneumatic flippers, hardened spinning blades, and resilient telemetry systems.',
    officialUrl: TECHFEST_CONFIG.urls.competitions,
    featuredTag: 'Flagship Event',
  },
  {
    id: 'aeromodelling',
    name: 'Boeing National Aeromodelling Challenge',
    category: 'Aerospace Engineering',
    summary: 'Rigorous national aerial competition evaluating fixed-wing flight dynamics, payload drop accuracy, and stability.',
    details: 'Engineered aircraft are judged on structural integrity, aerodynamic glide ratios, thrust efficiency, and precision maneuvering.',
    officialUrl: TECHFEST_CONFIG.urls.competitions,
    featuredTag: 'National Championship',
  },
  {
    id: 'innovatex',
    name: 'InnovateX National Innovation Challenge',
    category: 'Research & Incubation',
    summary: 'The premier stage for breakthrough hardware and software prototypes solving tangible societal problems.',
    details: 'Connects visionary student inventors with industry evaluators, incubation ecosystems, and early-stage development grants.',
    officialUrl: TECHFEST_CONFIG.urls.competitions,
    featuredTag: 'Impact Track',
  },
  {
    id: 'icc',
    name: 'International Coding Challenge',
    category: 'Algorithms & Software',
    summary: 'High-intensity competitive programming showdown pitting top global programmers against complex algorithmic limits.',
    details: 'Spans advanced graph theory, dynamic programming optimization, cryptographic puzzles, and distributed data systems.',
    officialUrl: TECHFEST_CONFIG.urls.competitions,
  },
  {
    id: 'meshmerize',
    name: 'Meshmerize Autonomous Challenge',
    category: 'Autonomous Navigation',
    summary: 'Precision robotics competition requiring micro-controlled robots to solve dynamically mapped grid mazes autonomously.',
    details: 'Robots must process optical line sensor streams and maze algorithms in real time without human intervention.',
    officialUrl: TECHFEST_CONFIG.urls.competitions,
  },
];

export const LEARNING_OFFERINGS: LearningItem[] = [
  {
    id: 'genai-workshop',
    type: 'Workshop',
    title: 'Generative AI & LLM Systems Engineering',
    focus: 'On-Campus Hands-on Lab',
    summary: 'Deep dive into local inference, model quantization, retrieval-augmented generation (RAG), and agentic workflows.',
    officialUrl: TECHFEST_CONFIG.urls.workshops,
  },
  {
    id: 'ros-robotics',
    type: 'Workshop',
    title: 'Autonomous Robotics with ROS 2 & Sensor Fusion',
    focus: 'Hardware & Simulation Lab',
    summary: 'Hands-on LIDAR, IMU telemetry integration, SLAM mapping, and kinematics control using modern robotics middlewares.',
    officialUrl: TECHFEST_CONFIG.urls.workshops,
  },
  {
    id: 'global-exhibits',
    type: 'Exhibition',
    title: 'World Technology & Robotics Exhibition',
    focus: 'Campus Open Pavilion',
    summary: 'Interactive showcase featuring state-of-the-art defense innovations, bionic humanoids, and international research laboratories.',
    officialUrl: TECHFEST_CONFIG.urls.exhibitions,
  },
  {
    id: 'keynotes',
    type: 'Lecture',
    title: 'Techfest International Lecture Series',
    focus: 'Convocation Hall Auditorium',
    summary: 'Keynote addresses and fire-side conversations with Nobel Laureates, Turing Award winners, and pioneering scientists.',
    officialUrl: TECHFEST_CONFIG.urls.lectures,
  },
];

export const FESTIVAL_ATMOSPHERE: AtmosphereItem[] = [
  {
    id: 'technoholix',
    title: 'Technoholix Night Spectacle',
    subtitle: 'Where High Technology Meets Grand Artistry',
    description: 'An electrifying evening amphitheater showcase combining synchronized laser physics, pyrotechnics, optical illusions, and international performance arts.',
    highlight: 'Open to all registered festival delegates at the IIT Bombay Gymkhana Grounds.',
  },
  {
    id: 'ozone',
    title: 'Ozone Interactive Zone',
    subtitle: 'Campus Scientific Playground & Carnival',
    description: 'Informal hands-on science arena featuring full-immersion VR simulations, tactile mechanics, escape chambers, and spontaneous technology challenges.',
    highlight: 'Interactive discovery stations operating continuously throughout the three festival days.',
  },
  {
    id: 'campus',
    title: 'The Green Powai Campus',
    subtitle: '500+ Acres of Intellectual Immersion',
    description: 'Surrounded by the Sanjay Gandhi National Park hills and Powai Lake, IIT Bombay transforms into a buzzing international confluence of 175,000+ enthusiastic participants.',
    highlight: 'December 16–18, 2026 | Indian Institute of Technology Bombay.',
  },
];
