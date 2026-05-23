import {
  MdCode, MdPublic, MdSmartToy, MdLock, MdBarChart, MdCloud,
  MdPhoneAndroid, MdPalette, MdSportsEsports, MdLink, MdSync,
  MdBuild, MdHub, MdSchool, MdTimeline, MdCheckCircle, MdStar,
  MdMenuBook, MdComputer, MdLanguage, MdScience, MdLayers,
  MdStorage, MdTerminal, MdViewModule
} from 'react-icons/md';
import {
  FaPython, FaJava, FaReact, FaNodeJs, FaDocker, FaGitAlt,
  FaAws, FaLinux, FaRust, FaSwift, FaPhp, FaVuejs,
  FaAngular, FaCss3Alt, FaHtml5, FaJsSquare, FaDatabase,
  FaCogs, FaShieldAlt, FaGamepad, FaRobot, FaGlobe,
  FaCloud, FaMobileAlt, FaPaintBrush, FaLink, FaSyncAlt,
  FaRuler, FaNetworkWired, FaApple, FaGoogle, FaBolt,
  FaLaptopCode, FaCode, FaBrain, FaChartBar, FaChartLine,
  FaChartPie, FaLockOpen, FaServer, FaCube, FaEye,
  FaPenFancy, FaClipboardList, FaProjectDiagram, FaLayerGroup,
  FaLock, FaFolder, FaFolderOpen, FaUsers, FaSearch
} from 'react-icons/fa';

const iconMap = {
  // Fields (13 major fields)
  code: MdCode,
  globe: FaGlobe,
  robot: FaRobot,
  shield: FaShieldAlt,
  chart: FaChartBar,
  cloud: FaCloud,
  mobile: FaMobileAlt,
  palette: FaPaintBrush,
  gamepad: FaGamepad,
  link: FaLink,
  sync: FaSyncAlt,
  build: MdBuild,
  network: FaNetworkWired,

  // Sub-fields (programming languages)
  python: FaPython,
  java: FaJava,
  cpp: MdCode,
  csharp: MdCode,
  swift: FaSwift,
  php: FaPhp,
  rust: FaRust,
  go: FaCode,

  // Sub-fields (frontend)
  react: FaReact,
  vue: FaVuejs,
  angular: FaAngular,
  html: FaHtml5,
  css: FaCss3Alt,
  js: FaJsSquare,

  // Sub-fields (backend/platform)
  node: FaNodeJs,
  server: FaServer,
  database: FaDatabase,
  api: MdHub,
  docker: FaDocker,
  aws: FaAws,
  linux: FaLinux,
  git: FaGitAlt,

  // Sub-fields (general)
  bolt: FaBolt,
  laptop: FaLaptopCode,
  terminal: MdTerminal,
  storage: MdStorage,
  layers: FaLayerGroup,
  brain: FaBrain,
  project: FaProjectDiagram,
  clipboard: FaClipboardList,
  pen: FaPenFancy,
  eye: FaEye,
  cube: FaCube,
  cogs: FaCogs,
  lockopen: FaLockOpen,
  lock: FaLock,
  chartline: FaChartLine,
  chartpie: FaChartPie,
  science: MdScience,

  // UI elements
  school: MdSchool,
  timeline: MdTimeline,
  check: MdCheckCircle,
  star: MdStar,
  book: MdMenuBook,
  computer: MdComputer,
  language: MdLanguage,
  smartphone: MdPhoneAndroid,
  smarttoy: MdSmartToy,
  publicicon: MdPublic,
  game: MdSportsEsports,
  syncalt: FaSyncAlt,
  ruler: FaRuler,
  linkicon: FaLink,
  apple: FaApple,
  google: FaGoogle,
  folder: FaFolder,
  folderopen: FaFolderOpen,
  users: FaUsers,
  search: FaSearch,

  // Fallback
  default: MdSchool
};

export function getIcon(iconName) {
  if (!iconName) return iconMap.default;
  const key = iconName.trim().toLowerCase();
  return iconMap[key] || iconMap.default;
}

export default iconMap;
