angular.module('app', [
    'ngMaterial',
    'monospaced.elastic'
]);

angular
    .module('app')
    .run(run);

function run() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAdKKNqBFf-8jRFooYC8eEiQUPq996q450",
        authDomain: "interview-helper-86452.firebaseapp.com",
        databaseURL: "https://interview-helper-86452.firebaseio.com",
        projectId: "interview-helper-86452",
        storageBucket: "",
        messagingSenderId: "65288929587"
    };
    firebase.initializeApp(config);
}