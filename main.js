if ("serviceWorker" in navigator) {
    console.log("Service worker supported");

    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./service-worker.js")
            .then(registration => {
                console.log(`Service worker successfully registered, scope ${registration.scope}`);
            })
            .catch(error => {
                console.log(`There was an error while registering: ${error}`);
            });
    });
}