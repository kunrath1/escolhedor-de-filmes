function escolherGenero() {
    var generos = {
        "Ação": 28,
        "Aventura": 12,
        "Animação": 16,
        "Comédia": 35,
        "Crime": 80,
        "Documentário": 99,
        "Drama": 18,
        "Fantasia": 14,
        "Ficção científica": 878,
        "Familia": 10751,
        "Guerra": 10752,
        "Musical": 10402,
        "Mistério": 9648,
        "Romance": 10749,
        "Suspense": 53,
        "Terror": 27
    };

    var generosArray = Object.keys(generos);
    var generoAleatorio = generosArray[Math.floor(Math.random() * generosArray.length)];
    var generoId = generos[generoAleatorio];

    document.getElementById("genero").value = generoAleatorio;
    document.getElementById("resultado").textContent = "Gênero do filme: " + generoAleatorio;

    // Atualizar o ID do gênero na função do botão btnRandomMovie
    $("#btnRandomMovie").data("genre-id", generoId);
}

setTimeout(function() {
    var loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'none';

    var contentElement = document.querySelector('.container');
    contentElement.classList.add('fade-in');
}, 3000);

$(document).ready(function() {
    var apiKey = "759bad539ddefc7a0f8e919f353a24b0"; // Sua chave de API do TMDb
    var azureTranslateApiKey = "c0e783b50cf84c61b15053cca807ce57"; // Sua chave de API do Azure Translate
    var azureTranslateEndpoint = "https://api.cognitive.microsofttranslator.com";
  
    async function obterFilmeAleatorio() {
        var genreId = $("#btnRandomMovie").data("genre-id");
  
        try {
            var result = await $.ajax({
                url: "https://api.themoviedb.org/3/discover/movie",
                type: "GET",
                data: {
                    api_key: apiKey,
                    with_genres: genreId,
                    sort_by: "popularity.desc",
                    include_adult: false,
                    page: Math.floor(Math.random() * 20) + 1 // Altere o número "20" conforme necessário
                }
            });
  
            var movies = result.results;
            if (movies.length > 0) {
                var randomIndex = Math.floor(Math.random() * movies.length);
                var randomMovie = movies[randomIndex];
                var movieTitle = randomMovie.title;
                var movieOverview = randomMovie.overview;
                var movieReleaseDate = randomMovie.release_date;

                var movieDetails = await $.ajax({
                    url: `https://api.themoviedb.org/3/movie/${randomMovie.id}`,
                    type: "GET",
                    data: {
                      api_key: apiKey
                    }
                  });
                  var movieRuntime = movieDetails.runtime;
                  $("#movieRunTime").text("Duração: " + movieRuntime + " minutos");
                // Traduzir a sinopse do filme usando a API Azure Translate
                movieOverview = await traduzirTexto(movieOverview, azureTranslateApiKey, azureTranslateEndpoint, 'en', 'pt');
  
                $('.sinopse_filme').removeClass('d-none');
                $("#movieTitle").text(movieTitle);
                $("#movieOverview").text(movieOverview);
                $("#movieReleaseDate").text("Data de lançamento: " + movieReleaseDate);
  
                // Obter a capa do filme usando a função getMoviePoster
                var moviePosterPath = randomMovie.poster_path;
                var moviePosterUrl = await getMoviePoster(moviePosterPath, apiKey);
  
                // Exibir a capa do filme
                $("#moviePoster").attr("src", moviePosterUrl);
                
                // Exibir o terceiro quadrado
                $('#quartoQuadrado').slideDown();
                $('#terceiroQuadrado').slideDown();
  
            } else {
                $("#movieTitle").text("Nenhum filme encontrado nesse gênero.");
                $("#movieOverview").text("");
                $("#movieReleaseDate").text("");
            }
        } catch (error) {
            $("#movieTitle").text("Erro ao obter filme aleatório.");
            $("#movieOverview").text("");
            $("#movieReleaseDate").text("");
        }
    }
  
    $("#btnRandomMovie").click(obterFilmeAleatorio);
  
    // Função para obter a capa do filme
    async function getMoviePoster(posterPath, apiKey) {
        if (!posterPath) {
            return null;
        }
  
        var imageUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;
  
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error('Erro ao obter a capa do filme.');
        }
  
        return imageUrl;
    }
  
    // Função para fazer a chamada à API Azure Translate
    async function traduzirTexto(texto, apiKey, endpoint, idiomaOrigem, idiomaDestino) {
        const url = `${endpoint}/translate?api-version=3.0&from=${idiomaOrigem}&to=${idiomaDestino}`;
  
        const resposta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': apiKey,
                'Ocp-Apim-Subscription-Region': 'brazilsouth' // Insira a região da sua chave de API Azure Translate aqui
            },
            body: JSON.stringify([{ 'text': texto }])
        });
  
        const resultado = await resposta.json();
        return resultado[0].translations[0].text;
    }
});
