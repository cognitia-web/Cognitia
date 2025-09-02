export const LEVEL_THRESHOLDS = [
  {
    name: "Bronze",
    threshold: 100,
    icon: "fas fa-medal",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
    textColor: "text-orange-800",
    subTextColor: "text-orange-600",
  },
  {
    name: "Silver", 
    threshold: 250,
    icon: "fas fa-award",
    bgColor: "bg-gray-100",
    iconColor: "text-gray-600",
    textColor: "text-gray-800",
    subTextColor: "text-gray-600",
  },
  {
    name: "Gold",
    threshold: 500,
    icon: "fas fa-crown",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
    textColor: "text-yellow-800",
    subTextColor: "text-yellow-600",
  },
  {
    name: "Platinum",
    threshold: 1500,
    icon: "fas fa-gem",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
    textColor: "text-purple-800",
    subTextColor: "text-purple-600",
  },
  {
    name: "Diamond",
    threshold: 2500,
    icon: "fas fa-diamond",
    bgColor: "bg-blue-100", 
    iconColor: "text-blue-600",
    textColor: "text-blue-800",
    subTextColor: "text-blue-600",
  },
  {
    name: "Obsidian",
    threshold: 3500,
    icon: "fas fa-mountain",
    bgColor: "bg-slate-100",
    iconColor: "text-slate-600",
    textColor: "text-slate-800",
    subTextColor: "text-slate-600",
  },
  {
    name: "Titanium",
    threshold: 4500,
    icon: "fas fa-shield-alt",
    bgColor: "bg-zinc-100",
    iconColor: "text-zinc-600", 
    textColor: "text-zinc-800",
    subTextColor: "text-zinc-600",
  },
  {
    name: "Quantum",
    threshold: 5500,
    icon: "fas fa-atom",
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
    textColor: "text-indigo-800", 
    subTextColor: "text-indigo-600",
  },
  {
    name: "Omega",
    threshold: 6500,
    icon: "fas fa-infinity",
    bgColor: "bg-violet-100",
    iconColor: "text-violet-600",
    textColor: "text-violet-800",
    subTextColor: "text-violet-600",
  },
  {
    name: "Energon",
    threshold: 7500,
    icon: "fas fa-bolt",
    bgColor: "bg-gradient-to-br from-yellow-100 to-orange-100",
    iconColor: "text-orange-600",
    textColor: "text-orange-800",
    subTextColor: "text-orange-600",
  },
];

export const SUBJECTS = [
  "Mathematics",
  "Physics", 
  "Chemistry",
  "Biology",
  "History",
  "English",
  "Computer Science",
  "Psychology",
  "Economics",
  "Philosophy",
  "Art",
  "Music",
  "Other",
];

export const TASK_INTENSITIES = [
  { value: "Low", label: "Low", color: "text-green-600", bgColor: "bg-green-50" },
  { value: "Medium", label: "Medium", color: "text-yellow-600", bgColor: "bg-yellow-50" },
  { value: "High", label: "High", color: "text-red-600", bgColor: "bg-red-50" },
];

export const AI_MODELS = {
  flashcards: [
    { value: "gpt-4", label: "GPT-4" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
    { value: "claude-3-sonnet", label: "Claude-3 Sonnet" },
    { value: "gemini-pro", label: "Gemini Pro" },
  ],
  qa: [
    { value: "gpt-4", label: "GPT-4" },
    { value: "claude-3-opus", label: "Claude-3 Opus" },
    { value: "gemini-ultra", label: "Gemini Ultra" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  ],
};

export const QA_MODES = [
  { 
    value: "concise", 
    label: "Concise", 
    description: "Clear, direct answers" 
  },
  { 
    value: "eli15", 
    label: "ELI15", 
    description: "Simple explanations for 15-year-olds" 
  },
  { 
    value: "exam_style", 
    label: "Exam-Style", 
    description: "Comprehensive answers with examples" 
  },
];

export const SPACED_REPETITION_INTERVALS = [1, 3, 7, 14, 30, 60, 120];

export const POINT_REWARDS = {
  TASK_CREATED: 10,
  TASK_COMPLETED_LOW: 25,
  TASK_COMPLETED_MEDIUM: 50, 
  TASK_COMPLETED_HIGH: 75,
  FLASHCARD_CORRECT: 10,
  DECK_MASTERED: 250,
  REVISION_COMPLETED: 100,
  STREAK_BONUS_BASE: 25,
};
