const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');

function apiSearch(event){
    event.preventDefault();
    const searchText = document.querySelector('.form-control').value, 
    server = 'https://api.themoviedb.org/3/search/multi?api_key=70d8fac1028c54c857cabcd36b9b40d2&language=ru-Ru&query=' + searchText;
    movie.innerHTML ='Загрузка';

    requestApi(server)
   .then(function(result){
        const output = JSON.parse(result);
        console.log(output);
        let inner = "";
        output.results.forEach(function(item){
            let nameItem = item.name || item.title;
            let firstdateItem = item.first_air_date || item.release_date;
            firstdateItem=firstdateItem.split("-");
            inner += `<div class="col-8">${nameItem}</div> <div class="col-4">${firstdateItem[0]}</div>`;
        });
        movie.innerHTML = inner; 
    })
    .catch(function(reason){
        movie.innerHTML ='Упс ,что-то пошло не так!';
        console.log('error' + reason.status);
    });
    ;
}
searchForm.addEventListener('submit', apiSearch);

function requestApi(url) {
    return new Promise (function (resolve, reject){
        const request =new XMLHttpRequest();
        request.open('GET', url);
        request.addEventListener('load', function(){
            if (request.status!==200) {
                reject({status: request.status});
                return;
            }

            resolve(request.response);
        });
        request.addEventListener('error', function(){
            reject({status: request.status});
        });
        request.send();

    })
}






