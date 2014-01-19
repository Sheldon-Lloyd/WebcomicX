
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
