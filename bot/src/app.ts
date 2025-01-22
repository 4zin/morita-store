import {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} from "@builderbot/bot";
import { BaileysProvider } from "@builderbot/provider-baileys";
import { adapterDB } from "./db-provider";

const PORT = process.env.PORT ?? 3008;

const productFlow = addKeyword(["1", "productos"]).addAnswer([
  "Pijamas",
  "Multiusos",
  "Blusas",
  "Camisetas",
  "Regalos corporativos",
  "Productos sublimados",
]);

const waitAdvisor = addKeyword(["1", "sí", "si"]).addAnswer(
  "En un momento te contactaremos con uno de nuestros asesores para brindarte la información"
);

const noAdvisor = addKeyword(["2", "no"]).addAnswer(
  "¡Gracias por comunicarte con nosotros!"
);

const wholeSalerFLow = addKeyword(["2", "mayorista"])
  .addAnswer(
    "Puedes adquirir nuestros productos al por mayor a partir de 6 unidades, colores y tallas surtidas. *Compra mínima de 200.000COP*"
  )
  .addAnswer("¿Desea ser uno de nuestro mayoristas?")
  .addAnswer(["1. Sí", "2. No"], null, null, [waitAdvisor, noAdvisor]);

const salesFlow = addKeyword(["3", "detal", "ventas", "vtas"]).addAnswer(
  "A partir de *6 unidades* Pago anticipado por PSE."
);

const distribuitorFlow = addKeyword(["4", "distribuidor"]).addAnswer(
  "En un momento te contactaremos con uno de nuestros asesores para brindarte la información"
);

const buyFlow = addKeyword(["5", "compra"]).addAnswer(
  [
    "Para continuar con el proceso de compra, favor proporcionar los siguientes datos:",
    "*Nombre completo*",
    "*Ciudad y Departamento*",
    "*Dirección completa*",
    "*No. Cédula*",
    "*Número de contacto*",
    "*Correo Electrónico*",
  ],
  { capture: true },
  async (ctx, { flowDynamic }) => {
    const response = ctx.body;
    const lines = response.split("\n").map((line) => line.trim());

    const keys = [
      "name",
      "city",
      "address",
      "idNumber",
      "contactNumber",
      "email",
    ] as const;

    type ResponseObject = Record<(typeof keys)[number], string | null>;

    const responseObject: ResponseObject = keys.reduce((obj, key, index) => {
      obj[key] = lines[index] || null;
      return obj;
    }, {} as ResponseObject);

    await flowDynamic(
      `¡Muchas Mori-gracias, ${
        responseObject.name.split(" ")[0]
      }! 🐩 En un momento te atenderemos`
    );
  }
);

const welcomeFlow = addKeyword<BaileysProvider, typeof adapterDB>([
  "hi",
  "hola",
  "ola",
  "buenas",
  "vuenas",
])
  .addAnswer("Gusto en saludarte, soy Mori-bot 🐩, tu asistente virtual.")
  .addAnswer(
    "Tenemos una gran variedad de productos para que puedas empezar con nosotros. ¿Qué información deseas conocer?"
  )
  .addAnswer("escriba el número de la opción que desee")
  .addAnswer(
    [
      "1. Productos",
      "2. Info Mayorista",
      "3. Vtas al detal",
      "4. Ser Distribuidor",
      "5. Compra",
    ],
    null,
    null,
    [productFlow, wholeSalerFLow, salesFlow, distribuitorFlow, buyFlow]
  );

const main = async () => {
  const adapterFlow = createFlow([welcomeFlow]);

  const adapterProvider = createProvider(BaileysProvider);

  const { httpServer } = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  httpServer(+PORT);
};

main();
