const apiBaseUrl = "http://localhost:3000"
const stadiumsPath = "/albuns"
const photosPath = "/photos"
const highlightsPath = "/highlights"

function renderHomePage() {
    // Insert the home-page component into the 'app' div
    fetch('app/home-page/home-page.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('app').innerHTML = html;
            if ($('#map').length) {
                mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmVwY2FycmFybyIsImEiOiJjbHBwbnByc3AweHQ2MmpxbmQ4Y2l4enZ3In0.O0LGo9P1_dnUY-m89CcX3w';

                const map = new mapboxgl.Map({
                    container: 'map',
                    style: 'mapbox://styles/mapbox/streets-v12',
                    center: [-43.938641, -19.919118],
                    zoom: 10,
                });
            }
            fetch(`${apiBaseUrl}${stadiumsPath}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/JSON' }
            })
                .then(res => res.json())
                .then(data => { if ($("#cards-grid").length) { showAlbums(data) } })
                .catch(error => {
                    console.error(error)
                });

            fetch(`${apiBaseUrl}${highlightsPath}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/JSON' }
            })
                .then(res => res.json())
                .then(data => { if ($("#cards-grid").length) { showHightlights(data) } })
                .catch(error => {
                    console.error(error)
                });
        });

}

function renderDetailsPage(param) {
    fetch('app/stadium-details-page/stadium-details-page.html')
        .then(response => response.text())
        .then(html => {
            fetch(`${apiBaseUrl}${stadiumsPath}/${param}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/JSON' }
            })
                .then(res => res.json())
                .then(data => {
                    const tempContainer = document.createElement('div');
                    tempContainer.innerHTML = html;
                    tempContainer.querySelector("#title").innerHTML = data.title
                    tempContainer.querySelector("#complete-description").innerHTML = data.description
                    tempContainer.querySelector("#image-stadium").src = data.image
                    tempContainer.querySelector("#street-address").innerHTML = data.location
                    tempContainer.querySelector("#open-date").innerHTML = data.opened
                    document.getElementById('app').innerHTML = '';
                    document.getElementById('app').appendChild(tempContainer.querySelector("#details"));

                    fetch('app/image-album-item/image-album-item.html')
                        .then(response => response.text())
                        .then(btnHtml => {
                            fetch(`${apiBaseUrl}${photosPath}?idAlbum=${param}`, {
                                method: 'GET',
                                headers: { 'Content-Type': 'application/JSON' }
                            })
                                .then(res => res.json())
                                .then(photos => {
                                    photos?.forEach((photo, index) => {
                                        let tempElement = document.createElement('div');
                                        tempElement.innerHTML = btnHtml;
                                        tempElement.querySelector("#image-item-src").src = photo.image;
                                        tempElement.querySelector("#image-item-src")["data-slide-to"] = index;

                                        document.getElementById('album-grid').appendChild(tempElement.querySelector("#image-album-btn"));

                                        tempElement = document.createElement('div');
                                        tempElement.innerHTML = `                            
                                        <div id="carousel-image-${index}" class="carousel-item">
                                            <img class="d-block w-100" src="${photo.image}" alt="${photo.description}" onclick="zoomImage('carousel-image-${index}')" />
                                        </div>`;

                                        const tempIndicator = document.createElement('div');
                                        tempIndicator.innerHTML = `<li id="indicator-li-${index}" data-target="#modal-carousel" data-slide-to=${index + 1}></li>`;

                                        if (index == 0) {
                                            tempIndicator.querySelector("#indicator-li-0").classList.add("active");
                                            tempElement.querySelector("#carousel-image-0").classList.add("active");
                                        }

                                        document.getElementById('modal-carousel-indicator').appendChild(tempIndicator.querySelector(`#indicator-li-${index}`));
                                        document.getElementById('modal-carousel-inner').appendChild(tempElement.querySelector(`#carousel-image-${index}`));
                                    })
                                });
                        });


                    if ($('#detailsMap').length) {
                        mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmVwY2FycmFybyIsImEiOiJjbHBwbnByc3AweHQ2MmpxbmQ4Y2l4enZ3In0.O0LGo9P1_dnUY-m89CcX3w';

                        const detailsMap = new mapboxgl.Map({
                            container: 'detailsMap',
                            style: 'mapbox://styles/mapbox/streets-v12',
                            center: [data.coordinates.longitude, data.coordinates.latitude],
                            zoom: 15,
                        });

                        const marker = new mapboxgl.Marker()
                            .setLngLat([data.coordinates.longitude, data.coordinates.latitude])
                            .addTo(detailsMap);
                    }
                })
                .catch(error => {
                    console.error(error)
                });

        });

}

function showAlbums(albums) {
    fetch('app/home-page-card/home-page-card.html')
        .then(response => response.text())
        .then(html => {
            albums?.forEach(element => {
                const tempContainer = document.createElement('div');
                tempContainer.innerHTML = html;
                tempContainer.querySelector("#description").innerHTML = element.description
                tempContainer.querySelector("#stadium-detail-url").href = `#/details/id=${element.id}`
                tempContainer.querySelector("#image-stadium").src = element.image

                document.getElementById('cards-grid').appendChild(tempContainer.querySelector("#stadium-detail-url"))
            });
        })
}

function showHightlights(hightlights) {
    fetch('app/carousel/carousel.html')
        .then(response => response.text())
        .then(htmlCarousel => {
            const tempCarousel = document.createElement('div');
            tempCarousel.innerHTML = htmlCarousel;
            fetch('app/carousel-item/carousel-item.html')
                .then(response => response.text())
                .then(html => {
                    hightlights?.forEach((element, index) => {
                        const tempContainer = document.createElement('div');
                        tempContainer.innerHTML = html;
                        tempContainer.querySelector("#highlight-title").innerHTML = element.title
                        tempContainer.querySelector("#highlight-description").innerHTML = element.description
                        tempContainer.querySelector("#highlight-image").src = element.image
                        tempContainer.querySelector("#highlight-album-url").href = `#/details/id=${element.idAlbum}`

                        const tempIndicator = document.createElement('div');
                        tempIndicator.innerHTML = `<li id="indicator-li" data-target="#myCarousel" data-slide-to=${index + 1}></li>`;

                        if (index == 0) {
                            tempIndicator.querySelector("#indicator-li").classList.add("active");
                            tempContainer.querySelector("#carousel-item-component").classList.add("active");
                        }

                        tempCarousel.querySelector('#carousel-indicators').appendChild(tempIndicator.querySelector("#indicator-li"))
                        tempCarousel.querySelector('#carousel-items').appendChild(tempContainer.querySelector("#carousel-item-component"))
                    });
                    document.getElementById('carousel-div').appendChild(tempCarousel.querySelector('#myCarousel'))
                })
        })
}

function fillAlbum(data) {
    fetch('app/image-album-item/image-album-item.html')
        .then(response => response.text())
        .then(html => {
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = html;
            tempContainer.querySelector("#description").innerHTML = element.description
            tempContainer.querySelector("#stadium-detail-url").href = `#/details/id=${element.id}`
            tempContainer.querySelector("#image-stadium").src = element.image

            document.getElementById('image-album-item').appendChild(tempContainer.querySelector("#image-album-btn"))

        })
}

document.addEventListener('DOMContentLoaded', function () {
    const contentContainer = document.getElementById('app');

    function renderContent(route, params) {
        switch (route) {
            case '':
                renderHomePage();
                window.scrollTo(0, 0);
                break;
            case 'details':
                renderDetailsPage(params.id);
                window.scrollTo(0, 0);
                break;
            default:
                contentContainer.innerHTML = '<h2>Page Not Found</h2>';
        }
    }

    function handleNavigation() {
        const hash = window.location.hash;
        const [route, paramsString] = hash.slice(2).split('/');
        const params = {};

        // Parse route parameters
        if (paramsString) {
            const [key, value] = paramsString.split('=');
            params[key] = value;
        }

        renderContent(route, params);
    }

    // Initial render
    handleNavigation();

    // Listen for changes in the hash (fragment identifier) to handle navigation
    window.addEventListener('hashchange', handleNavigation);
});