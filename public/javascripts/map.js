window.initMap = async function () {
    // Wait for the Google Maps API to be loaded
    await new Promise(resolve => {
        const checkGoogle = () => {
            if (window.google && window.google.maps) {
                resolve();
            } else {
                setTimeout(checkGoogle, 100);
            }
        };
        checkGoogle();
    });

    // Request needed libraries.
    const { Map, Marker } = google.maps;

    // Try to get the user's current location
    navigator.geolocation.getCurrentPosition(
        async position => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            // The map, centered at the user's location
            const map = new Map(document.getElementById("map"), {
                zoom: 12,
                center: userLocation,
                mapId: "DEMO_MAP_ID",
            });
             // Define a custom icon for the user's location
            const userIcon = {
              url: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" height="16" width="18" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path fill="#131520" d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg>'),
              scaledSize: new google.maps.Size(32, 32),
            };

            // Add a marker for the user's location
            const userMarker = new Marker({
                position: userLocation,
                map: map,
                title: "當前位置",
                icon: userIcon,
            });

            // Fetch restaurant data from restaurants.json
            try {
                const response = await fetch('/jsons/restaurants.json');
                if (!response.ok) {
                    throw new Error('Unable to fetch restaurant data');
                }
                const jsonData = await response.json();

                // Assuming your JSON structure is as follows:
                // { "results": [ { "id": 1, "name": "...", "location": "...", "geo": { "lat": ..., "lng": ... }, ... }, ... ] }
                const stores = jsonData.results;

                // Place markers on the map for each restaurant
                stores.forEach(store => {
                    const marker = new google.maps.Marker({
                        position: store.geo, // Using the "geo" property for the location
                        map: map,
                        title: store.name,
                    });

                    // 監聽地標的點擊事件
                    marker.addListener('click', () => {
                        // 在 InfoWindow 中顯示店家資訊
                        infoWindow.setContent(`
                            <div>
                                <h3>${store.name}</h3>
                                <p>地址: ${store.location}</p>
                                    <div class="restaurant-cta d-flex justify-content-evenly align-items-center">
      <a href="tel:+886-{{restaurant.phone}}" class="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="top"
        title="點擊撥打電話" style="white-space: nowrap;">
        <i class="fa-solid fa-phone"></i> ${store.phone}
      </a>
      <a href="/restaurant/${store.id}" class="btn btn-danger fs-6" data-bs-toggle="tooltip" data-bs-placement="top"
        title="分店線上點餐頁" style="white-space: nowrap;">
        <i class="fa-solid fa-cart-shopping"></i> 前往訂餐
      </a>
    </div>
                            </div>
                        `);

                        // 開啟 InfoWindow
                        infoWindow.open(map, marker);
                    });
                });
            } catch (error) {
                console.error('Error fetching restaurant data:', error);
            }
        },
        error => {
            console.error("Error getting user location:", error);
            // Handle error or default to a specific location
            const map = new Map(document.getElementById("map"), {
                zoom: 12,
                center: { lat: 25.033, lng: 121.565 },
                mapId: "DEMO_MAP_ID",
            });
        }
    );

    // 在地圖上建立一個 InfoWindow 實例
    const infoWindow = new google.maps.InfoWindow();

    // Ensure that the Google Maps API is loaded before calling initMap
    window.onload = function () {
        initMap();
    };

    window.addEventListener('resize', () => {
        // 重新設置地圖大小
        map.setDiv(document.getElementById('map'));
    });
};
