export const faqData = {
    es: {
        greeting: "¡Hola! Soy el asistente virtual de Fiberstech. ¿En qué puedo ayudarte hoy?",
        notFound: "Lo siento, no tengo esa información exacta. ¿Podrías intentar refrasear tu pregunta o contactar a un asesor?",
        placeholder: "Escribe tu pregunta...",
        toggleLabel: "English",
        questions: [
            { id: 'precio_equipos', question: '¿Cuál es el precio de los equipos?', answer: 'Para brindarte una cotización personalizada, por favor contacta a nuestro asesor humano vía WhatsApp. Ellos te darán los precios actualizados según el modelo que necesites.', isQuick: true, showContact: true },
            { id: 'metodos_pago', question: '¿Qué métodos de pago aceptan?', answer: 'Las opciones de pago se coordinan directamente con nuestro equipo comercial. Escríbenos por WhatsApp para que un asesor te guíe en el proceso de compra.', isQuick: false, showContact: true },
            { id: 'envios_tiempo', question: '¿Realizan envíos y cuánto tardan?', answer: 'Sí, realizamos envíos. Los tiempos de entrega exactos se conversan con el asesor al momento de tu compra para ajustarnos a tu ubicación y urgencia.', isQuick: false, showContact: true },
            { id: 'soporte_tecnico', question: '¿Cómo solicito soporte técnico si mi equipo falla?', answer: 'El soporte técnico se coordina directamente con un asesor especializado vía WhatsApp para brindarte una solución rápida.', isQuick: true, showContact: true },

            { id: 'especies_evaluadas', question: '¿Qué animales se pueden evaluar con estos equipos?', answer: 'Nuestros sistemas evalúan principalmente alpacas, llamas y vicuñas. También funcionan con ovinos (ovejas), caprinos, conejos y otros animales de fibra.', isQuick: true, showContact: false },
            { id: 'confiabilidad_cientifica', question: '¿Los resultados son confiables científicamente?', answer: 'Sí, usamos Inteligencia Artificial validada científicamente con una precisión muy alta (r > 0.96). Nuestros equipos son usados en investigaciones y universidades internacionales.', isQuick: false, showContact: false },
            { id: 'medicion_longitud', question: '¿El equipo mide la longitud de la fibra?', answer: 'Nuestros equipos actuales (FIBER EC, FIBER MED, FIBER MULT) se especializan en finura (diámetro), medulación y características transversales. Para detalles sobre longitud, consulta con un asesor.', isQuick: false, showContact: false },
            { id: 'condiciones_trabajo', question: '¿Los equipos funcionan en condiciones extremas de altitud?', answer: 'Sí, nuestros equipos están diseñados para trabajar en campo hasta los 5,300 metros sobre el nivel del mar y en temperaturas de 0°C a 45°C.', isQuick: false, showContact: false },

            { id: 'garantia_productos', question: '¿Tienen garantía los productos?', answer: 'Sí, equipos principales como el FIBER EC y FIBER MED cuentan con una garantía de 1 año (12 meses) para asegurar tu inversión.', isQuick: true, showContact: false },
            { id: 'que_es_fiberstech', question: '¿Qué es Fiberstech?', answer: 'Somos una empresa tecnológica peruana y centro de investigación autorizado por CONCYTEC. Nos dedicamos a innovar para mejorar la producción y el bienestar animal.', isQuick: false, showContact: false },
            { id: 'otros_servicios', question: '¿Ofrecen otros servicios además de vender equipos?', answer: 'Sí, brindamos servicios de análisis de fibras, asesoría para tesis, cursos de tecnología textil y consultoría en proyectos de investigación.', isQuick: false, showContact: false }
        ]
    },
    en: {
        greeting: "Hello! I am Fiberstech's virtual assistant. How can I help you today?",
        notFound: "I'm sorry, I don't have that exact information. Could you try rephrasing your question or contact an advisor?",
        placeholder: "Type your question...",
        toggleLabel: "Español",
        questions: [
            { id: 'equipment_price', question: 'What is the price of the equipment?', answer: 'To provide you with a personalized quote, please contact our human advisor via WhatsApp. They will give you updated prices according to the model you need.', isQuick: true, showContact: true },
            { id: 'payment_methods', question: 'What payment methods do you accept?', answer: 'Payment options are coordinated directly with our commercial team. Write to us on WhatsApp so an advisor can guide you through the purchasing process.', isQuick: false, showContact: true },
            { id: 'shipping_time', question: 'Do you ship and how long does it take?', answer: 'Yes, we do ship. Exact delivery times are discussed with the advisor at the time of your purchase to adjust to your location and urgency.', isQuick: false, showContact: true },
            { id: 'technical_support', question: 'How do I request technical support if my equipment fails?', answer: 'Technical support is coordinated directly with a specialized advisor via WhatsApp to provide you with a quick solution.', isQuick: true, showContact: true },

            { id: 'evaluated_species', question: 'Which animals can be evaluated with this equipment?', answer: 'Our systems primarily evaluate alpacas, llamas, and vicuñas. They also work with sheep, goats, rabbits, and other fiber-producing animals.', isQuick: true, showContact: false },
            { id: 'scientific_reliability', question: 'Are the results scientifically reliable?', answer: 'Yes, we use scientifically validated Artificial Intelligence with very high precision (r > 0.96). Our equipment is used in international research and universities.', isQuick: false, showContact: false },
            { id: 'length_measurement', question: 'Does the equipment measure fiber length?', answer: 'Our current equipment (FIBER EC, FIBER MED, FIBER MULT) specializes in fineness (diameter), medullation, and cross-sectional characteristics. For details on length, consult with an advisor.', isQuick: false, showContact: false },
            { id: 'working_conditions', question: 'Do the devices work in extreme altitude conditions?', answer: 'Yes, our equipment is designed to work in the field up to 5,300 meters above sea level and in temperatures from 0°C to 45°C.', isQuick: false, showContact: false },

            { id: 'product_warranty', question: 'Do the products have a warranty?', answer: 'Yes, main equipment such as FIBER EC and FIBER MED have a 1-year (12-month) warranty to secure your investment.', isQuick: true, showContact: false },
            { id: 'what_is_fiberstech', question: 'What is Fiberstech?', answer: 'We are a Peruvian technology company and a research center authorized by CONCYTEC. We are dedicated to innovating to improve animal production and welfare.', isQuick: false, showContact: false },
            { id: 'other_services', question: 'Do you offer other services besides selling equipment?', answer: 'Yes, we provide fiber analysis services, thesis advisory, textile technology courses, and consultancy in research projects.', isQuick: false, showContact: false }
        ]
    }
};