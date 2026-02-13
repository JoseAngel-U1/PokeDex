//! Modo oscuro y brillante:
//TODO: Gestión de temas
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

//TODO: Cargar preferencia de tema guardada
const savedTheme = localStorage.getItem('pokedexTheme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
        localStorage.setItem('pokedexTheme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        localStorage.setItem('pokedexTheme', 'gameboy');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
});

//! Fetch y  loguica para mostrar poquemones
//TODO: Gestión de datos Pokémon
let currentPokemonId = 1;
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pokemonContainer = document.getElementById('pokemonContainer');
const cache = new Map(); //* Cache para datos de Pokémon

//TODO: Mostrar indicador de carga
const showLoading = () => {
    pokemonContainer.innerHTML = '';

    const card = document.createElement('div');
    card.classList.add('pokemon-card');

    const spinner = document.createElement('div');
    spinner.classList.add('loading-spinner');

    card.appendChild(spinner);
    pokemonContainer.appendChild(card);

    //* Forzar la visualización inmediata del estado de carga
    return card;
};

//TODO: Fetch Pokémon data 
const fetchPokemon = async (id) => {
    if (cache.has(id)) {
        return cache.get(id);
    }

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        cache.set(id, data);
        return data;
    } catch (error) {
        console.error(`Error fetching Pokémon #${id}:`, error);
        return null;
    }
};

//TODO: Mostrar Pokémon
const displayPokemon = (pokemon) => {
    pokemonContainer.innerHTML = '';

    const card = document.createElement('div');
    card.classList.add('pokemon-card');

    const name = document.createElement('h2');
    name.classList.add('pokemon-name');
    name.textContent = pokemon.name.toUpperCase();

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('pokemon-image-container');

    const image = document.createElement('img');
    image.classList.add('pokemon-image');
    image.src = pokemon.sprites.front_default;
    image.alt = pokemon.name;

    const heightInMeters = (pokemon.height / 10).toFixed(1);
    const weightInKg = (pokemon.weight / 10).toFixed(1);

    const stats = document.createElement('div');
    stats.classList.add('pokemon-stats');
    stats.innerHTML = `HEIGHT: ${heightInMeters} M<br>WEIGHT: ${weightInKg} KG`;

    imageContainer.appendChild(image);
    card.appendChild(name);
    card.appendChild(imageContainer);
    card.appendChild(stats);

    pokemonContainer.appendChild(card);
};

//TODO: Cargar Pokémon con ID
const loadPokemon = async (id) => {
    const loadingCard = showLoading();

    //* Actualizar estados del botón
    prevBtn.disabled = id <= 1;

    const pokemon = await fetchPokemon(id);
    if (pokemon) {
        displayPokemon(pokemon);

        //* Precarga el Pokémon siguiente y anterior
        if (id > 1) {
            fetchPokemon(id - 1);
            if (id > 2) fetchPokemon(id - 2);
        }
        fetchPokemon(id + 1);
        fetchPokemon(id + 2);
    } else {
        loadingCard.textContent = "Pokémon not found";
    }
};

//TODO: Boton antes:
prevBtn.addEventListener('click', () => {
    if (currentPokemonId > 1) {
        currentPokemonId--;
        loadPokemon(currentPokemonId);
    }
});

//TODO: boton siguinte:
nextBtn.addEventListener('click', () => {
    currentPokemonId++;
    loadPokemon(currentPokemonId);
});

//TODO: Cargar el primer dato:
loadPokemon(currentPokemonId);
