var images = ["images/bg/home.jpg","images/bg/drama.jpg","images/bg/contact.jpeg","images/bg/sponsor.jpg","images/bg/ec_back_2","images/bg/ec_back"];
var x1 = 0;
var percent = 0;
var i = 0;
$.preload(images);
$.preload(images,{
  eachOnLoad: function(){
    x1++;
    percent = (x1/(images.length))*100;
   	$(".count").text(percent.toFixed(0)+'%');

    if (x1 == images.length)
    {
     setTimeout(function(){
      $(".loading").fadeOut(1000);
      setTimeout(function(){
        myFunction();
      },1200)
      $(".bla").fadeOut(1000);
     },500)
    };

   	}});


  