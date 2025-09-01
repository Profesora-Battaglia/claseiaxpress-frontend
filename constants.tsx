import React from 'react';
import { Tool, ToolDetail, ToolCategory } from './types';
import {
    FiGrid,
    FiMessageSquare,
    FiClock,
    FiCalendar,
    FiBookOpen,
    FiClipboard,
    FiCheckSquare,
    FiBox,
    FiGift,
    FiStar,
    FiAward,
    FiHelpCircle,
    FiEdit,
    FiMinimize2,
    FiTrendingUp,
    FiArrowRight,
    FiMail
} from 'react-icons/fi';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`font-bold text-2xl text-white ${className}`}>
        ClaseIaXpress
    </div>
);

export const navLinks = [
    { id: Tool.DASHBOARD, label: 'Panel Principal', icon: FiGrid },
    { id: Tool.CHATBOT, label: 'ChatBot Pedagógico', icon: FiMessageSquare },
    { id: Tool.HISTORY, label: 'Historial', icon: FiClock },
    { id: Tool.USER_GUIDE, label: 'Guía de Usuario', icon: FiHelpCircle },
    { id: Tool.PLANNER, label: 'Planificador de Clases', icon: FiCalendar },
    { id: Tool.DIDACTIC_SEQUENCE, label: 'Secuencias Didácticas', icon: FiArrowRight },
    { id: Tool.ANNUAL_PLANNER, label: 'Planificador Anual', icon: FiBookOpen },
    { id: Tool.QUARTERLY_PLANNER, label: 'Planificador Trimestral', icon: FiClipboard },
    { id: Tool.RUBRICS, label: 'Generador de Rúbricas', icon: FiCheckSquare },
    { id: Tool.QUIZ_GENERATOR, label: 'Generador de Cuestionarios', icon: FiHelpCircle },
    { id: Tool.FEEDBACK_ASSISTANT, label: 'Asistente de Retroalimentación', icon: FiEdit },
    { id: Tool.PROGRESS_REPORT, label: 'Informes de Progreso', icon: FiTrendingUp },
    { id: Tool.ADAPTATIONS, label: 'Adaptaciones NEE', icon: FiStar },
    { id: Tool.TEXT_SIMPLIFIER, label: 'Adaptador de Textos', icon: FiMinimize2 },
    { id: Tool.GAMIFICATION, label: 'Ideas de Gamificación', icon: FiAward },
    { id: Tool.ABP, label: 'Generador de ABP', icon: FiBox },
    { id: Tool.PARENT_NEWSLETTER, label: 'Boletín para Padres', icon: FiMail },
    { id: Tool.EVENTS, label: 'Generador de Actos', icon: FiGift },
];

export const niveles = ["Primaria", "Secundaria Orientada", "Secundaria Técnica"];
export const modalidadesSecundaria = ["Ciencias Sociales y Humanidades", "Ciencias Naturales", "Economía y Administración", "Lenguas", "Arte", "Turismo", "Comunicación"];
export const modalidadesTecnica = ["Técnico en Programación", "Técnico en Electrónica", "Técnico en Química", "Técnico en Construcciones", "Técnico en Mecánica", "Técnico Agropecuario"];

const longTermPlannerPrompt = (period: 'Anual' | 'Trimestral') => `Actúa como un experto en planificación curricular para la DGE Mendoza. Genera una Planificación ${period} en formato HTML. La estructura debe ser la siguiente:
1. En la parte superior, fuera de la tabla, desarrolla dos secciones: un <h2>Fundamentación del Área</h2> seguido de un párrafo <p> bien desarrollado basado en las ideas proporcionadas; y un <h2>Acuerdos Institucionales</h2> seguido de un párrafo <p> basado en los puntos proporcionados.
2. A continuación, crea una tabla HTML (<table>) con el siguiente encabezado (<thead><tr><th>Eje</th><th>Saberes</th><th>Aprendizajes prioritarios</th><th>Aprendizajes específicos</th><th>Metodología de enseñanza</th><th>Tiempo</th><th>Evaluación (Criterios e Instrumentos)</th></tr></thead>).
3. Completa el cuerpo de la tabla (<tbody>) con al menos una fila (<tr>) por cada eje principal proporcionado, desarrollando contenido coherente y detallado para cada columna. El contenido de las celdas debe ser sustancial.
4. El resultado debe ser solo el código HTML del cuerpo, sin etiquetas <html>, <head>, <body> o (bloque de código html).`;

export const toolDetails: Record<Tool, ToolDetail> = {
    [Tool.DASHBOARD]: { id: Tool.DASHBOARD, title: 'Panel Principal', description: '', promptInstruction: '', formFields: [], category: ToolCategory.CORE },
    [Tool.CHATBOT]: { id: Tool.CHATBOT, title: 'ChatBot Pedagógico', description: '', promptInstruction: '', formFields: [], category: ToolCategory.CORE },
    [Tool.HISTORY]: { id: Tool.HISTORY, title: 'Historial de Contenido', description: 'Revisa y gestiona tus creaciones guardadas.', promptInstruction: '', formFields: [], category: ToolCategory.CORE },
    [Tool.PLANNER]: {
        id: Tool.PLANNER,
        title: 'Planificador de Clases',
        description: 'Crea planificaciones de clases detalladas y alineadas con el currículo de la DGE Mendoza.',
        promptInstruction: 'Genera una planificación de clase detallada para el currículo de DGE Mendoza, con los siguientes parámetros:',
        formFields: [
            { id: 'nivel', label: 'Nivel Educativo', type: 'select', placeholder: 'Selecciona el nivel', options: niveles, required: true },
            { id: 'modalidad', label: 'Modalidad', type: 'select', placeholder: 'Selecciona la modalidad', options: [], required: false },
            { id: 'gradoAnio', label: 'Grado/Año', type: 'text', placeholder: 'Ej: 7mo Grado, 4to Año', required: true },
            { id: 'materia', label: 'Materia / Espacio Curricular', type: 'text', placeholder: 'Ej: Matemática, Historia', required: true },
            { id: 'tema', label: 'Tema Principal', type: 'text', placeholder: 'Ej: Ecuaciones de primer grado', required: true },
            { id: 'duracion', label: 'Duración', type: 'text', placeholder: 'Ej: 80 minutos, 2 clases', required: true },
            { id: 'objetivos', label: 'Objetivos de Aprendizaje', type: 'textarea', placeholder: 'Describe qué deben aprender los estudiantes', required: true },
        ],
        category: ToolCategory.PLANNING
    },
    [Tool.DIDACTIC_SEQUENCE]: {
        id: Tool.DIDACTIC_SEQUENCE,
        title: 'Creador de Secuencias Didácticas',
        description: 'Planifica unidades temáticas completas, con una progresión lógica de clases y actividades.',
        promptInstruction: 'Actúa como un experto en diseño curricular y pedagogía para el sistema educativo argentino. Tu objetivo es crear una secuencia didáctica coherente y progresiva para una unidad temática completa. Basado en los siguientes parámetros, genera una propuesta que divida la unidad en el número de clases especificado. Para cada clase, debes definir: 1) Un objetivo de aprendizaje claro y conciso. 2) Una descripción de las actividades principales (inicio, desarrollo, cierre), sugiriendo un flujo lógico desde la introducción de conceptos hasta la aplicación y evaluación. 3) Opcionalmente, puedes sugerir el uso de otras herramientas de ClaseIaXpress (como Generador de Rúbricas, Ideas de Gamificación, etc.) en las clases que consideres apropiado. El resultado debe ser un plan estructurado en HTML, usando <h2> para cada clase y listas para detallar los componentes.',
        formFields: [
            { id: 'mainTopic', label: 'Tema / Unidad Principal', type: 'text', placeholder: 'Ej: El sistema circulatorio', required: true },
            { id: 'gradeYear', label: 'Grado/Año', type: 'text', placeholder: 'Ej: 6to Grado', required: true },
            { id: 'subject', label: 'Materia / Espacio Curricular', type: 'text', placeholder: 'Ej: Ciencias Naturales', required: true },
            { id: 'classCount', label: 'Cantidad de Clases', type: 'text', placeholder: 'Ej: 4', required: true },
            { id: 'generalObjectives', label: 'Objetivos Generales de la Unidad', type: 'textarea', placeholder: 'Ej: Comprender la función del corazón y los vasos sanguíneos, identificar los componentes de la sangre...', required: true },
        ],
        category: ToolCategory.PLANNING
    },
    [Tool.ANNUAL_PLANNER]: {
        id: Tool.ANNUAL_PLANNER,
        title: 'Planificador Anual',
        description: 'Genera una planificación anual completa con fundamentación, acuerdos y tabla de contenidos curriculares.',
        promptInstruction: longTermPlannerPrompt('Anual'),
        formFields: [
            { id: 'nivel', label: 'Nivel Educativo', type: 'select', placeholder: 'Selecciona el nivel', options: niveles, required: true },
            { id: 'modalidad', label: 'Modalidad', type: 'select', placeholder: 'Selecciona la modalidad', options: [], required: false },
            { id: 'gradoAnio', label: 'Grado/Año', type: 'text', placeholder: 'Ej: 2do Año', required: true },
            { id: 'materia', label: 'Materia / Espacio Curricular', type: 'text', placeholder: 'Ej: Biología', required: true },
            { id: 'fundamentacionIdeas', label: 'Ideas clave para la Fundamentación', type: 'textarea', placeholder: 'Ej: Enfoque en el pensamiento crítico, conexión con la vida cotidiana...', required: true },
            { id: 'acuerdosIdeas', label: 'Puntos clave para Acuerdos Institucionales', type: 'textarea', placeholder: 'Ej: Criterios de evaluación comunes, proyectos interdisciplinarios...', required: true },
            { id: 'ejesAnuales', label: 'Ejes principales del año (separados por comas)', type: 'textarea', placeholder: 'Ej: Célula y material genético, Sistemas de órganos, Ecología...', required: true },
        ],
        category: ToolCategory.PLANNING
    },
    [Tool.QUARTERLY_PLANNER]: {
        id: Tool.QUARTERLY_PLANNER,
        title: 'Planificador Trimestral',
        description: 'Genera una planificación trimestral detallada, ideal para organizar a mediano plazo.',
        promptInstruction: longTermPlannerPrompt('Trimestral'),
        formFields: [
            { id: 'trimestre', label: 'Trimestre', type: 'select', placeholder: 'Selecciona el trimestre', options: ['1er Trimestre', '2do Trimestre', '3er Trimestre'], required: true },
            { id: 'nivel', label: 'Nivel Educativo', type: 'select', placeholder: 'Selecciona el nivel', options: niveles, required: true },
            { id: 'modalidad', label: 'Modalidad', type: 'select', placeholder: 'Selecciona la modalidad', options: [], required: false },
            { id: 'gradoAnio', label: 'Grado/Año', type: 'text', placeholder: 'Ej: 2do Año', required: true },
            { id: 'materia', label: 'Materia / Espacio Curricular', type: 'text', placeholder: 'Ej: Biología', required: true },
            { id: 'fundamentacionIdeas', label: 'Ideas clave para la Fundamentación del trimestre', type: 'textarea', placeholder: 'Ej: Profundizar en la experimentación científica...', required: true },
            { id: 'acuerdosIdeas', label: 'Puntos clave para Acuerdos Institucionales del trimestre', type: 'textarea', placeholder: 'Ej: Fechas de entrega de trabajos prácticos, articulación con TICs...', required: true },
            { id: 'ejesTrimestrales', label: 'Ejes principales del trimestre (separados por comas)', type: 'textarea', placeholder: 'Ej: Célula y material genético, Herencia...', required: true },
        ],
        category: ToolCategory.PLANNING
    },
    [Tool.RUBRICS]: {
        id: Tool.RUBRICS,
        title: 'Generador de Rúbricas',
        description: 'Diseña rúbricas de evaluación claras y efectivas para cualquier actividad o proyecto.',
        promptInstruction: 'Crea una rúbrica de evaluación detallada con los siguientes criterios. Importante: El HTML generado no debe contener ninguna etiqueta <link> o <style> que importe fuentes externas como Google Fonts.',
        formFields: [
            { id: 'actividad', label: 'Actividad a Evaluar', type: 'text', placeholder: 'Ej: Ensayo sobre la Revolución de Mayo', required: true },
            { id: 'nivel', label: 'Nivel Educativo', type: 'select', placeholder: 'Selecciona el nivel', options: niveles, required: true },
            { id: 'criterios', label: 'Criterios de Evaluación (separados por comas)', type: 'textarea', placeholder: 'Ej: Claridad de la escritura, Uso de fuentes, Argumentación, Organización', required: true },
            { id: 'nivelesDesempeno', label: 'Niveles de Desempeño (separados por comas)', type: 'text', placeholder: 'Ej: Excelente, Bueno, Suficiente, Insuficiente', required: true },
        ],
        category: ToolCategory.EVALUATION
    },
    [Tool.QUIZ_GENERATOR]: {
        id: Tool.QUIZ_GENERATOR,
        title: 'Generador de Cuestionarios',
        description: 'Crea preguntas de opción múltiple a partir de cualquier texto para evaluar la comprensión.',
        promptInstruction: 'Actúa como un experto en evaluación educativa. A partir del siguiente texto, genera un cuestionario de opción múltiple. Cada pregunta debe tener 4 opciones (A, B, C, D), y solo una debe ser correcta. Al final de cada pregunta, indica claramente cuál es la respuesta correcta entre paréntesis. Por ejemplo: (Respuesta: C).',
        formFields: [
            { id: 'texto', label: 'Texto base', type: 'textarea', placeholder: 'Pega aquí el texto del cual quieres generar las preguntas...', required: true },
            { id: 'cantidadPreguntas', label: 'Número de preguntas', type: 'text', placeholder: 'Ej: 5', required: true },
            { id: 'nivel', label: 'Nivel de dificultad', type: 'select', placeholder: 'Selecciona el nivel', options: ['Fácil', 'Intermedio', 'Difícil'], required: true },
        ],
        category: ToolCategory.EVALUATION
    },
    [Tool.FEEDBACK_ASSISTANT]: {
        id: Tool.FEEDBACK_ASSISTANT,
        title: 'Asistente de Retroalimentación',
        description: 'Genera feedback constructivo y personalizado para los trabajos de tus estudiantes.',
        promptInstruction: 'Actúa como un docente experimentado y empático. Proporciona retroalimentación constructiva sobre el trabajo de un estudiante, basándote en los criterios de evaluación proporcionados. El feedback debe ser claro, específico y accionable. Comienza destacando al menos una fortaleza específica y luego sugiere 2 o 3 áreas claras de mejora, ofreciendo ejemplos o preguntas para guiar al estudiante.',
        formFields: [
            { id: 'trabajoEstudiante', label: 'Trabajo del estudiante', type: 'textarea', placeholder: 'Pega aquí el texto o la descripción del trabajo del estudiante.', required: true },
            { id: 'criteriosEvaluacion', label: 'Criterios de evaluación o consigna', type: 'textarea', placeholder: 'Ej: Se evaluará la coherencia, el uso de vocabulario y la estructura del ensayo.', required: true },
            { id: 'tono', label: 'Tono del feedback', type: 'select', placeholder: 'Selecciona el tono', options: ['Constructivo y motivador', 'Formal y directo', 'Cercano y amigable'], required: true },
        ],
        category: ToolCategory.EVALUATION
    },
    [Tool.PROGRESS_REPORT]: {
        id: Tool.PROGRESS_REPORT,
        title: 'Informes de Progreso',
        description: 'Redacta informes de progreso constructivos y personalizados para tus estudiantes en segundos.',
        promptInstruction: 'Actúa como un docente experimentado, empático y con excelentes habilidades de comunicación. Tu tarea es redactar un informe de progreso para un estudiante. Utiliza un lenguaje claro, constructivo y profesional. Debes comenzar siempre destacando las fortalezas observadas para reforzar positivamente al estudiante. Luego, aborda las áreas de mejora de manera específica y accionable, ofreciendo sugerencias o preguntas que guíen al estudiante y a su familia, en lugar de solo señalar falencias. Adapta tu redacción al tono solicitado. El resultado debe ser un párrafo o dos bien cohesionados.',
        formFields: [
            { id: 'studentName', label: 'Nombre del Estudiante', type: 'text', placeholder: 'Ej: Ana Pérez', required: true },
            { id: 'strengths', label: 'Fortalezas Observadas', type: 'textarea', placeholder: 'Ej: Gran curiosidad, excelente trabajo en equipo, presenta sus trabajos de forma prolija...', required: true },
            { id: 'areasForImprovement', label: 'Áreas de Mejora', type: 'textarea', placeholder: 'Ej: Necesita mejorar la participación oral, debe revisar la ortografía con más atención...', required: true },
            { id: 'tone', label: 'Tono del Informe', type: 'select', placeholder: 'Selecciona el tono', options: ['Formal y objetivo', 'Cercano y alentador', 'Directo y conciso'], required: true },
        ],
        category: ToolCategory.COMMUNICATION
    },
    [Tool.PARENT_NEWSLETTER]: {
        id: Tool.PARENT_NEWSLETTER,
        title: 'Boletín para Padres',
        description: 'Comunica de forma efectiva las novedades y próximos eventos a las familias de tus estudiantes.',
        promptInstruction: 'Actúa como un comunicador escolar amable y eficiente. Tu tarea es redactar un boletín informativo para padres, convirtiendo una lista de puntos en un texto cohesivo, cálido y fácil de leer. El boletín debe tener un tono positivo y proactivo. Estructura la respuesta en HTML con secciones claras, por ejemplo, usando <h2> para "Resumen de la Semana", "Próximas Fechas" y "Notas Importantes". Asegúrate de que el lenguaje sea accesible para todas las familias.',
        formFields: [
            { id: 'period', label: 'Período del Boletín', type: 'text', placeholder: 'Ej: Semana del 1 al 5 de Abril, Mes de Mayo', required: true },
            { id: 'topicsCovered', label: 'Temas Principales Cubiertos (en lista)', type: 'textarea', placeholder: `- Estudiamos los planetas del sistema solar.
- Practicamos las tablas de multiplicar.
- Leímos el primer capítulo de...`, required: true },
            { id: 'upcomingDates', label: 'Fechas Importantes y Recordatorios (en lista)', type: 'textarea', placeholder: `- 15/04: Prueba de Lengua.
- 18/04: Salida educativa al museo (enviar autorización).
- No olvidar traer el cuaderno de comunicaciones.`, required: true },
            { id: 'specialMessage', label: 'Mensaje o Nota Especial (opcional)', type: 'textarea', placeholder: 'Ej: ¡Quería felicitar a toda la clase por el excelente comportamiento durante la visita de la semana pasada!', required: false },
        ],
        category: ToolCategory.COMMUNICATION
    },
    [Tool.ADAPTATIONS]: {
        id: Tool.ADAPTATIONS,
        title: 'Adaptaciones Curriculares (NEE)',
        description: 'Crea adaptaciones curriculares e ideas de actividades inclusivas para estudiantes con Necesidades Educativas Especiales.',
        promptInstruction: 'Actúa como una psicopedagoga experta en educación inclusiva. Genera una propuesta de adaptación curricular y al menos 3 ideas de actividades inclusivas para un estudiante con Necesidades Educativas Especiales (NEE), basándote en la siguiente información. La propuesta debe ser práctica, respetuosa y centrada en las fortalezas del estudiante. Incluye estrategias de acceso, adaptación de materiales y evaluación diferenciada.',
        formFields: [
            { id: 'nivel', label: 'Nivel Educativo', type: 'select', placeholder: 'Selecciona el nivel', options: niveles, required: true },
            { id: 'gradoAnio', label: 'Grado/Año', type: 'text', placeholder: 'Ej: 3er Grado, 2do Año', required: true },
            { id: 'materia', label: 'Materia / Espacio Curricular', type: 'text', placeholder: 'Ej: Lengua y Literatura', required: true },
            { id: 'tema', label: 'Tema Específico', type: 'text', placeholder: 'Ej: Comprensión de textos narrativos', required: true },
            { id: 'caracteristicasNEE', label: 'Características del Estudiante y/o NEE', type: 'textarea', placeholder: 'Ej: TDAH con dificultades en la atención sostenida, Dislexia, TEA con intereses específicos en dinosaurios, etc.', required: true },
            { id: 'objetivos', label: 'Objetivos de Aprendizaje a Adaptar', type: 'textarea', placeholder: 'Describe los objetivos originales que necesitas adaptar para el estudiante', required: true },
        ],
        category: ToolCategory.CLASSROOM_RESOURCES
    },
    [Tool.TEXT_SIMPLIFIER]: {
        id: Tool.TEXT_SIMPLIFIER,
        title: 'Adaptador de Textos',
        description: 'Adapta textos a un lenguaje más simple, más avanzado o para necesidades específicas.',
        promptInstruction: 'Actúa como un especialista en adaptación de contenidos. Tu tarea es transformar el texto proporcionado según la acción solicitada. El resultado debe ser coherente, bien estructurado y mantener la información clave del original.',
        formFields: [
            { id: 'textoOriginal', label: 'Texto original', type: 'textarea', placeholder: 'Pega aquí el texto que deseas adaptar.', required: true },
            { id: 'accion', label: 'Acción a realizar', type: 'select', placeholder: 'Selecciona qué hacer con el texto', options: ['Simplificar', 'Complejizar', 'Sugerir Adaptaciones para NEE'], required: true },
            { id: 'nivelDestino', label: 'Nivel educativo de destino', type: 'select', placeholder: 'Selecciona el nivel', options: ['Primaria (Primer Ciclo)', 'Primaria (Segundo Ciclo)', 'Secundaria (Ciclo Básico)', 'Secundaria (Ciclo Orientado)'], required: true },
            { id: 'detallesNEE', label: 'Características del estudiante (si aplica)', type: 'textarea', placeholder: 'Si elegiste "Sugerir Adaptaciones para NEE", describe brevemente las características del estudiante aquí...', required: false },
        ],
        category: ToolCategory.CLASSROOM_RESOURCES
    },
    [Tool.GAMIFICATION]: {
        id: Tool.GAMIFICATION,
        title: 'Ideas de Gamificación',
        description: 'Transforma tus clases con estrategias de juego para aumentar la participación y motivación de los estudiantes.',
        promptInstruction: 'Actúa como un diseñador de experiencias de aprendizaje experto en gamificación. Genera 3 ideas creativas y detalladas para gamificar una clase según los siguientes parámetros. Para cada idea, describe: 1) El nombre de la actividad/juego. 2) El objetivo de aprendizaje principal. 3) La mecánica del juego (reglas, cómo se juega, sistema de puntos/recompensas). 4) Cómo se conecta con el tema de la clase. Formatea la respuesta en HTML bien estructurado, usando <h2> para el nombre de cada idea y <strong> para los subtítulos (Objetivo, Mecánica, Conexión).',
        formFields: [
            { id: 'materia', label: 'Materia / Espacio Curricular', type: 'text', placeholder: 'Ej: Literatura, Física', required: true },
            { id: 'gradoAnio', label: 'Grado/Año', type: 'text', placeholder: 'Ej: 3er Grado, 2do Año', required: true },
            { id: 'tema', label: 'Tema Específico a Gamificar', type: 'text', placeholder: 'Ej: El sistema solar, Verbos irregulares', required: true },
            { id: 'duracion', label: 'Duración de la actividad', type: 'text', placeholder: 'Ej: 45 minutos, una semana', required: true },
            { id: 'objetivoPrincipal', label: 'Objetivo de Aprendizaje principal', type: 'textarea', placeholder: 'Ej: Que los estudiantes puedan identificar las partes de una célula.', required: true },
        ],
        category: ToolCategory.CLASSROOM_RESOURCES
    },
    [Tool.ABP]: {
        id: Tool.ABP,
        title: 'Generador de Proyectos (ABP)',
        description: 'Obtén ideas y estructuras completas para proyectos ABP innovadores y relevantes.',
        promptInstruction: 'Desarrolla una propuesta de Aprendizaje Basado en Proyectos (ABP) para DGE Mendoza, considerando:',
        formFields: [
            { id: 'area', label: 'Área de Conocimiento Principal', type: 'text', placeholder: 'Ej: Ciencias Naturales, Tecnología', required: true },
            { id: 'gradoAnio', label: 'Grado/Año', type: 'text', placeholder: 'Ej: 1er Año, 5to Grado', required: true },
            { id: 'tematica', label: 'Temática o Problema Central', type: 'textarea', placeholder: 'Ej: La escasez de agua en Mendoza y sus soluciones tecnológicas', required: true },
            { id: 'duracion', label: 'Duración Estimada del Proyecto', type: 'text', placeholder: 'Ej: 4 semanas', required: true },
        ],
        category: ToolCategory.CLASSROOM_RESOURCES
    },
    [Tool.EVENTS]: {
        id: Tool.EVENTS,
        title: 'Guiones para Actos Escolares',
        description: 'Crea guiones para actos escolares (Forma 1, 2 y 3) según el calendario escolar de Mendoza.',
        promptInstruction: 'Redacta un guion para un acto escolar, según el calendario de la DGE Mendoza, con las siguientes especificaciones:',
        formFields: [
            { id: 'efemeride', label: 'Efeméride o Motivo del Acto', type: 'text', placeholder: 'Ej: Día de la Bandera, 25 de Mayo', required: true },
            { id: 'forma', label: 'Forma del Acto', type: 'select', placeholder: 'Selecciona la forma', options: ['Forma 1 (Solemne)', 'Forma 2 (Formal)', 'Forma 3 (Didáctico)'], required: true },
            { id: 'nivel', label: 'Nivel Educativo Involucrado', type: 'select', placeholder: 'Selecciona el nivel', options: niveles, required: true },
            { id: 'ideasClave', label: 'Ideas Clave o Enfoque', type: 'textarea', placeholder: 'Ej: Resaltar el rol de las mujeres en la independencia, Enfoque en la diversidad cultural', required: false },
        ],
        category: ToolCategory.COMMUNICATION
    },
    [Tool.RESOURCES]: { id: Tool.RESOURCES, title: 'Biblioteca de Recursos', description: '', promptInstruction: '', formFields: [], category: ToolCategory.CORE },
    [Tool.PROFILE]: { id: Tool.PROFILE, title: 'Perfil de Usuario', description: '', promptInstruction: '', formFields: [], category: ToolCategory.CORE },
};
