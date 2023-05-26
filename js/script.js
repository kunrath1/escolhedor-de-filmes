function escolherGenero() {
    var generos = {
        "Ação": 28,
        "Animação": 16,
        "Clássicos": 18,
        "Comédia": 35,
        "Crime": 80,
        "Documentário": 99,
        "Drama": 18,
        "Fantasia": 14,
        "Ficção científica": 878,
        "Filmes estrangeiros": 7462,
        "Horror": 27,
        "Infantil": 10751,
        "Musical": 10402,
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

$(document).ready(function() {
    var apiKey = "759bad539ddefc7a0f8e919f353a24b0"; // Sua chave de API do TMDb


    $("#btnRandomMovie").click(function() {
        var genreId = $(this).data("genre-id");

        $.ajax({
            url: "https://api.themoviedb.org/3/discover/movie",
            type: "GET",
            data: {
                api_key: apiKey,
                with_genres: genreId,
                sort_by: "popularity.desc",
                include_adult: false,
                page: Math.floor(Math.random() * 20) + 1 // Altere o número "20" conforme necessário
            },
            success: function(result) {
                var movies = result.results;
                if (movies.length > 0) {
                    var randomIndex = Math.floor(Math.random() * movies.length);
                    var randomMovie = movies[randomIndex];
                    var movieTitle = randomMovie.title;
                    var movieOverview = randomMovie.overview;
                    var movieReleaseDate = randomMovie.release_date;

                    $('.sinopse_filme').removeClass('d-none');
                    $("#movieTitle").text("Filme: " + movieTitle);
                    $("#movieOverview").text(movieOverview);
                    $("#movieReleaseDate").text("Data de lançamento: " + movieReleaseDate);
                } else {
                    $("#movieTitle").text("Nenhum filme encontrado nesse gênero.");
                    $("#movieOverview").text("");
                    $("#movieReleaseDate").text("");
                }
            },
            error: function() {
                $("#movieTitle").text("Erro ao obter filme aleatório.");
                $("#movieOverview").text("");
                $("#movieReleaseDate").text("");
            }
        });
    });
});
