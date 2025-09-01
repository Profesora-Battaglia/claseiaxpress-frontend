export enum Tool {
    DASHBOARD = 'dashboard',
    CHATBOT = 'chatbot',
    PLANNER = 'planner',
    ANNUAL_PLANNER = 'annual_planner',
    QUARTERLY_PLANNER = 'quarterly_planner',
    RUBRICS = 'rubrics',
    ABP = 'abp',
    EVENTS = 'events',
    ADAPTATIONS = 'adaptations',
    GAMIFICATION = 'gamification',
    QUIZ_GENERATOR = 'quiz_generator',
    FEEDBACK_ASSISTANT = 'feedback_assistant',
    TEXT_SIMPLIFIER = 'text_simplifier',
    PROGRESS_REPORT = 'progress_report',
    DIDACTIC_SEQUENCE = 'didactic_sequence',
    PARENT_NEWSLETTER = 'parent_newsletter',
    HISTORY = 'history',
    RESOURCES = 'resources',
    PROFILE = 'profile',
    USER_GUIDE = 'user_guide',
}

export enum ToolCategory {
    CORE = 'Core',
    PLANNING = 'Planificación',
    EVALUATION = 'Evaluación y Seguimiento',
    CLASSROOM_RESOURCES = 'Recursos para el Aula',
    COMMUNICATION = 'Comunicación',
}

export interface FormField {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select';
    placeholder: string;
    options?: string[];
    required: boolean;
}

export interface ToolDetail {
    id: Tool;
    title: string;
    description: string;
    promptInstruction: string;
    formFields: FormField[];
    category: ToolCategory;
}

export interface SavedContent {
    id: string;
    toolId: Tool;
    toolTitle: string;
    content: string;
    formData: Record<string, string>;
    timestamp: number;
}

interface ImportMetaEnv {
  VITE_BACKEND_URL: string;
  VITE_BACKEND_CHAT_URL: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}