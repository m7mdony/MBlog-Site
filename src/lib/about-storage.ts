// About page storage for managing sections, skills, education, and certifications
export interface AboutSection {
  id: string;
  title: string;
  content: string;
  isVisible: boolean;
  order: number;
}

export interface TechSkill {
  id: string;
  name: string;
  icon: string;
  image?: string;
  category: string;
  isVisible: boolean;
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  university: string;
  icon: string;
  image?: string;
  isVisible: boolean;
}

export interface Certification {
  id: string;
  name: string;
  fullName: string;
  organization: string;
  icon: string;
  isVisible: boolean;
}

const ABOUT_SECTIONS_KEY = 'mariam_about_sections';
const TECH_SKILLS_KEY = 'mariam_tech_skills';
const EDUCATION_KEY = 'mariam_education';
const CERTIFICATIONS_KEY = 'mariam_certifications';

// Default data
const defaultSections: AboutSection[] = [
  {
    id: "1",
    title: "نبذة عني",
    content: "تمكين المنظمات من تطوير عمليات النمو عبر الاستراتيجيات والتسويق والتقنية وأتمتة العمليات",
    isVisible: true,
    order: 1
  },
  {
    id: "2",
    title: "مهاراتي التقنية",
    content: "",
    isVisible: true,
    order: 2
  },
  {
    id: "3",
    title: "خبراتي العملية",
    content: "",
    isVisible: true,
    order: 3
  },
  {
    id: "4",
    title: "رؤيتي",
    content: "",
    isVisible: true,
    order: 4
  }
];

const defaultSkills: TechSkill[] = [
  // Office Apps
  { id: "1", name: "Word", icon: "📝", category: "Office Apps", isVisible: true },
  { id: "2", name: "Excel", icon: "📊", category: "Office Apps", isVisible: true },
  { id: "3", name: "PowerPoint", icon: "📽️", category: "Office Apps", isVisible: true },
  { id: "4", name: "OneNote", icon: "📋", category: "Office Apps", isVisible: true },
  
  // Google Apps
  { id: "5", name: "Sheets", icon: "📊", category: "Google Apps", isVisible: true },
  { id: "6", name: "Docs", icon: "📄", category: "Google Apps", isVisible: true },
  { id: "7", name: "Slides", icon: "🎞️", category: "Google Apps", isVisible: true },
  { id: "8", name: "Forms", icon: "📝", category: "Google Apps", isVisible: true },
  
  // Graphics & Videos Apps
  { id: "9", name: "Illustrator", icon: "🎨", category: "Graphics & Videos Apps", isVisible: true },
  { id: "10", name: "Premiere", icon: "🎬", category: "Graphics & Videos Apps", isVisible: true },
  { id: "11", name: "Photoshop", icon: "📸", category: "Graphics & Videos Apps", isVisible: true },
  { id: "12", name: "InDesign", icon: "📖", category: "Graphics & Videos Apps", isVisible: true },
  { id: "13", name: "Adobe XD", icon: "🎯", category: "Graphics & Videos Apps", isVisible: true },
  { id: "14", name: "Figma", icon: "🎨", category: "Graphics & Videos Apps", isVisible: true },
  
  // Zoho Apps
  { id: "15", name: "Zoho CRM", icon: "👥", category: "Zoho Apps", isVisible: true },
  { id: "16", name: "Zoho Mail", icon: "📧", category: "Zoho Apps", isVisible: true },
  { id: "17", name: "Zoho Projects", icon: "📋", category: "Zoho Apps", isVisible: true },
  
  // WordPress
  { id: "18", name: "WordPress", icon: "🌐", category: "WordPress", isVisible: true },
  
  // Analytics Apps
  { id: "19", name: "Google Analytics", icon: "📈", category: "Analytics Apps", isVisible: true },
  { id: "20", name: "Google Tag Manager", icon: "🏷️", category: "Analytics Apps", isVisible: true },
  { id: "21", name: "Google Data Studio", icon: "📊", category: "Analytics Apps", isVisible: true },
  { id: "22", name: "AgencyAnalytics", icon: "📊", category: "Analytics Apps", isVisible: true },
  { id: "23", name: "DataiKu", icon: "🔍", category: "Analytics Apps", isVisible: true },
  { id: "24", name: "Power BI", icon: "⚡", category: "Analytics Apps", isVisible: true },
  
  // Paid ADs
  { id: "25", name: "Twitter Ads", icon: "🐦", category: "Paid ADs", isVisible: true },
  { id: "26", name: "Facebook Ads", icon: "📘", category: "Paid ADs", isVisible: true },
  { id: "27", name: "Snapchat Ads", icon: "👻", category: "Paid ADs", isVisible: true },
  { id: "28", name: "Google Ads", icon: "🎯", category: "Paid ADs", isVisible: true },
  { id: "29", name: "TikTok Ads", icon: "🎵", category: "Paid ADs", isVisible: true },
  
  // Monitoring Apps
  { id: "30", name: "Talkwalker", icon: "👁️", category: "Monitoring Apps", isVisible: true },
  { id: "31", name: "Tweetdeck", icon: "🐦", category: "Monitoring Apps", isVisible: true },
  { id: "32", name: "Meltwater", icon: "💧", category: "Monitoring Apps", isVisible: true },
  
  // SEO Apps
  { id: "33", name: "Semrush", icon: "🔍", category: "SEO Apps", isVisible: true },
  { id: "34", name: "Moz", icon: "🦎", category: "SEO Apps", isVisible: true },
  
  // CRM
  { id: "35", name: "Zoho", icon: "📊", category: "CRM", isVisible: true },
  { id: "36", name: "Mailer", icon: "📧", category: "CRM", isVisible: true },
  { id: "37", name: "Mailchimp", icon: "🐵", category: "CRM", isVisible: true },
  { id: "38", name: "Mailerlite", icon: "✉️", category: "CRM", isVisible: true },
  
  // Task Management Tools
  { id: "39", name: "Asana", icon: "✅", category: "Task Management Tools", isVisible: true },
  { id: "40", name: "Notion", icon: "📝", category: "Task Management Tools", isVisible: true },
  { id: "41", name: "Trello", icon: "📋", category: "Task Management Tools", isVisible: true },
  
  // Programming & Development
  { id: "42", name: "React", icon: "⚛️", category: "Programming & Development", isVisible: true },
  { id: "43", name: "Node.js", icon: "🟢", category: "Programming & Development", isVisible: true },
  { id: "44", name: "TypeScript", icon: "🔷", category: "Programming & Development", isVisible: true },
  
  // Design & Creative Tools
  { id: "45", name: "Canva", icon: "🎨", category: "Design & Creative Tools", isVisible: true },
  { id: "46", name: "Crello", icon: "🎭", category: "Design & Creative Tools", isVisible: true },
  
  // Automation & Integration
  { id: "47", name: "Zapier", icon: "⚡", category: "Automation & Integration", isVisible: true },
  { id: "48", name: "IFTTT", icon: "🔗", category: "Automation & Integration", isVisible: true },
  { id: "49", name: "Integromat", icon: "🔧", category: "Automation & Integration", isVisible: true },
  
  // Project Management
  { id: "50", name: "Monday.com", icon: "📅", category: "Project Management", isVisible: true },
  { id: "51", name: "ClickUp", icon: "🎯", category: "Project Management", isVisible: true },
  { id: "52", name: "Basecamp", icon: "🏕️", category: "Project Management", isVisible: true }
];

const defaultEducation: Education[] = [
  {
    id: "1",
    degree: "بكالوريوس اللغات والترجمة",
    field: "اللغات والترجمة",
    university: "جامعة الملك سعود",
    icon: "🎓",
    image: "/images/king-saud-university-logo.svg",
    isVisible: true
  },
  {
    id: "2",
    degree: "ماجستير إدارة الأعمال",
    field: "إدارة الأعمال",
    university: "جامعة الملك سعود",
    icon: "🎯",
    image: "/images/king-saud-university-logo.svg",
    isVisible: true
  }
];

const defaultCertifications: Certification[] = [
  {
    id: "1",
    name: "CPMM",
    fullName: "Certified Product Marketing Manager",
    organization: "AIPMM",
    icon: "📊",
    isVisible: true
  }
];

// Generic storage functions
function getStorageData<T>(key: string, defaultValue: T[]): T[] {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with default data
    setStorageData(key, defaultValue);
    return defaultValue;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return defaultValue;
  }
}

function setStorageData<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('aboutDataUpdated', { detail: { key, data } }));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
}

// Sections functions
export function getSections(): AboutSection[] {
  return getStorageData(ABOUT_SECTIONS_KEY, defaultSections);
}

export function setSections(sections: AboutSection[]): void {
  setStorageData(ABOUT_SECTIONS_KEY, sections);
}

export function addSection(section: Omit<AboutSection, 'id'>): AboutSection {
  const sections = getSections();
  const newSection: AboutSection = {
    ...section,
    id: Date.now().toString()
  };
  const updatedSections = [...sections, newSection];
  setSections(updatedSections);
  return newSection;
}

export function updateSection(id: string, updates: Partial<AboutSection>): AboutSection | null {
  const sections = getSections();
  const updatedSections = sections.map(section => 
    section.id === id ? { ...section, ...updates } : section
  );
  setSections(updatedSections);
  return updatedSections.find(s => s.id === id) || null;
}

export function deleteSection(id: string): void {
  const sections = getSections();
  const updatedSections = sections.filter(section => section.id !== id);
  setSections(updatedSections);
}

export function toggleSectionVisibility(id: string): void {
  const sections = getSections();
  const updatedSections = sections.map(section => 
    section.id === id ? { ...section, isVisible: !section.isVisible } : section
  );
  setSections(updatedSections);
}

// Skills functions
export function getSkills(): TechSkill[] {
  return getStorageData(TECH_SKILLS_KEY, defaultSkills);
}

export function setSkills(skills: TechSkill[]): void {
  setStorageData(TECH_SKILLS_KEY, skills);
}

export function addSkill(skill: Omit<TechSkill, 'id'>): TechSkill {
  const skills = getSkills();
  const newSkill: TechSkill = {
    ...skill,
    id: Date.now().toString()
  };
  const updatedSkills = [...skills, newSkill];
  setSkills(updatedSkills);
  return newSkill;
}

export function updateSkill(id: string, updates: Partial<TechSkill>): TechSkill | null {
  const skills = getSkills();
  const updatedSkills = skills.map(skill => 
    skill.id === id ? { ...skill, ...updates } : skill
  );
  setSkills(updatedSkills);
  return updatedSkills.find(s => s.id === id) || null;
}

export function deleteSkill(id: string): void {
  const skills = getSkills();
  const updatedSkills = skills.filter(skill => skill.id !== id);
  setSkills(updatedSkills);
}

export function toggleSkillVisibility(id: string): void {
  const skills = getSkills();
  const updatedSkills = skills.map(skill => 
    skill.id === id ? { ...skill, isVisible: !skill.isVisible } : skill
  );
  setSkills(updatedSkills);
}

// Education functions
export function getEducation(): Education[] {
  return getStorageData(EDUCATION_KEY, defaultEducation);
}

export function setEducation(education: Education[]): void {
  setStorageData(EDUCATION_KEY, education);
}

export function addEducation(edu: Omit<Education, 'id'>): Education {
  const education = getEducation();
  const newEdu: Education = {
    ...edu,
    id: Date.now().toString()
  };
  const updatedEducation = [...education, newEdu];
  setEducation(updatedEducation);
  return newEdu;
}

export function updateEducation(id: string, updates: Partial<Education>): Education | null {
  const education = getEducation();
  const updatedEducation = education.map(edu => 
    edu.id === id ? { ...edu, ...updates } : edu
  );
  setEducation(updatedEducation);
  return updatedEducation.find(e => e.id === id) || null;
}

export function deleteEducation(id: string): void {
  const education = getEducation();
  const updatedEducation = education.filter(edu => edu.id !== id);
  setEducation(updatedEducation);
}

export function toggleEducationVisibility(id: string): void {
  const education = getEducation();
  const updatedEducation = education.map(edu => 
    edu.id === id ? { ...edu, isVisible: !edu.isVisible } : edu
  );
  setEducation(updatedEducation);
}

// دالة لإعادة تعيين البيانات إلى القيم الافتراضية
export function resetEducationToDefault(): void {
  localStorage.removeItem(EDUCATION_KEY);
  window.dispatchEvent(new CustomEvent('aboutDataUpdated'));
}

// Certifications functions
export function getCertifications(): Certification[] {
  return getStorageData(CERTIFICATIONS_KEY, defaultCertifications);
}

export function setCertifications(certifications: Certification[]): void {
  setStorageData(CERTIFICATIONS_KEY, certifications);
}

export function addCertification(cert: Omit<Certification, 'id'>): Certification {
  const certifications = getCertifications();
  const newCert: Certification = {
    ...cert,
    id: Date.now().toString()
  };
  const updatedCertifications = [...certifications, newCert];
  setCertifications(updatedCertifications);
  return newCert;
}

export function updateCertification(id: string, updates: Partial<Certification>): Certification | null {
  const certifications = getCertifications();
  const updatedCertifications = certifications.map(cert => 
    cert.id === id ? { ...cert, ...updates } : cert
  );
  setCertifications(updatedCertifications);
  return updatedCertifications.find(c => c.id === id) || null;
}

export function deleteCertification(id: string): void {
  const certifications = getCertifications();
  const updatedCertifications = certifications.filter(cert => cert.id !== id);
  setCertifications(updatedCertifications);
}

export function toggleCertificationVisibility(id: string): void {
  const certifications = getCertifications();
  const updatedCertifications = certifications.map(cert => 
    cert.id === id ? { ...cert, isVisible: !cert.isVisible } : cert
  );
  setCertifications(updatedCertifications);
} 