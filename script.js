const searchRes = document.getElementById("search-results")
const searchBar = document.getElementById("search-bar")
const searchBtn = document.getElementById("search-btn")
const addedMovies = document.getElementById("added-movies")

const API_KEY = "fb85febe"
let ids = JSON.parse(localStorage.getItem("watchList")) || []

async function fetchMovieById(id){
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`)
    return res.json()
}

async function fetchMovies(query){
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`)
    const data = await res.json()
    if(data.Response !=="True") return[]
    return Promise.all(
        data.Search.map(movie => fetchMovieById(movie.imdbID))
    )
}

// when user enters text and presses search button renders list of movies that include the text

// let detailMovies = []

// async function fetchMovies(query){
//     const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`)
//     const data = await response.json()

//     if(data.Response ==="True"){
//         const movieList = data.Search
//         const detailPromises = (movieList.map(movie=>
//             fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}&plot=full`)
//                 .then(res=>res.json())
//         ))
//         detailMovies = await Promise.all(detailPromises)   
//     }
//     return detailMovies
// }

function renderList(movies, where, {showAdd = false, showRemove = false} = {}){
    if(!where) return
    let fill =""
    movies.forEach(movie=>{
        fill += `
        <div class="movie-wrapper">
            <img class='poster' src="${movie.Poster}">
            <div class="des-wrapper">
                <div class='title-rating'>
                    <h4>${movie.Title}</h4>
                    <p>Rating: ${movie.imdbRating}/10</p>
                </div>
                <div class='time-genre-add'>
                    <p>${movie.Runtime}</p>
                    <p>${movie.Genre}</p>
                    ${showAdd?`
                    <div class='add-movie' data-id=${movie.imdbID}>
                        <span>+ Add Movie</span>
                    </div>
                    `:""}
                    ${showRemove?`
                    <div class='remove-movie' data-id=${movie.imdbID}>
                        <span>- Remove</span>
                    </div>                    
                    `:""}
                </div>
                <p>${movie.Plot}</p>
            </div>
        </div>`
    })
    where.innerHTML = fill;
}

if(searchBar){
    searchBar.addEventListener("input",async()=>{
        const query= searchBar.value.trim().toLowerCase()
        if(query.length < 3) return

        const movies = await fetchMovies(query)
        renderList(movies, searchRes, {showAdd:true})
    })
}

if(addedMovies){
    Promise.all(ids.map(fetchMovieById))
        .then(movies => renderList(movies, addedMovies, {showRemove: true}))
}


// Click the add movie button, this adds movie to a list which is then rendered onto list.html


window.addEventListener("click", async e => {
    const addBtn = e.target.closest(".add-movie")
    const removeBtn = e.target.closest(".remove-movie")

    if (addBtn) {
        const id = addBtn.dataset.id
        if (!ids.includes(id)) {
            ids.unshift(id)
            localStorage.setItem("watchList", JSON.stringify(ids))
        }
    }

    if (removeBtn) {
        const id = removeBtn.dataset.id
        ids = ids.filter(stored => stored !== id)
        localStorage.setItem("watchList", JSON.stringify(ids))
    }

    if (addedMovies) {
        const movies = await Promise.all(ids.map(fetchMovieById))
        renderList(movies, addedMovies, { showRemove: true })
    }
})


const contactForm = document.getElementById("contact-form")


if (contactForm) {
    contactForm.addEventListener("submit", e => {
        e.preventDefault()
        const name = document.getElementById("name").value.trim()
        const email = document.getElementById("email").value.trim()
        const subject = document.getElementById("subject").value.trim()
        const message = document.getElementById("message").value.trim()

        if (!name || !email || !message) {
            alert("Please fill in name, email, and message.")
            return
        }

        const submission = {
            id: Date.now(),
            name,
            email,
            subject,
            message,
            date: new Date().toLocaleDateString()
        }

        const existing = JSON.parse(localStorage.getItem("contactSubmissions")) || []
        existing.unshift(submission)
        localStorage.setItem("contactSubmissions", JSON.stringify(existing))

        document.getElementById("contact-success").style.display = "block"
        contactForm.reset()
    })
}


// window.addEventListener("click",async(e)=>{
//     if(e.target.classList.contains("add-movie")){
//         const id = e.target.dataset.id
//         if(!ids.includes(id)){
//             ids.push(id)
//             localStorage.setItem("watchList", JSON.stringify(ids))
//         }
//         const moviesPromise = ids.map(id=>
//         fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`)
//             .then(res=>res.json())   
//         )
//         const movies = await Promise.all(moviesPromise)
//         renderList(movies,addedMovies,{showRemove:true})
//     }

//     if(e.target.classList.contains("remove-movie")){
//         const id = e.target.dataset.id
//         if(ids.includes(id)){
//             ids = ids.filter(storeId=>storeId !== id)
//             localStorage.setItem("watchList", JSON.stringify(ids))
//         }
//         const moviesPromise = ids.map(id=>
//         fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`)
//             .then(res=>res.json())   
//         )
//         const movies = await Promise.all(moviesPromise)
//         renderList(movies,addedMovies,{showRemove:true})
//     }


// })

// if (ids.length) {
//     Promise.all(
//         ids.map(id =>
//             fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`)
//                 .then(res => res.json())
//         )
//     ).then(movies => {
//         renderList(movies, addedMovies, { showRemove: true })
//     })
// }






