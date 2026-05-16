
```javascript
const Anthropic = require("@anthropic-ai/sdk");
const readline = require("readline");

const client = new Anthropic();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function generateRecipe(calories, dietary, ingredients) {
  console.log(
    `\n🍳 Generando receta saludable (${calories} calorías)...\n`
  );

  const prompt = `Eres un nutricionista experto en recetas saludables. Genera una receta deliciosa y nutritiva con las siguientes características:

- Calorías objetivo: ${calories}
- Restricciones dietéticas: ${dietary || "ninguna"}
- Ingredientes preferidos: ${ingredients || "cualquiera"}

Por favor, proporciona:
1. Nombre de la receta
2. Ingredientes con cantidades exactas
3. Instrucciones paso a paso
4. Desglose de calorías por ingrediente
5. Valor nutricional total (proteínas, carbohidratos, grasas)
6. Tiempo de preparación
7. Tips de salud adicionales

Asegúrate de que sea práctica y deliciosa.`;

  const stream = await client.messages.stream({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      process.stdout.write(chunk.delta.text);
    }
  }

  console.log("\n");
}

async function suggestRecipes(dailyCalories) {
  console.log(
    `\n📋 Sugiriendo plan de recetas para ${dailyCalories} calorías diarias...\n`
  );

  const prompt = `Eres un nutricionista especializado en planificación de comidas. Sugiere un plan de comidas saludable para un día con un total de ${dailyCalories} calorías.

Por favor, proporciona:
1. Desayuno (30% de calorías)
2. Almuerzo (35% de calorías)
3. Cena (30% de calorías)
4. Snacks (5% de calorías)

Para cada comida incluye:
- Nombre de la receta
- Ingredientes principales
- Calorías estimadas
- Macro nutrientes

Asegúrate de que sea variado, nutritivo y práctico de preparar.`;

  const stream = await client.messages.stream({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      process.stdout.write(chunk.delta.text);
    }
  }

  console.log("\n");
}

async function analyzeRecipe(recipeName) {
  console.log(
    `\n🔍 Analizando receta: "${recipeName}"...\n`
  );

  const prompt = `Analiza la siguiente receta desde una perspectiva nutricional: "${recipeName}"

Por favor, proporciona:
1. Componentes principales
2. Estimación de calorías por porción
3. Desglose de macronutrientes
4. Micronutrientes principales
5. Beneficios para la salud
6. Posibles mejoras saludables
7. Alternativas más saludables si es necesario
8. Recomendaciones de acompañamientos

Sé específico y proporciona números aproximados basados en proporciones estándar.`;

  const stream = await client.messages.stream({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      process.stdout.write(chunk.delta.text);
    }
  }

  console.log("\n");
}

async function main() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   🥗 GENERADOR DE RECETAS SALUDABLES  ║");
  console.log("║      con Análisis de Calorías         ║");
  console.log("╚════════════════════════════════════════╝\n");

  let continuar = true;

  while (continuar) {
    console.log("¿Qué deseas hacer?");
    console.log("1. Generar una receta saludable");
    console.log("2. Obtener plan de comidas diarias");
    console.log("3. Analizar una receta");
    console.log("4. Salir\n");

    const opcion = await question("Selecciona una opción (1-4): ");

    switch (opcion) {
      case "1": {
        const calories = await question(
          "\n¿Cuántas calorías deseas en la receta? (ej: 400): "
        );
        const dietary = await question(
          