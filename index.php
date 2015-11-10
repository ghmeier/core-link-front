<!DOCTYPE html>
<html lang="en" style="height:100%;">
    <head>
      <!-- META -->
        <meta charset="utf-8">
        <!--<meta name="viewport" content="width=device-width, initial-scale=1">-->
        <title>Core Link</title>

        <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.js"></script>
        <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular-route.js"></script>
        <script src="https://cdn.firebase.com/js/client/2.2.4/firebase.js"></script>
        <script src="https://cdn.firebase.com/libs/angularfire/1.1.3/angularfire.min.js"></script>

        <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
        <link rel="stylesheet" href="css/main.css">
        <link rel="stylesheet" href="css/font-awesome/css/font-awesome.min.css">
        <script src="libraries/angular-ui.js"></script>


        <script src="js/app.js"></script>
        <script src="js/controller.js"></script>
        <script src="js/controllers/login.js"></script>
        <script src="js/controllers/fleet.js"></script>
        <script src="js/controllers/planet.js"></script>
        <script src="js/services/http.js"></script>
    </head>


    <body ng-app="corelink" style="margin:0; padding:0; height:100%; margin-top:-20px;">
        <div>
            <div style="width:100%; height:100px; background:black;">
                <img style="margin-top:10px; margin-left:-10px; height:90px;" src="css/corelink.png"></img>
            </div>
            <ng-view></ng-view>
        </div>
    </body>

</html>