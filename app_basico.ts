import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { exit } from 'process'

const PORT = process.env.PORT ?? 3008

const welcome:string [] = ['hola','buenas tardes','buen dia','buenas noches','buenos dias','como esta'];
const courses = 'Taller anual de robótica para niños\nTaller kinder de robótica\nCurso de programación con Python con inteligencia artificial\nCurso de robótica con Arduino con inteligencia artificial\nCurso de marketing digital con inteligencia artificial'
const coursesOpt = '1. Taller anual de robótica para niños\n2. Taller kinder de robótica\n3. Curso de programación con Python con inteligencia artificial\n4. Curso de robótica con Arduino con inteligencia artificial\n5. Curso de marketing digital con inteligencia artificial\n\nPor favor, ingresa el número del curso para más información.'

function normalizeString(str) {
    return str
        .toLowerCase() // Convertir a minúsculas
        .normalize('NFD') // Normalizar la cadena
        .replace(/[\u0300-\u036f]/g, ''); // Eliminar los acentos
}

// Mensaje de bienvenida y cursos disponibles
const courseDescriptions = {
    1: "Robótica con Lego: Crea y programa tus propios robots con Lego. *Lorem ipsum dolor sit amet...*",
    2: "Robótica para Niños: Introducción a la robótica para los más pequeños. *Lorem ipsum dolor sit amet...*",
    3: "Python: Aprende a programar en uno de los lenguajes más populares. *Lorem ipsum dolor sit amet...*",
    4: "Arduino: Curso de introducción a la programación y electrónica. *Lorem ipsum dolor sit amet...*",
    5: "Marketing Digital: Aprende a promocionar productos y servicios en línea. *Lorem ipsum dolor sit amet...*"
};
const numberOfCourses = Object.keys(courseDescriptions).length;

const askFlow = addKeyword([''])
    .addAnswer(coursesOpt)
    .addAnswer('¿Cuál curso le interesa? ingrese solo el numero', { capture: true }, async (ctx, { flowDynamic }) => {
        const courseNumber = ctx.body;
        if (parseInt(courseNumber)) { // Si la respuesta se puede transformar a Int
            const courseNumber = parseInt(ctx.body)
            if (!courseDescriptions[courseNumber]) { // En caso de que no este en la lista
            await flowDynamic(`Opción no válida. Por favor, ingresa un número del 1 al ${numberOfCourses}`);

        } else if (courseDescriptions[courseNumber] && courseNumber >= 1 && courseNumber <= 5) { // Caso 'todo bien'
            await flowDynamic(courseDescriptions[courseNumber]); // Enviar la descripción correspondiente

        }
        } else {
            await flowDynamic('Ingrese solo un numero.')
        }
    });

const welcomeFlow = addKeyword(welcome, { sensitive: true })
    .addAnswer('🙌 ¡¡Bienvenido a *IITA* - Instituto de Innovación y Tecnología Aplicada!!')
    .addAnswer(`Actualmente estamos inscribiendo para los siguientes cursos:\n\n${courses}`)
    .addAnswer(coursesOpt)
    .addAnswer('¿Quiere saber más de un curso en específico?', { capture: true }, async (ctx, {gotoFlow, flowDynamic}) => {
        const answer = ctx.body;
        if (answer.toLowerCase().includes("si")) {
            return gotoFlow(askFlow)
            
        } else if (!(answer.toLowerCase().includes('no'))) {
            await flowDynamic('Está bien');
            await flowDynamic('Si necesita más información, no dude en preguntar!!')
        }
    });










// Inicio del servidor

    const main = async () => {
        const adapterFlow = createFlow([welcomeFlow, askFlow])
        
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