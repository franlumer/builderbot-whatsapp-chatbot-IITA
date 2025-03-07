import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils, addAnswer } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

const PORT = process.env.PORT ?? 3008

let courseNumber;
const keyWords: string[] = [
    'hola',
    'buen',
    'buenas',
    'dia',
    'dias',
    'tarde',
    'tardes',
    'noche',
    'noches',
    'que tal',
    'como'
];

function normalizeString(str: string): string {
    return str
        .toLowerCase() // Convertir a minúsculas
        .normalize('NFD') // Normalizar la cadena
        .replace(/[\u0300-\u036f]/g, ''); // Eliminar los acentos
}

// Mensaje de bienvenida y cursos disponibles
const courseDescriptions = {
    1: "Taller Anual de Robótica Educativa\n\n📌 Sobre el taller:\nLos estudiantes asisten una vez a la semana por 2 horas y media, se garantizan 10hs minimas de clase al mes. En cada clase, construyen robots, programan motores y utilizan sensores para que los robots realicen diversas funciones.\n\n📌 ¿Por qué es importante este taller?\nAdemás de desarrollar habilidades técnicas, este taller introduce a los estudiantes al fascinante mundo de la robotica. La robótica educativa les enseña los fundamentos para entender cómo funciona la tecnología que transforma nuestra sociedad. Al aprender a programar y a resolver desafíos con robots autónomos, los alumnos adquieren competencias clave para ser creadores de tecnología y no solo usuarios. \n\n📌 Beneficios del taller:\n\nDesarrollo de habilidades en trabajo en equipo, matemáticas, física, mecánica y programación.\n\nEstimulación de la creatividad e imaginación.\n\nPotenciación del pensamiento lógico mediante desafíos prácticos y situaciones simuladas de la vida real.\n\nResolucion de problemas\n\n\n📌 Metodología:\nLas clases son dinámicas y atractivas, con un enfoque práctico. Los estudiantes trabajan en pequeños escenarios donde sus robots deben realizar misiones autónomas, aprendiendo a identificar problemas, corregir errores y buscar soluciones efectivas.\n\n📌 Detalles del taller:\n\nGrupos de hasta 18 alumnos con 3 docentes para una atención personalizada.\n\nTodo el material necesario está incluido, tanto para las clases como para exposiciones y campeonatos que se desarrollan a lo largo del año.\n\n\n📌 Costo:\n\nInscripción anual: $60000\n\nCuotas mensuales: $40.000 ( marzo, se abona medio mes) , abril $80000 ( se abona mes completo)\n\n\n📌 Sedes:\n\n1. Sede Centro: Calle Coronel Puch  454, segundo piso. JUJUY\n\n📌 Inscripción:\nPuedes inscribirte presencialmente en el IITA o de manera virtual a través de este medio.\n\nLos grupos se organizan por edades.\nPara que edad busca?",
    2: "CURSO DE PROGRAMACION CON PYTHON  DESDE CERO CON INTELIGENCIA ARTIFICIAL\nAprende a programar en Python el lenguaje con mas demanda para trabajos online y presenciales en empresas de Argentina y del extranjero. Orientado a personas que quieren iniciarse en  programación o para los que ya tienen conocimientos en programación y quieren conocer este lenguaje . \nEn este curso aprenderás nociones básicas del lenguaje y complementarás con una serie de ejercicios prácticos , programando. Al final desarrollaras un proyecto final de un programa para punto de venta de un restaurant.\n-Todos los docentes son ingenieros.\n-Python es el lenguaje con mas demanda en el mercado laboral.\nMODALIDAD: Clases presenciales\nDURACION: 3 meses – 12 clases  de dos horas\n-Todo el material de estudio disponible\n-Requisito : traer su notebook o reservar una del instituto.\n-Empieza: 12 de marzo\n-Horarios : miercoles de 18.30 a 20.30hs\n-Se entrega certificado avalado por IITA\n-Costo: un pago de $160000 o tres cuotas de $65000.\nEstamos inscribiendo en Tel: 3885759407  o en el instituto.\nIITA esta en calle Coronel Puch 454 entre alvear y guemes de 17 a 20hs - JUJUY -",
    3: "CURSO DE ROBÓTICA CON ARDUINO\nModalidad: PRESENCIAL\nTemario:Programacion de leds, botones, servomotores, tira leds de carrozas, motores, sensores y bluetooth.\nProyecto final construcción y programación de un robot inteligente comandado por celular.\n-Material de estudio y trabajos practicos en cada clase\n-Se usaran materiales del instituto por lo que no hace falta comprar\n-Todos los docentes son ingenieros\n-Requisito: se sugiere llevar su notebook.\n-Duracion: 12 clases en 3 meses.\n-No se cobra inscripcion.\n-Horario: sabados de 10 a 12hs\n-Empieza: 22 de marzo\nAudiencia: jovenes, adolescentes, estudiantes y adultos.\nSe entrega certificado avalado por el Instituto IITA.\n\n-Costo:  un  pago de $160000 o tres cuotas de $65000\nSe puede inscribir por aca.\nIITA esta en calle Coronel Puch 454 entre alvear y guemes de 10 a 12.30 y de 17 a 20hs - JUJUY -",
    4: "ULTIMOS 3 LUGARES PARA MARZO\nCURSO DE MARKETING DIGITAL\nCON INTELIGENCIA ARTIFICIAL (PRESENCIAL)\n\nComo Vender y permitir que te conozcan por las Redes Sociales usando inteligencia artificial\nCurso para emprendedores, comerciantes, empresarios: activa tu empresa, hace que la gente te pueda encontrar en las redes.\n-Clases presenciales\n-Comienzo: 5 de marzo\n*Se aprendera el uso de Facebook e Instagram para publicidades eficientes con impacto inmediato, \n*Fan page de tu negocio,\n*Pagina de Google Mi negocio, para presencia en Googlemaps\n*Crear cuenta de negocios en facebook e instagram,\n*Pubicacion de tu aviso y como hacer seguimiento a traves del administrador de anuncios,\n*Diseño de avisos publicitarios para redes con Canva\n-Se sugiere llevar notebook o reservar sin costo una del instituto\n-Horario de clases: miercoles de 15 a 17hs .\n-Duracion : 2 meses con 8 clases 1 vez a la semana\n-Costo: un pago de $110000 o dos cuotas de $65000.\nInformacion e inscripciones al whatsapp: 3885759407 o en IITA que esta en calle Coronel Puch 454- JUJUY"
};

// Definición del flujo de cursos
const coursesFlow = addKeyword<Provider, Database>([""])
        .addAnswer('Por favor, ingresa el número del curso para más información.', { capture: true }, async (ctx, { flowDynamic, gotoFlow }) => {
        const courseNumber = parseInt(ctx.body); // Asegúrate de usar la base 10
        if (Number.isInteger(courseNumber) && courseNumber >= 1 && courseNumber <= 5) { 
            ctx.courseNumber = courseNumber; // Guarda el número del curso en el contexto
            return gotoFlow(courseFlow);
            await flowDynamic(courseDescriptions[courseNumber])
        } else {
            await flowDynamic('Opción no válida. Por favor, ingresa un número del 1 al 5');
            await flowDynamic(welcomeFlow); // Regresa al flujo de bienvenida
        }
    });

    const welcomeFlow = addKeyword<Provider, Database>(keyWords)
    .addAnswer('🙌 ¡¡Bienvenido a *IITA* - Instituto de Innovación y Tecnología Aplicada!!')
    .addAnswer('Hola! soy tu asistente virtual quien te ayudará el día de hoy.')
    .addAnswer('Actualmente estamos inscribiendo para los siguientes cursos:\n\n*1.* Taller anual de robótica con Lego\n*2.* Taller de programación con Python con inteligencia artificial\n*3.* Curso de robótica con Arduino con inteligencia artificial\n*4.* Curso de marketing digital con inteligencia artificial.', { delay: 1000 })
    .addAnswer('Te redirigiré a la información de los cursos ahora...', { delay: 1000 }, async (ctx, { gotoFlow }) => {
        return gotoFlow(coursesFlow); // Moverse al flujo de cursos automáticamente
    });

// Inicio del servidor

    const main = async () => {
        const adapterFlow = createFlow([welcomeFlow, coursesFlow])
        
        const adapterProvider = createProvider(Provider)
        const adapterDB = new Database()
    
        const { handleCtx, httpServer } = await createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB,
        })
    
        // Manejo de mensajes entrantes
        adapterProvider.server.post(
            '/v1/messages',
            handleCtx(async (ctx, req, res) => {
                if (!ctx) {
                    return res.status(400).send('Context is undefined');
                }
                const { number, message, urlMedia } = req.body;
                await ctx.bot.sendMessage(number, message, { media: urlMedia ?? null });
                return res.end('sended');
            })
        );
    
        // Manejo de registro
        adapterProvider.server.post(
            '/v1/register',
            handleCtx(async (ctx, req, res) => {
                if (!ctx) {
                    return res.status(400).send('Context is undefined');
                }
                const { number, name } = req.body;
                await ctx.bot.dispatch('REGISTER_FLOW', { from: number, name });
                return res.end('trigger');
            })
        );
    
        // Manejo de muestras
        adapterProvider.server.post(
            '/v1/samples',
            handleCtx(async (ctx, req, res) => {
                if (!ctx) {
                    return res.status(400).send('Context is undefined');
                }
                const { number, name } = req.body;
                await ctx.bot.dispatch('SAMPLES', { from: number, name });
                return res.end('trigger');
            })
        );
    
        // Iniciar el servidor
        httpServer(+PORT);
    }
    
    main();