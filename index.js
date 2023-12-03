$(document).ready(function () {
    if ($('#map').length) {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmVwY2FycmFybyIsImEiOiJjbHBwbnByc3AweHQ2MmpxbmQ4Y2l4enZ3In0.O0LGo9P1_dnUY-m89CcX3w';

        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-43.938641, -19.919118],
            zoom: 10,
        });
    }
})

$(document).ready(function () {
    // Insert the home-page component into the 'app' div
    fetch('app/home-page/home-page.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('app').innerHTML = html;
        });
});