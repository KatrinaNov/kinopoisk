const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w500';

function apiSearch(event){
    event.preventDefault();
    const searchText = document.querySelector('.form-control').value; 
    // обрабатываем пустую строку. trim() убирает все пробелы вначале и в конце
    if (searchText.trim().length===0){
        movie.innerHTML='<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым!</h2>';
        return;
    }
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=70d8fac1028c54c857cabcd36b9b40d2&language=ru-Ru&query=' + searchText;
    movie.innerHTML ='<div class="spinner"></div>';
    
    fetch(server)
    .then(function(value){
            if (value.status !==200){
            return Promise.reject(value);
        }
        return value.json();
    })
    .then(function(output){
        let inner = "";
        // если ничего не найдено
        if (output.results.length===0){
            inner ='<h2 class="col-12 text-center text-primary">По Вашему запросу ничего не найдено</h2>';
        }
        output.results.forEach(function(item){
            // название фильма или сериала
            let nameItem = item.name || item.title;
            // постер, если постер отсутствует, ставим заглушку
            const poster = item.poster_path ? urlPoster + item.poster_path : './images/noposter.jpg';
            // год выпуска
            let firstdateItem = item.first_air_date || item.release_date;
            // firstdateItem=firstdateItem.split("-");
            // дата атрибут
            let dataInfo ='';
            if (item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
            inner += `
            <div class="col-12 col-md-4 col-xl-3 item">
            <img src="${poster}" class="img_poster" alt="${nameItem}" ${dataInfo}>
            <h5>${nameItem}, ${firstdateItem}.</h5></div>`;
        });
        movie.innerHTML = inner; 
        addEventMedia();
        
    })
    .catch(function(reason){
        movie.innerHTML ='Упс ,что-то пошло не так!';
        console.error('error:' + reason.status);
    });  
}
searchForm.addEventListener('submit', apiSearch);

function addEventMedia(){
    const media = movie.querySelectorAll('img[data-id]');
        media.forEach(function(elem){
            elem.style.cursor ='pointer';
            elem.addEventListener('click', showFullInfo);
        });
}

function showFullInfo(){
    let url ="";
   
    if (this.dataset.type ==="movie"){
        url = "https://api.themoviedb.org/3/movie/"+this.dataset.id +"?api_key=70d8fac1028c54c857cabcd36b9b40d2&language=ru-Ru";
    }
    else if (this.dataset.type==="tv"){
        url = "https://api.themoviedb.org/3/tv/" + this.dataset.id +"?api_key=70d8fac1028c54c857cabcd36b9b40d2&language=ru-Ru";
    }
    else {
        movie.innerHTML='<h2 class="col-12 text-center text-danger">Произошла ошибка, попробуйте позже!</h2>';
    }
    
    fetch(url)
    .then(function(value){
            if (value.status !==200){
            return Promise.reject(value);
        }
        return value.json();
    })
    .then( (output) =>{
      let genres='';
      output.genres.forEach(function(genre){
          genres+=genre.name +', ';
      })
      genres=genres.substr(0, genres.length-2) + '.';

        movie.innerHTML= `
        <h4 class="col-12 text-center text-primary">${output.name || output.title}</h4>
        <div class="col-4">
            <img src='${urlPoster + output.poster_path}' alt='${output.name || output.title}'>
            ${(output.homepage) ? `<p class="text-center"><a href="${output.homepage}" target="_blank">Официальная страница</a></p>` : ''}
            ${(output.imdb_id) ? `<p class="text-center"><a href="https://imdb.com/title/${output.imdb_id}" target="_blank">Страница на imdb.com</a></p>` : ''}

        </div>
        <div class="col-8">
            <p>Рейтинг: ${output.vote_average}</p>
            <p>Статус: ${output.status}</p>
            <p>Премьера: ${output.first_air_date || output.release_date}</p>
            <p>Жанр: ${genres}</p>
            ${(output.last_episode_to_air) ? `<p>${output.number_of_seasons} сезон (сезонов), ${output.number_of_episodes} серий.</p>` : ''}

            <p>Описание: ${output.overview}</p>
            
             <br>
             <div class = "youtube"></div>
             
        </div>
        `;
      
        getVideo(this.dataset.type, this.dataset.id);
        
    })
    .catch(function(reason){
        movie.innerHTML ='Упс ,что-то пошло не так!';
        console.error('error:' + reason.status);
    });  
   
}

document.addEventListener('DOMContentLoaded', function(){
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=70d8fac1028c54c857cabcd36b9b40d2&language=ru')
    .then(function(value){
            if (value.status !==200){
            return Promise.reject(value);
        }
        return value.json();
    })
    .then(function(output){
        let inner ='<h4 class="col-12 text-center text-primary">Популярное за неделю!</h4>';
        // если ничего не найдено
        if (output.results.length===0){
            inner ='<h2 class="col-12 text-center text-primary">По Вашему запросу ничего не найдено</h2>';
        }
        output.results.forEach(function(item){
            // название фильма или сериала
            let nameItem = item.name || item.title;
            let mediaType = item.title ? "movie" : "tv";
            // постер, если постер отсутствует, ставим заглушку
            const poster = item.poster_path ? urlPoster + item.poster_path : './images/noposter.jpg';
            // год выпуска
            let firstdateItem = item.first_air_date  || item.release_date ;
            firstdateItem = (firstdateItem !=='' && firstdateItem !=='undefined') ?firstdateItem=firstdateItem.split("-")[0] + 'г.' : '';
            // дата атрибут
            let dataInfo =`data-id="${item.id}" data-type="${mediaType}"`;
            
            inner += `
            <div class="col-12 col-md-4 col-xl-3 item">
            <img src="${poster}" class="img_poster" alt="${nameItem}" ${dataInfo}>
            <h5>${nameItem}</h5> ${firstdateItem}</div>`;
        });
        movie.innerHTML = inner; 
        addEventMedia();
        
    })
    .catch(function(reason){
        movie.innerHTML ='Упс ,что-то пошло не так!';
        console.error('error:' + reason.status);
    });  
});

function getVideo(type, id){
    let youtube = movie.querySelector('.youtube');

    fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=70d8fac1028c54c857cabcd36b9b40d2&language=ru-Ru`)
        .then((value) => {
            if (value.status !==200){
            return Promise.reject(value);
        }
        return value.json();
    })
    .then((output) => {
        let videoFrame = '<h5 class="col-12  text-primary">Видео</h5>';

        if (output.results.length ===0) {
            videoFrame = '<p>К сожалению, видео отсутствует.</p>';
        }
        output.results.forEach((item)=>{
            videoFrame +=`<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        });
        youtube.innerHTML = videoFrame;
    })
    .catch((reason)=>{
        youtube.innerHTML ='Видео отсутствует';
        console.error('error:' + reason.status);
    });
  
}