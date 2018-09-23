/*---------------------Accordion--------------------*/
    function horizontalNext(e) {
        e = $(e).parent();
        pages = $(e).children('.comic-collection');
        scrollPosition = $(pages).scrollLeft();
        var scrollLeft;
        $(".previous",e).show();
        w = $(pages).width();//width
        sw = $(pages).children('ul')[0].scrollWidth - w;//scroll width
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
        $(".accordion-toggle").html("+");
        $(".accordion-toggle").attr("title","Show pages");

        $('div.is-hidden').slideUp(222);
        if (!$(".is-hidden", e).is(":visible")) {
            $('div.is-hidden', e).slideToggle(222);
            if ($(".accordion-toggle", e).text() == "+") {
                $(".accordion-toggle", e).html("&times;");
                $(".accordion-toggle", e).attr("title","Hide pages");
            }
            else {
                $(".accordion-button", e).html("+");
                $(".accordion-toggle", e).attr("title","Show pages");

            }

        }
    }
    //accessible menu
$(document).ready(function () {
        $(".menu ul a").focus(function () {
            $(this).closest(".menu ul").css("display", "block");
        })
        $(".menu dl a").focusout(function () {
            $(this).closest(".menu ul").css("display", "");
        });
        //hide all captions
        $('.webcomic-img figcaption').css('top', '-100%');
        $('.page-script-hide').hide();
        $('.page-script-show').css('display', 'inline-block');

        //show caption
        $('.page-script-show').on('click', function () {
            event.preventDefault();
            $(this).closest('.webcomic-img').find('figcaption').css('top', '0%');
            $(this).hide();
            $(this).parent().find('.page-script-hide').css('display', 'inline-block');
        });
        //hide caption
        $('.page-script-hide').on('click', function () {
            event.preventDefault();
            $(this).closest('.webcomic-img').find('figcaption').css('top', '-100%');
            $(this).hide();
            $(this).parent().find('.page-script-show').css('display', 'inline-block');

        });

    });
$(document).ready(function () {
    var navLink = "";
    var url = window.location.pathname;
    url = url.split("/");
    currentComic = document.getElementById("chapters").options[document.getElementById("chapters").selectedIndex].value;

    if (isNaN(currentComic)) {
        try {
            currentComic = newest;

        }
        catch (Error) {

        }
    }
    var preComic = currentComic - 1;
    var x;
    var filename = "/content/xml/comics/comic-" + currentComic + ".xml";


    function checkKey(e) {
        e = e || window.event;
        if (e.keyCode == 37) {
            previous();
        }
        if (e.keyCode == 39) {
            next();
        }
    }

    document.onkeydown = checkKey;


    function next() {
        $.ajax({
            async: true, dataType: "xml", url: "/content/xml/comics/comic-list.xml", success: function (xml) {
                comicList = xml.getElementsByTagName("Comic");

                if (comicList.length > currentComic) {
                    window.location = "/comic/read/" + (parseInt(currentComic) + 1);
                }
            }
        });
    }

    function previous() {
        if (preComic > 0) {
            $.ajax({
                async: true, dataType: "xml", url: "/content/xml/comics/comic-" + preComic + ".xml", success: function (xml) {
                    x = xml.getElementsByTagName("Page");
                }
            });
        }

        if (x != undefined) {
            window.location = "/comic/read/" + preComic;
        }
    }

});
function go(elementID) {
    var myElement = elementID.id;
    var e = document.getElementById(myElement);
    var gotoUrl = "/comic/read/" + e.options[e.selectedIndex].value;
    window.location = gotoUrl;
}
