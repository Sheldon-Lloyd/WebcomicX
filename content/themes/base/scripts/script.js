
var pageNo = window.location.hash.match(/\d+/) | 0;
var i = pageNo - 1;
var navLink = "";
var url = window.location.pathname;
url = url.split("/");
currentComic = parseInt(url[3]);
var preComic = currentComic - 1;
var xmlDoc2;
var x2;
var x;
var comicList;
var comicCount;
var filename = "/content/xml/comics/comic-" + currentComic + ".xml";


function displayPage(){
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.open("GET",filename,false);
xmlhttp.send();
xmlDoc=xmlhttp.responseXML;;

    xmlhttp.open("GET", "/content/xml/comics/comic-list.xml", false);
    xmlhttp.send();
    comicListXml = xmlhttp.responseXML;
    comicList = comicListXml.getElementsByTagName("Comic");


if (preComic > 0) {
    xmlhttp.open("GET", "/content/xml/comics/comic-" + preComic + ".xml", false);
    xmlhttp.send();
    xmlDoc2 = xmlhttp.responseXML;
    x2 = xmlDoc2.getElementsByTagName("Page");
}
x=xmlDoc.getElementsByTagName("Page");
    
    var image = "";
    var author = "";
    var txt = "";
    pubDate;
    try{
    pubDate = new Date(comicList[(currentComic-1)].getElementsByTagName("Date")[0].childNodes[0].nodeValue);
    }
    catch(error){
        
    }

    try{
        if (pageNo > 0 && x.length > 0) {
        txt=(x[i].getElementsByTagName("Content")[0].childNodes[0].nodeValue.split(/\r?\n/).join("<br>"));     
        }  
        else{
            txt = (comicList[(currentComic - 1)].getElementsByTagName("Content")[0].childNodes[0].nodeValue.split(/\r?\n/).join("<br>"));
        }
    }
    catch(error){
        
    }
    try{
        author="By " + (x[i].getElementsByTagName("Author")[0].childNodes[0].nodeValue) + " on ";
        
    }
    catch(error){
        
    }
    try{
            image = (x[i].getElementsByTagName("Image")[0].childNodes[0].nodeValue);
    }
    catch(err){
        
    }
    try{
    pubDate = new Date(x[i].getElementsByTagName("Date")[0].childNodes[0].nodeValue);
    }
    catch(err){
        
    }
    $("#authorComments").html(txt);
    var img = new Image();
    if(image!=""){
    img.src = "/content/uploads/pages/" +image;
    img.clientWidth;
    }
    var months = [ "January", "February", "March", "April", "May", "June",
   "July", "August", "September", "October", "November", "December" ];

    var fullPublishDate;
    try{
    fullPublishDate = months[pubDate.getMonth()] + ", " + pubDate.getDate() + " " + pubDate.getFullYear();
    }
    catch(error){
        
    }

    if(image!=""){
    $("#pageContent").html("<img src='" +img.src+"' height='auto' width='auto'>");
    }
    else{
        var comicTitle = comicList[(currentComic - 1)].getElementsByTagName("Title")[0].childNodes[0].nodeValue,
        placeHolder ='<div class="comic-placeholder"><div class="inner-placeholder"><h3 class="comic-placeholder-title">'+comicTitle+'</h3></div></div>';
        $("#pageContent").html(placeHolder);
    }
    $("#pubDate").html(author + " " + fullPublishDate);
    //preload images
    for (var im=(i+1);im<(i+3);im++){
    try{
    var img = new Image();
    if((x[im].getElementsByTagName("Image")[0].childNodes[0].nodeValue!="")){
    img.src = "/content/uploads/pages/" +(x[im].getElementsByTagName("Image")[0].childNodes[0].nodeValue);
    }
    }
    catch(Error){
        
    }
        
    }
    /*try{
    var img2 = new Image();
    img2.src = "/content/uploads/pages/" +(x[i+2].getElementsByTagName("Image")[0].childNodes[0].nodeValue);
    }
    catch(Error){
        
    }*/
    if (pageNo > 0 && x.length>0) {
        $("#pageNo").html((i + 1));
        $("#page").val(pageNo);
    }
    navLink="#!/page/"+(i+1);
    if (i > 0) {
        $("a.previous").attr("href", "#!/page/" + (pageNo - 1));
    }
    if (i < x.length - 1) {
        $("a.next").attr("href", "#!/page/" + (pageNo + 1));
    }
    else if (pageNo == x.length) {
        $("a.next").attr("href", "#!/page/" + (pageNo));
    }
    editNav();
        var viewportHeight = $(window).height(),
        viewportPosition = $('body').scrollTop(),
        elementPosition = $(".webcomic").offset().top;

        elementScrollPosition = elementPosition - viewportPosition;
        if(elementScrollPosition<0||elementScrollPosition>viewportHeight){
    $(function () {
        $(document).scrollTop(0);
    });
        }

}


    function go(elementID) {
        var myElement = elementID.id;
        var e = document.getElementById(myElement);
        var gotoUrl = "/comic/read/" + e.options[e.selectedIndex].value;
        window.location = gotoUrl;
    }
    function pageGo(elementID) {
        var myElement = elementID.id;
        var e = document.getElementById(myElement);
        gotoUrl ="#!/page/"+e.options[e.selectedIndex].value;
        window.location = gotoUrl;
        i=e.selectedIndex;
        //displayPage();
    }

function checkKey(e) {
    e = e || window.event;
    if(e.keyCode==37){
    previous();
    }
    if(e.keyCode==39){
    next();
    }
}

document.onkeydown = checkKey;

function next() {
    if (i < x.length - 1) {
        i++;
        navLink = '#!/page/' + (i + 1);
        window.location = navLink;
        displayPage();
    }
    else {
        if (comicList.length > currentComic) {
            window.location = "/comic/read/" + (currentComic + 1) + "/#!/page/1";
        }
    }
    this.event.returnValue = false;
}

function previous() {
    if (i > 0) {
        i--;
        navLink = "#!/page/" + (i + 1);
        window.location = navLink;
        displayPage();
    }
    else {
        if (x2 != undefined) {
            window.location = "/comic/read/" + preComic + "/#!/page/" + (x2.length);
        }
    }
    this.event.returnValue = false;
}
function editNav() {
        
    if (currentComic < 2) {

        if (i <= 0) {
            $('.previous').hide();
        }
        else {
            $('.previous').show();
        }
    }
    if(comicList.length==currentComic){
        if (i >= x.length-1) {
            $('.next').hide();
        }
        else {
            $('.next').show();
        }
    }
}

$(window).load(function () {
    $(window).on('hashchange', function () {
        pageNo = window.location.hash.match(/\d+/) | 0;
        i = pageNo - 1;
        displayPage();
        if (i > 0) {
            $("a.previous").attr("href", "#!/page/" + (pageNo - 1));
        }
        if (i < x.length - 1) {
            $("a.next").attr("href", "#!/page/" + (pageNo + 1));
        }
        else if (pageNo == x.length) {
            $("a.next").attr("href", "#!/page/" + (pageNo));
        }

    });
    $(window).trigger('hashchange');

});

/*---------------------Accordion--------------------*/
    function horizontalNext(e) {
        e = $(e).parent();
        pages = $(e).children('.comic-collection');
        scrollPosition = $(pages).scrollLeft();
        var scrollLeft;
        $(".previous",e).show();
        w = $(pages).width();
        sw = $(pages).children('ul')[0].scrollWidth - w;
        if (scrollPosition < sw) {
            scrollLeft = scrollPosition + w;
            $(pages).animate({ scrollLeft: scrollLeft }, 500);
        }

    }
    function toggleScrollBtn(e){
        e = $(e).closest("li.accordion");
        pages = $(".comic-collection", e);
        scrollPosition = $(".comic-collection",e).scrollLeft();
        if (scrollPosition <= 0) {
            $(".previous",e).hide();
        }
        else{
            $(".previous",e).show();
        }
        w = $(pages).width();
        sw = $(pages).children('ul')[0].scrollWidth - w;
        if (scrollPosition >= sw) {
            $(".next",e).hide();
        }
        else {
            $(".next",e).show();
        }

    }
    function horizontalBack(e) {
        e = $(e).parent();
        pages = $(e).children('.comic-collection');
        $(".next",e).show();
        scrollPosition = $(pages).scrollLeft();
        w = $(pages).width();
        if (scrollPosition > 0) {
            scrollRight = scrollPosition - w;
            $(pages).animate({ scrollLeft: scrollRight }, 500
        );
        }
    }

    function accordion(e) {
        e = $(e).parent();
        $("h4.accordion span").html("+");
        $('div.is-hidden').slideUp(222);
        if (!$(".is-hidden", e).is(":visible")) {
            $('div.is-hidden', e).slideToggle(222);
            if ($("h4.accordion span", e).text() == "+") {
                $("h4.accordion span", e).html("&times;");
            }
            else {
                $("h4.accordion h4 span", e).html("+");
            }

        }
    }
