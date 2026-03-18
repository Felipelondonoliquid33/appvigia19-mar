export const translations = {
    es: {
        login: {
            title: "INICIAR",
            user: "Usuario",
            password: "Contraseña",
            forgot: "¿Olvidaste tu contraseña?",
            signIn: "Iniciar Sesión",
            createAccount: "Crear Cuenta",
            warn: "Advertencia",
            authError: "Autenticación Incorrecta",
            serverError: "Error en el servidor\nContacte al Administrador",
            fillAll: "Completa todos los campos",
            offlineNoUser: "No hay internet y no se consiguió el usuario en el dispositivo",
            offlineTerms: "No hay internet para aceptar los términos y condiciones. Intente más tarde",
            offlineNoTerms: "No hay internet para aceptar los términos y condiciones",
            language: "Idioma",
            spanish: "Español",
            english: "Inglés",
			placeholderUser: "Correo Electrónico",
        },
        welcome: {
            title: "ModoSeguro a un Clic",
            message: "Identifica, protege y actúa\nfrente a la trata de personas en\nentornos digitales.",
        },
        forgot: {
            title: "RECUPERAR CONTRASEÑA",
            description:
                "Ingresa tu correo electrónico y te\nenviaremos un enlace para\nrestablecer tu contraseña.",
            emailPlaceholder: "Correo electrónico",
            icbfNote:
                "Si eres funcionario/a del ICBF y olvidaste tu contraseña, solicita el restablecimiento a mis@icbf.gov.co (Mesa Informática de Soluciones – MIS).",
            sendLink: "Enviar enlace",
            backToLogin: "Volver al inicio de sesión",
            warn: "Advertencia",
            serverError: "Error en el servidor\nContacte al Administrador",
            mustEmail: "Debe indicar el correo electrónico",
            noInternet: "No hay internet para recuperar la contraseña",
			infoOK: "Hemos enviado instrucciones para restablecer tu contraseña. Revisa tu bandeja de entrada o carpeta de spam.",			
        },
        home: {
            title: "BIENVENIDOS Y\nBIENVENIDAS",
            subtitle:
                "Esta es una aplicación educativa para identificar y prevenir riesgos de trata de personas con fines de explotación sexual en entornos digitales.",
            interview: "Formulario de\n Entrevista",
            materials: "Materiales de\n consulta",
            results: "Resultados",
            routes: "Canales y\n reporte",
            footer:
                "Desarrollada por OIM e ICBF para promover el uso seguro y responsable de la tecnología para proteger a niñas, niños y adolescentes.",
        },
        materials: {
            title: "MATERIALES DE CONSULTA",
            searchPlaceholder: "Explorar ahora",
            items: {
                antecedentes: "Antecedentes",
                conceptos: "Conceptos claves sobre tratas en entornos virtuales",
                ampliacion: "Ampliación del alcance del lineamiento técnico",
                rutaProteccion: "Ruta de protección y restablecimiento de derechos",
                rutaEspecializada: "Ruta para la atención especializada",
                restablecimiento: "Restablecimiento de derechos específicos",
                antecedentesDesc: "Descripcion del ítem",
                conceptosDesc: "Descripcion del ítem",
                ampliacionDesc: "Descripcion del ítem",
                rutaProteccionDesc: "Descripcion del ítem",
                restablecimientoDesc: "Descripcion del ítem",
            },
        },
        create: {
            title: "¿NO TIENES CUENTA\nCREADA? CREAR CUENTA",
            subtitle: "Es rápido y fácil",
            names: "Nombres",
            lastNames: "Apellidos",
            email: "Correo electrónico",
            confirmEmail: "Confirmar Correo electrónico",
            phone: "Número de celular",
            institution: "Institución Educativa o Entidad",
            selectRole: "Seleccionar Rol",
            roleExternal: "Funcionarios Externo",
            roleAgent: "Agente Educativo",
            password: "Contraseña",
            confirmPassword: "Confirmar Contraseña",
            agree: "Estoy de acuerdo",
            terms: "Términos y condiciones",
            register: "Registrarme",
            already: "¿Ya tienes cuenta?\nInicia sesión",
            modalTitle: "Términos y Condiciones",
            close: "Cerrar",
            info: "Información",
            warn: "Advertencia",
            infoAt: "ACTIVAR CUENTA",			
			infoOk: "Hemos enviado instrucciones para activar tu cuenta. Revisa tu bandeja de entrada o carpeta de spam.",
            terminoTexto: `
POLÍTICAS, TÉRMINOS Y CONDICIONES DE USO

1. Introducción
El presente documento establece las políticas, términos y condiciones de uso de la aplicación ModoSeguro a un Click…

2. Objetivo de la Aplicación
La Aplicación busca fortalecer las capacidades…

3. Usuarios autorizados
- Funcionarios y contratistas del Sistema Nacional de Bienestar Familiar (ICBF)
- Agentes educativos, orientadores…
  
4. Confidencialidad y tratamiento de datos personales
- No se recolectan datos personales identificables
- Toda la información está codificada y anonimizada…

5. Responsabilidades del usuario
- Garantizar consentimiento informado
- No usar la app con fines judiciales
- Respetar confidencialidad…

6. Seguridad de la información
Incluye autenticación por roles, cifrado, auditoría…

7. Propiedad intelectual
El código, diseño, textos, etc., son propiedad exclusiva…

8. Disponibilidad y soporte
Será garantizada conforme a capacidades técnicas…

9. Actualizaciones
La entidad puede actualizar o modificar cuando sea necesario…

10. Aceptación
El uso de la app implica aceptación total de estos términos.
`,
            errors: {
                weakPassword:"La contraseña debe contener:\n• Al menos 1 letra mayúscula\n• Al menos 1 letra minúscula\n• Al menos 1 número\n• Al menos 1 carácter especial (@$!%*?&.,:;#)\n• Mínimo 8 caracteres.",
                passwordMismatch: "La contraseña y su confirmación no coinciden",
                emailMismatch: "El correo electrónico y su confirmación no coinciden",
                mustAgree: "Debe estar de acuerdo con los términos y condiciones",
                invalidPhone: "El número de celular no es válido",
                invalidEmail: "El correo electrónico no es válido",
                fillAll: "Debe completar todos los campos",
                server: "Error en el servidor\nContacte al Administrador",
            },
        },
        detail: {
            // (no requiere textos fijos, usa detalle.titulo/descripcion)
        },

        terms: {
            title: "CONSENTIMIENTO INFORMADO",
            subtitle: "Privacidad y Uso de Datos",
            p1:
                "Sus respuestas son confidenciales y serán utilizadas de forma anónima para fines de investigación y mejora de la aplicación. Su privacidad es nuestra máxima prioridad.",
            p2:
                "Al continuar, usted confirma que ha leído y entendido la información anterior y es consciente en participar.",
            link:
                "Aceptar. Términos & condiciones\ny políticas de privacidad",
            continue: "Continuar",
            reject: "Rechazar",
            modalTitle: "Términos y Condiciones",
            close: "Cerrar",
            warn: "Advertencia",
            serverError: "Error en el servidor\nContacte al Administrador",
            noInternet: "No hay internet para aceptar los terminos y condiciones",
            noConfigured:
                "No se ha configurado la entrevista\nConsulte al administrador",
            noInternetLater:
                "No hay internet\npara aceptar los terminos y condiciones. Intente más tarde",
        },

        rejected: {
            title: "NO ES POSIBLE\nCONTINUAR",
            p1: "Para usar la aplicación, es necesario aceptar el ",
            consent: "consentimiento informado.",
            p2:
                "La aceptación garantiza que comprende el uso de sus datos y autoriza su tratamiento de manera segura y confidencial.",
            question: "¿Qué puede hacer ahora?",
            back: "Volver al consentimiento",
            exit: "Salir",
        },

        interview: {
            title: "ENTREVISTAS",
            subtitle:
                "Selecciona la versión\nde la entrevista según\n el tipo de usuario al que va dirigida.",
            cards: {
                public: "Versión 3\nFuncionarios Públicos",
                agents: "Versión 4\nNiñas, Niños,\nAdolescentes,\nCuidadores y Padres de\nFamilia",
                kids: "Versión 2\nNiñas, Niños y\nAdolecentes",
                parents: "Versión 1\nMadres, padres y\ncuidadores",
            },
            navTitles: {
                public: "Versión 3\nFuncionarios Públicos",
                agents: "Versión 4\nNiñas, Niños,\nAdolescentes,\nCuidadores y Padres de\nFamilia",
                kids: "Versión 2\nNiñas, Niños y\nAdolecentes",
                parents: "Versión 1\nMadres, padres y\ncuidadores",
            },
            warn: "Advertencia",
            noConfigured:
                "No se ha configurado la entrevista\nConsulte al administrador",
            modalTitle: "Instrucciones",
            close: "Cerrar",
			terminoTexto: "Ejemplo Modal para las instrucciones",
        },
        materialsDetail: {
            seeMore: "Ver más",
        },
        summary: {
            title: "RESUMEN DE RESULTADOS",
            interviews: "Entrevistas",
            completed: "Completas",
            pending: "Pendientes",
            total: "Total",
            riskMin: "Nivel de Riesgo Mínimo",
            riskLow: "Nivel de Riesgo Bajo",
            riskHigh: "Nivel de Riesgo Significativo",
        },
        routes: {
            title: "CANALES y REPORTES",
            download: "Descargar",
			description: "Descripcion",
			  instructions: [
				"Se pueden realizar mediante la Línea 141, las 24 horas del día y los siete días de la semana, o por cualquiera de nuestros canales de atención en los siguientes horarios:",
				"Chat ICBF: Lunes a sábado de 8:00 a.m. a 6:00 p.m.",
				"Página Web: www.icbf.gov.co",
				"WhatsApp: 320 239 16 85; de lunes a viernes de 8:00 a.m. a 5:00 p.m.",
				"Llamada en línea: Lunes a viernes de 8:00 a.m. a 5:00 p.m.",
				"Solicitudes PQRS: 24 horas del día los 7 días de la semana.",
				"Línea Gratuita Nacional: 01-8000-91-8080; de lunes a viernes de 8:00 a.m. a 5:00 p.m.",
				"Libertapp: App de descarga gratuita disponible para iOS y Android.",
				"Ministerio del Interior: Línea Nacional Gratuita 01-8000-52-2020"
			  ]			
        },
        instruction: {
            usageTitle: "Instrucciones de uso:",
            continue: "Continuar",
        },
        assent: {
            title: "ASENTIMIENTO\nINFORMADO",
            accept: "Aceptar",
            reject: "Rechazar",
        },

        assentReject: {
            title: "NO ES POSIBLE\nCONTINUAR",
            p1:
                "Para continuar con la entrevista es necesario aceptar el Asentimiento Informado.",
            p2:
                "Dado que el participante ha rechazado esta autorización, no es posible iniciar el proceso de valoración.",
            p3:
                "Si desea continuar más adelante, podrá volver a la pantalla anterior y revisar nuevamente la información del asentimiento.",
            back: "Volver al Asentimiento",
            exit: "Salir",
        },

        stepCommon: {
            warning: "Advertencia",
            fillAll: "Completa todos los campos",
            exitInterview: "¿DESEA SALIR DE LA ENTREVISTA?",
            reasonPlaceholder:"Por favor, indícanos el motivo antes de continuar",
            accept: "Aceptar",
            cancel: "Cancelar",
            next: "Siguiente",
            save: "Guardar",
            viewResults: "Ver Resultados",
            confirmation: "Confirmación",
            confirmFinish:"¿Está seguro de guardar y finalizar la entrevista?",
            yes: "Sí",
            no: "No",
            observationPlaceholder: "Puede indicar una observación",
            observacionTitulo: "¿Qué redes sociales, videojuegos o plataformas utiliza el niño, niña o adolescente? Incluya también otras observaciones o información relevante.",
			offline: "Sin acceso a internet",	
		    stateReason: "Debe indicar el motivo",
			finishTitle: "¿Deseas finalizar la entrevista?",
			finishWord1: "Al seleccionar",
			finishWord2: "“Sí”",
			finishWord3: ", la información registrada se guardará y",
			finishWord4: "no podrá ser modificada posteriormente.",
			finishAcept: "Sí, finalizar",
			finishCancel: "Volver y revisar",
        },

        stepOne: {
            title: "ENTREVISTA",
            birthDate: "Fecha de nacimiento",
            selectDate: "Seleccionar fecha",
            gender: "Género",
            victimConflict: "Víctima de conflicto",
            displaced: "Ha sido víctima de desplazamiento forzado",
            migrant: "Migrante",
            migrantType: "Es migrante",
            ethnicity: "Pertenencia étnico-campesina",
            disability: "Discapacidad",
            schooled: "Escolarizado",
            schoolAttendance: "Asiste regularmente a la escuela/colegio",
            grade: "Grado Escolar",
            nationality: "Nacionalidad",
            department: "Departamento de Residencia",
            municipality: "Municipio de Residencia",
            zone: "Zona",
            urban: "Urbano",
            rural: "Rural",
            yes: "Sí",
            no: "No",
            permanent: "Permanente",
            transit: "En tránsito",
            select: "Seleccione...",
            selectDepartment: "Seleccione departamento",
            selectMunicipality: "Seleccione municipio",
			notApplicable: "No aplica",
			mustBe18: "Debes ser menor a 18 años",
            mustBeAge: "El niño/a debe tener al menos {{count}} años",
			searchEthnicity: "Buscar étnico-campesina..",
			searchDisability: "Buscar discapacidad..",
			searchGrade: "Buscar grado..",
			searchNationality: "Buscar nacionalidad..",
			searchDepartment: "Buscar departamento..",
			searchMunicipality: "Buscar municipio..",
        },
		
		stepThree: {
		  title: "RESULTADO DE\nLA ENTREVISTA",
		  scoresByCategory: "Puntajes por categoría",
		  totalScore: "Puntuación Total",
		  riskLevel: "Nivel de Riesgo",
		  recommendations: "Recomendaciones",
		  download: "Descargar",
		},
		
		footer: {
			home:"Inicio",
			interview:"Entrevista",
			results:"Resultados",
			materials:"Materiales",
		},
		listado: {
		  title: "ENTREVISTAS REALIZADAS Y POR FINALIZAR",
		  subtitle:
			"Registro de todas las entrevistas aplicadas y las que están pendientes por diligenciar.",
		  search: "Buscar por ID o Fecha",

		  status: {
			pending: "Pendiente",
			completed: "Completa",
		  },

		  menu: {
			resume: "Retomar\nEntrevista",
			results: "Ver\nResultados",
			delete: "Eliminar y Salir",
		  },

		  noConfigured:
			"No se ha configurado la entrevista\nConsulte al administrador",

		  deleted: "Se ha eliminado la entrevista: ",
		  deleteError: "No se pudo eliminar la entrevista: ",
          warn: "Advertencia",	
		  interview1: "FUNCIONARIOS\nPÚBLICOS",
		  interview2: "AGENTES\nEDUCATIVOS",
		  interview3: "NIÑAS, NIÑOS Y\nADOLECENTES",
		  interview4: "MADRES, PADRES\nY CUIDADORES",
		  instruction: "Instrucción",
		  info: "Información",
		  cancel: "Cancelar",
		},
		inactivity: {
			title: "¿SIGUES AHÍ?",
			info: "La entrevista se cerrará automáticamente si no hay respuesta.",
			yes: "Sí",
		},
    },
    en: {
        login: {
            title: "SIGN IN",
            user: "Username",
            password: "Password",
            forgot: "Forgot your password?",
            signIn: "Sign In",
            createAccount: "Create Account",
            warn: "Warning",
            authError: "Incorrect authentication",
            serverError: "Server error\nContact the Administrator",
            fillAll: "Please fill in all fields",
            offlineNoUser: "No internet and the user was not found on this device",
            offlineTerms: "No internet to accept terms and conditions. Try again later",
            offlineNoTerms: "No internet to accept terms and conditions",
            language: "Language",
            spanish: "Spanish",
            english: "English",
			placeholderUser: "Email",			
        },
        welcome: {
            title: "SafeMode in One Click",
            message:
                "Identify, protect and act\nagainst human trafficking in\ndigital environments.",
        },
        forgot: {
            title: "RESET PASSWORD",
            description:
                "Enter your email and we will\nsend you a link to\nreset your password.",
            emailPlaceholder: "Email",
            icbfNote:
                "If you are an ICBF employee and forgot your password, request a reset at mis@icbf.gov.co (IT Solutions Desk – MIS).",
            sendLink: "Send link",
            backToLogin: "Back to sign in",
            warn: "Warning",
            serverError: "Server error\nContact the Administrator",
            mustEmail: "You must enter your email",
            noInternet: "No internet to reset the password",
			infoOK: "We've sent instructions to reset your password. Please check your inbox or spam folder.",			
        },
        home: {
            title: "WELCOME",
            subtitle:
                "This is an educational app to identify and prevent human trafficking risks for sexual exploitation in digital environments.",
            interview: "Interview\n Form",
            materials: "Reference\n materials",
            results: "Results",
            routes: "Care\nRoutes",
            footer:
                "Developed by IOM and ICBF to promote safe and responsible use of technology to protect children and adolescents.",
        },
        materials: {
            title: "REFERENCE MATERIALS",
            searchPlaceholder: "Explore now",
            items: {
                antecedentes: "Background",
                conceptos: "Key concepts about trafficking in virtual environments",
                ampliacion: "Expanding the scope of the technical guideline",
                rutaProteccion: "Protection and rights restoration route",
                rutaEspecializada: "Specialized care route",
                restablecimiento: "Specific rights restoration",
                antecedentesDesc: "Item description",
                conceptosDesc: "Item description",
                ampliacionDesc: "Item description",
                rutaProteccionDesc: "Item description",
                restablecimientoDesc: "Item description",
            },
        },
        create: {
            title: "DON'T HAVE AN ACCOUNT?\nCREATE ACCOUNT",
            subtitle: "It's quick and easy",
            names: "First name(s)",
            lastNames: "Last name(s)",
            email: "Email",
            confirmEmail: "Confirm email",
            phone: "Phone number",
            institution: "Educational Institution or Entity",
            selectRole: "Select role",
            roleExternal: "External staff",
            roleAgent: "Educational Agent",
            password: "Password",
            confirmPassword: "Confirm password",
            agree: "I agree to",
            terms: "Terms and conditions",
            register: "Sign up",
            already: "Already have an account?\nSign in",
            modalTitle: "Terms and Conditions",
            close: "Close",
            info: "Information",
            infoAt: "ACTIVATE ACCOUNT",
            warn: "Warning",
			infoOk: "We've sent instructions to activate your account. Please check your inbox or spam folder.",
            terminoTexto: `POLICIES, TERMS, AND CONDITIONS OF USE

1. Introduction
This document establishes the policies, terms, and conditions of use for the ModoSeguro a un Click application…

2. Application Objective
The application aims to strengthen the capabilities…

3. Authorized Users
- Officials and contractors of the National Family Welfare System (ICBF)
- Educational agents, counselors…

4. Confidentiality and Processing of Personal Data
- No personally identifiable information is collected
- All information is encrypted and anonymized…

5. User Responsibilities
- Ensure informed consent
- Do not use the app for legal purposes
- Respect confidentiality…

6. Information Security
Includes role-based authentication, encryption, auditing…

7. Intellectual Property
The code, design, texts, etc., are the exclusive property of…

8. Availability and Support
Availability will be guaranteed according to technical capabilities…

9. Updates
The entity may update or Modify as necessary…

10. Acceptance
Use of the app implies full acceptance of these terms.
`,
            errors: {
                weakPassword:
                    "Password must include:\n• At least 1 uppercase letter\n• At least 1 lowercase letter\n• At least 1 number\n• At least 1 special character (@$!%*?&.,:;#)\n• Minimum 8 characters.",
                passwordMismatch: "Password and confirmation do not match",
                emailMismatch: "The email and its confirmation do not match.",
                mustAgree: "You must accept the terms and conditions",
                invalidPhone: "Phone number is not valid",
                invalidEmail: "Email is not valid",
                fillAll: "Please fill in all fields",
                server: "Server error\nContact the Administrator",
            },
        },
        detail: {},
        terms: {
            title: "INFORMED CONSENT",
            subtitle: "Privacy and Data Use",
            p1:
                "Your answers are confidential and will be used anonymously for research and app improvement. Your privacy is our top priority.",
            p2:
                "By continuing, you confirm that you have read and understood the information above and that you are aware of participating.",
            link:
                "Accept. Terms & conditions\nand privacy policies",
            continue: "Continue",
            reject: "Reject",
            modalTitle: "Terms and Conditions",
            close: "Close",
            warn: "Warning",
            serverError: "Server error\nContact the Administrator",
            noInternet: "No internet to accept the terms and conditions",
            noInternetLater:
                "No internet\nto accept terms and conditions. Try again later",
        },

        rejected: {
            title: "IT IS NOT POSSIBLE\nTO CONTINUE",
            p1: "To use the app, you must accept the ",
            consent: "informed consent.",
            p2:
                "Acceptance ensures you understand how your data is used and authorize its processing safely and confidentially.",
            question: "What can you do now?",
            back: "Back to consent",
            exit: "Exit",
        },
        interview: {
            title: "INTERVIEWS",
            subtitle:
                "Select the interview version\naccording to the user type\nit is intended for.",
            cards: {
                public: "Version 3\nPublic Officials",
                agents: "Version 4\nGirls, Boys,\nAdolescents,\nCaregivers and\nParents of Family",
                kids: "Version 2\nGirls, Boys\nand Adolescents",
                parents: "Version 1\nMothers, fathers\nand caregivers",
            },
            navTitles: {
                public: "Version 3\nPublic Officials",
                agents: "Version 4\nGirls, Boys,\nAdolescents,\nCaregivers and\nParents of Family",
                kids: "Version 2\nGirls, Boys\nand Adolescents",
                parents: "Version 1\nMothers, fathers\nand caregivers",
            },
            warn: "Warning",
            noConfigured:
                "The interview is not configured\nPlease contact the administrator",
            modalTitle: "Instructions",
            close: "Close",
			terminoTexto: "Ejemplo Modal para las instrucciones",
        },
        materialsDetail: {
            seeMore: "See more",
        },
        summary: {
            title: "SUMMARY OF\nRESULTS",
            interviews: "Interviews",
            completed: "Completed",
            pending: "Pending",
            total: "Total",
            riskMin: "Minimum Risk Level",
            riskLow: "Low Risk Level",
            riskHigh: "Significant Risk Level",
        },
        routes: {
            title: "CARE ROUTE",
            download: "Download",
			description: "Description",
			  instructions: [
				"Requests can be made through Line 141, 24 hours a day, seven days a week, or through any of our service channels during the following hours:",
				"ICBF Chat: Monday to Saturday from 8:00 a.m. to 6:00 p.m.",
				"Website: www.icbf.gov.co",
				"WhatsApp: 320 239 16 85; Monday to Friday from 8:00 a.m. to 5:00 p.m.",
				"Online call: Monday to Friday from 8:00 a.m. to 5:00 p.m.",
				"PQRS requests: 24 hours a day, 7 days a week.",
				"National Free Line: 01-8000-91-8080; Monday to Friday from 8:00 a.m. to 5:00 p.m.",
				"Libertapp: Free download app available for Android and Apple.",
				"Ministry of the Interior: National Free Line 01-8000-52-2020"
			  ]			
        },
        instruction: {
            usageTitle: "Usage instructions:",
            continue: "Continue",
        },
        assent: {
            title: "INFORMED\nASSENT",
            accept: "Accept",
            reject: "Reject",
        },

        assentReject: {
            title: "IT IS NOT POSSIBLE\nTO CONTINUE",
            p1:
                "To continue the interview, it is necessary to accept the informed assent.",
            p2:
                "Since the participant has rejected this authorization, it is not possible to start the assessment process.",
            p3:
                "If you wish to continue later, you may return to the previous screen and review the assent information again.",
            back: "Back to Assent",
            exit: "Exit",
        },

        stepCommon: {
            warning: "Warning",
            fillAll: "Please complete all fields",
            exitInterview: "DO YOU WANT TO EXIT THE INTERVIEW?",
            reasonPlaceholder:
                "Please tell us the reason before continuing",
            accept: "Accept",
            cancel: "Cancel",
            next: "Next",
            save: "Save",
            viewResults: "View Results",
            confirmation: "Confirmation",
            confirmFinish:
                "Are you sure you want to save and finish the interview?",
            yes: "Yes",
            no: "No",
            observationPlaceholder: "You may add an observation",
            observacionTitulo: "What social media, video games, or platforms does the child or adolescent use? Please also include any other relevant observations or information.",
			offline: "No internet access",
			stateReason: "You must state a reason",
			finishTitle: "Do you wish to end the interview?",
			finishWord1: "By selecting",
			finishWord2: "“Yes”",
			finishWord3: ", the recorded information will be saved and",
			finishWord4: "cannot be modified later.",
			finishAcept: "Yes, finish",
			finishCancel: "Go back and check.",			
        },

        stepOne: {
            title: "INTERVIEW",
            birthDate: "Date of birth",
            selectDate: "Select date",
            gender: "Gender",
            victimConflict: "Victim of conflict",
            displaced: "Victim of forced displacement",
            migrant: "Migrant",
            migrantType: "Migration status",
            ethnicity: "Ethnicity",
            disability: "Disability",
            schooled: "Schooled",
            schoolAttendance: "Regular school attendance",
            grade: "Grade",
            nationality: "Nationality",
            department: "Department",
            municipality: "Municipality",
            zone: "Zone",
            urban: "Urban",
            rural: "Rural",
            yes: "Yes",
            no: "No",
            permanent: "Permanent",
            transit: "In transit",
            select: "Select...",
            selectDepartment: "Select department",
            selectMunicipality: "Select municipality",
			notApplicable: "Not Applicable",
			mustBe18: "You must be under 18 years old",		
            mustBeAge: "The child must be at least {{count}} years old",
			searchEthnicity: "Search Ethnicity..",
			searchDisability: "Search Disability..",
			searchGrade: "Search Grade..",
			searchNationality: "Search Nationality..",
			searchDepartment: "Search Department..",
			searchMunicipality: "Search Municipality..",			
        },
		
		stepThree: {
		  title: "INTERVIEW\nRESULTS",
		  scoresByCategory: "Scores by category",
		  totalScore: "Total Score",
		  riskLevel: "Risk Level",
		  recommendations: "Recommendations",
		  download: "Download",
		},
		
		footer: {
			home:"Home",
			interview:"Interview",
			results:"Results",
			materials:"Materials",
		},		
		listado: {
		  title: "COMPLETED AND PENDING INTERVIEWS",
		  subtitle:
			"Record of all completed interviews and those still pending.",
		  search: "Search by ID or Date",

		  status: {
			pending: "Pending",
			completed: "Completed",
		  },

		  menu: {
			resume: "Resume\nInterview",
			results: "View\nResults",
			delete: "Delete and Exit",
		  },

		  noConfigured:
			"The interview is not configured\nPlease contact the administrator",

		  deleted: "The interview has been deleted: ",
		  deleteError: "The interview could not be deleted: ",
          warn: "Warning",
		  interview1: "PUBLIC\nOFFICIALS",
		  interview2: "EDUCATIONAL\nAGENTS",
		  interview3: "GIRLS, BOYS AND\nADOLESCENTS",
		  interview4: "MOTHERS, FATHERS AND\nCAREGIVERS",
		  instruction: "Instruction",	
		  info: "Information",		  
		  cancel: "Cancel",
		},
		inactivity: {
			title: "ARE YOU STILL THERE?",
			info: "The interview will automatically close if there is no response.",
			yes: "Yes",
		},		
    },
};
