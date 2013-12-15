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


$(document).ready(function () {
var navLink = "";
var url = window.location.pathname;
url = url.split("/");
currentComic = parseInt(url[3]);

if(isNaN(currentComic)){
    try{
    currentComic = newest;
        
    }
    catch(Error){
        
    }
}
var preComic = currentComic - 1;
var xmlDoc2;
var x2;
var filename = "/content/xml/comics/comic-" + currentComic + ".xml";

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
xmlDoc=xmlhttp.responseXML;

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
i=0;
function displayPage(){}
function editLink(){}
function editNav(){}

    function go(elementID) {
        var myElement = elementID.id;
        var e = document.getElementById(myElement);
        var gotoUrl = "/comic/read/"+ e.options[e.selectedIndex].value;
        window.location = gotoUrl;
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
    if (comicList.length > currentComic) {
        window.location = "/comic/read/" + (currentComic + 1);
    }
}

function previous() {
    if (x2 != undefined) {
        window.location = "/comic/read/" + preComic;
    }
}

});