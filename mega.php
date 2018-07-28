<!DOCTYPE html>
<html lang="en">
  <head>
 <meta charset="UTF-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>WG Tutoriales</title>

    <!-- Styles -->

    <!-- Favicons -->
    <link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
    <link rel="icon" href="assets/img/favicon.png">

	<!-- Core Funcs -->
  	<script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
  	<script src="http://content.jwplatform.com/libraries/IDzF9Zmk.js"></script>
	<!-- END Core Funcs -->
	<style>
		* {
		    margin: 0px;
		}
		html {
		    overflow: hidden;
		}
	</style>	    
  </head>

<body>
	<div id="encrpyt">
		
	</div>
	<!-- Core Streaming -->
	<script>
			jwplayer.key = "Khpp2dHxlBJHC8MCmLnBuV2jK/DwDnJMniwF6EO9HC/riJ712ZmbHg=="; 			

			var player = jwplayer('encrpyt');

			player.setup({
			  title: "WG Tutoriales",
			  description: "WG Tutoriales",			
			  sources: [ {
					file: "http://nerdecuador.com/21/me/mega/m.php?id=<?=$_GET['v']?>",
					type: "video/mp4"
					}
			  ],
			  autostart: false,      
			  playbackRateControls: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2],   
			  abouttext: "WG Tutoriales", 
			  	 	  aboutlink: "",         
 
			  width: $(window).width(),
		      height: $(window).height()	          
			});

			$(document).ready(function() {
				$(window).resize(function(){
					jwplayer().resize($(window).width(),$(window).height())
				})
			})

	</script>
	<!-- END Core Streaming -->
</body>
</html>