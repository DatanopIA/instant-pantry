import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'pantry.db');

const db = new Database(dbPath);

// Inicializar tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    exp INTEGER NOT NULL,
    icon TEXT,
    status TEXT DEFAULT 'green'
  );

  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    time TEXT,
    cal TEXT,
    tags TEXT,
    img TEXT,
    desc TEXT,
    ingredients TEXT,
    steps TEXT,
    is_favorite INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    sender TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    tier TEXT DEFAULT 'free',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insertar datos iniciales si la tabla está vacía
const checkInventory = db.prepare('SELECT count(*) as count FROM inventory').get();
if (checkInventory.count === 0) {
  const insert = db.prepare('INSERT INTO inventory (name, exp, icon, status) VALUES (?, ?, ?, ?)');
  insert.run('Salmón Noruego', 5, '🐟', 'green');
  insert.run('Aguacate', 2, '🥑', 'yellow');
  insert.run('Leche Desnatada', 1, '🥛', 'red');
  insert.run('Huevos Bio', 10, '🥚', 'green');
}

const checkRecipes = db.prepare('SELECT count(*) as count FROM recipes').get();
if (checkRecipes.count === 0) {
  const insert = db.prepare('INSERT INTO recipes (title, time, cal, tags, img, desc, ingredients, steps) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

  // Italianas
  insert.run(
    'Pizza Margarita Gourmet',
    '15 min',
    '600 kcal',
    JSON.stringify(['Italiana', 'Pizza', 'Fácil']),
    '/assets/recipes/pizza_margarita.png',
    'La base de la cocina italiana con mozzarella fresca.',
    JSON.stringify(['Masa de pizza', 'Tomate natural', 'Mozzarella de Búfala', 'Albahaca fresca', 'Aceite de oliva']),
    JSON.stringify(['Extender la masa.', 'Repartir el tomate y la mozzarella.', 'Hornear a máxima temperatura 10 min.', 'Añadir albahaca fresca al salir.'])
  );
  insert.run(
    'Lasagna de la Nonna',
    '60 min',
    '750 kcal',
    JSON.stringify(['Italiana', 'Carne', 'Tradicional']),
    '/assets/recipes/lasagna_nonna.png',
    'Capas de sabor con bechamel artesana.',
    JSON.stringify(['Placas de lasagna', 'Carne picada', 'Bechamel', 'Tomate frito', 'Queso rallado']),
    JSON.stringify(['Preparar el boloñesa.', 'Montar las capas.', 'Cubrir con bechamel y queso.', 'Gratinar 20 min.'])
  );
  insert.run(
    'Gnocchi al Pesto Genovese',
    '15 min',
    '400 kcal',
    JSON.stringify(['Italiana', 'Pasta', 'Rápido']),
    'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=600',
    'Sabor intenso a albahaca y piñones.',
    JSON.stringify(['Gnocchi de patata', 'Albahaca', 'Piñones', 'Parmesano', 'Ajo', 'Aceite de oliva']),
    JSON.stringify(['Cocer los gnocchi.', 'Preparar el pesto triturando los ingredientes.', 'Mezclar y servir frío o templado.'])
  );
  insert.run(
    'Pasta Carbonara Auténtica',
    '20 min',
    '550 kcal',
    JSON.stringify(['Italiana', 'Pasta', 'Gourmet']),
    '/assets/recipes/pasta_carbonara.png',
    'Receta tradicional romana con guanciale y pecorino.',
    JSON.stringify(['Espaguetis', 'Huevos fresos', 'Parmesano', 'Guanciale', 'Pimienta negra']),
    JSON.stringify(['Cocer la pasta.', 'Dorado del guanciale.', 'Mezcla de la crema de huevo.', 'Combinar todo sin fuego.'])
  );

  // Japonesas
  insert.run(
    'Sushi Rolls Variados',
    '50 min',
    '350 kcal',
    JSON.stringify(['Japonesa', 'Pescado', 'Saludable']),
    '/assets/recipes/sushi_rolls.png',
    'El clásico japonés en tu casa.',
    JSON.stringify(['Arroz para sushi', 'Alga Nori', 'Salmón', 'Aguacate', 'Vinagre de arroz']),
    JSON.stringify(['Preparar el arroz.', 'Extender sobre el alga.', 'Añadir relleno y enrollar.', 'Cortar con cuchillo húmedo.'])
  );
  insert.run(
    'Ramen Tonkotsu Casero',
    '40 min',
    '700 kcal',
    JSON.stringify(['Japonesa', 'Sopa', 'Pro']),
    '/assets/recipes/ramen_tonkotsu.png',
    'Caldo intenso servido con fideos y huevo.',
    JSON.stringify(['Fideos Ramen', 'Caldo de cerdo', 'Chashu', 'Huevo marinado', 'Alga Nori']),
    JSON.stringify(['Preparar el caldo.', 'Cocinar los fideos.', 'Montar el bowl con toppings.'])
  );
  insert.run(
    'Gyoza de Pollo y Verduras',
    '25 min',
    '280 kcal',
    JSON.stringify(['Japonesa', 'Entrante', 'Frito']),
    'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600',
    'Empanadillas japonesas crujientes.',
    JSON.stringify(['Masa de gyozas', 'Pollo picado', 'Col', 'Cebollino', 'Soja', 'Aceite de sésamo']),
    JSON.stringify(['Rellenar la masa.', 'Cerrar con pliegues.', 'Dorar en sartén y luego cocinar al vapor con un poco de agua.'])
  );

  // Argentinas
  insert.run(
    'Empanadas Mendocinas',
    '45 min',
    '320 kcal',
    JSON.stringify(['Argentina', 'Carne', 'Horno']),
    'https://images.unsplash.com/photo-1628191010210-a597715998a9?w=600',
    'Tradición argentina rellena de sabrosa carne.',
    JSON.stringify(['Masa de empanadas', 'Carne cortada a cuchillo', 'Cebolla blanca', 'Huevo duro', 'Aceitunas', 'Comino']),
    JSON.stringify(['Cocinar el relleno.', 'Rellenar los discos de masa.', 'Cerrar con repulgue.', 'Hornear hasta dorar.'])
  );
  insert.run(
    'Choripán con Salsa Criolla',
    '15 min',
    '500 kcal',
    JSON.stringify(['Argentina', 'Rápido', 'Parrilla']),
    'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600',
    'El street food argentino por excelencia.',
    JSON.stringify(['Chorizo criollo', 'Pan de baguete', 'Tomate', 'Cebolla', 'Pimiento', 'Vinagre']),
    JSON.stringify(['Asar el chorizo.', 'Abrir el pan y tostar.', 'Preparar criolla con verduras picadas.', 'Servir con abundante salsa.'])
  );
  insert.run(
    'Ojo de Bife con Chimichurri',
    '20 min',
    '650 kcal',
    JSON.stringify(['Argentina', 'Carne', 'Parrilla']),
    'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600',
    'Corte premium argentino asado a la perfección.',
    JSON.stringify(['Ojo de bife', 'Chimichurri', 'Sal gruesa', 'Patatas']),
    JSON.stringify(['Sellar la carne.', 'Cocinar al punto deseado.', 'Añadir chimichurri al servir.'])
  );

  // Veganas
  insert.run(
    'Berenjenas Asadas con Miso',
    '30 min',
    '250 kcal',
    JSON.stringify(['Vegana', 'Japonesa', 'Saludable']),
    'https://images.unsplash.com/photo-1559181567-c3190cb9959b?w=600',
    'Nasu Dengaku: Berenjenas caramelizadas con glaseado de miso.',
    JSON.stringify(['Berenjenas', 'Miso blanco', 'Mirin', 'Azúcar', 'Semillas de sésamo']),
    JSON.stringify(['Cortar berenjenas.', 'Asar al horno.', 'Pintar con la salsa de miso.', 'Gratinar 5 min.'])
  );
  insert.run(
    'Poke Bowl de Salmón Vegie',
    '15 min',
    '450 kcal',
    JSON.stringify(['Vegana', 'Saludable', 'Rápido']),
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
    'Bowl nutritivo con tofu marinado estilo poke.',
    JSON.stringify(['Tofu ahumado', 'Arroz integral', 'Aguacate', 'Edamame', 'Wakame']),
    JSON.stringify(['Preparar la base.', 'Montar ingredientes.', 'Aliñar con salsa de soja.'])
  );
}

export default db;
