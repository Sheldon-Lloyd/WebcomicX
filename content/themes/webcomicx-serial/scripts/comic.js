(function ($) {
    $.fn.webcomicXreader = function (options) {
        var defaults = {
            comicNo: 1,
            pageNo: "undefined",
            updateVersion: "",
            comicCount:1
        },
            settings = $.extend({}, defaults, options);
            currentComic = "/content/xml/comics/comic-" + settings.comicNo + ".xml?updated=" + settings.updateVersion,
            preComic = "/content/xml/comics/comic-" + (settings.comicNo - 1) + ".xml?updated=" + settings.updateVersion;
        $.ajax({
            async:true, dataType: "xml", url: currentComic, success: function (xml) {
                var loadComic = function () {

                    //load contents of xml file for comic
                    var x;
                    try {
                        x = xml.getElementsByTagName("Page");
                    }
                    catch (Error) {
                        x = "";
                    }
                    var image = function () {
                        //get image for comic

                        var image = new Image(),
                            i = page.i();
                        try {
                            image.src = "/content/uploads/pages/" + (x[i].getElementsByTagName("Image")[0].childNodes[0].nodeValue);
                            image = '<img src="' + image.src + '" width="auto" height="auto">'
                        }
                        catch (Error) {
                            if (loadComic.content() == "") {
                                image = '<div class="comic-placeholder"><div class="inner-placeholder"><h3 class="comic-placeholder-title">Page ' + page.No() + '</h3></div></div>';
                            }
                            else {
                                image = '<article class="comic-placeholder"><h3>Page ' + page.No() + '</h3>' + loadComic.content() + '</article>';
                            }
                        }
                        //preload images
                        for (var im = (i + 1); im < (i + 3); im++) {
                            try {
                                var preloadImg = new Image();
                                if (5 > i && (x[im].getElementsByTagName("Image")[0].childNodes[0].nodeValue != "")) {
                                    preloadImg.src = "/content/uploads/pages/" + (x[im].getElementsByTagName("Image")[0].childNodes[0].nodeValue);
                                }
                            }
                            catch (Error) {

                            }

                        }

                        return image;

                    }
                    var pubDate = function () {
                        //get the publish Date for comic
                        var months = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"],
                            i = page.i(),
                            fullPubDate = new Date(x[i].getElementsByTagName("Date")[0].childNodes[0].nodeValue);

                        pubDate = months[fullPubDate.getMonth()] + ", " + fullPubDate.getDate() + " " + fullPubDate.getFullYear();

                        return pubDate
                    }
                    var author = function () {
                        //get the authers of the comic

                        i = page.i();
                        try {
                            author = "By " + (x[i].getElementsByTagName("Author")[0].childNodes[0].nodeValue);
                        }
                        catch (Error) {
                            author = ""
                        }


                        return author

                    }
                    var pagination = function () {
                        //page data
                        var pageNo = page.No() > 0 ? page.No() : 1,
                            $previous = $(".previous"),
                            $next = $(".next");
                        $(".pages select").val(pageNo);
                        $("#comicHeading #pageNo").remove();
                        if (pageNo > 0) {
                            $("#comicHeading h1").html($("#comicHeading h1").html() + " <span id='pageNo'> <span>Page " + pageNo) + "</span></span>";
                        }
                        //next comic
                        if (pageNo < x.length) {
                            $next.show();
                            $next.attr("href", "#!/page/" + (pageNo + 1));
                        }
                        else {
                            if (settings.comicNo < settings.comicCount) {
                                $next.show();

                                $next.attr("href", "/comic/read/" + (settings.comicNo + 1) + "/#!/page/1");
                            }
                            else {
                                $next.removeAttr("href");
                                $next.hide()
                            }
                        }

                        //previous comic
                        if (pageNo > 1) {
                            //if this is not the first comic page show the previvous nav and set its attr to the previous page
                            $previous.show();

                            if (settings.pageNo !== "undefined") {
                                $previous.attr("href", "/comic/read/" + settings.comicNo + "/#!/page/" + (pageNo + -1));
                            }
                            else {
                                $previous.attr("href", "#!/page/" + (pageNo + -1));
                            }

                        }
                        else if (pageNo < 2 && settings.comicNo > 1) {
                            $.ajax({
                                async:true, dataType: "xml", url: preComic, success: function (xml) {
                                    var preComicXml = xml,
                                        preComicPage = preComicXml.getElementsByTagName("Page"),
                                        prePageNo = preComicPage.length > 0 ? preComicPage.length : 1;
                                    $previous.attr("href", "/comic/read/" + (settings.comicNo + -1) + "/#!/page/" + prePageNo);
                                }
                            });
                        }
                        else if (settings.comicNo == 1) {
                            //if this is the first comic and it is page 1 hide the navigation
                            $previous.removeAttr("href");

                            $previous.hide();
                        }
                    }
                    var content = function () {
                        //get extra copy and content made by comic author

                        i = page.i();
                        try {
                            content = '<div>' + (x[i].getElementsByTagName("Content")[0].childNodes[0].nodeValue).split(/\r?\n/).join("<br>") + '</div>';
                        }
                        catch (Error) {
                            content = ''
                        }


                        return content
                    }
                    return { image: image, pubDate: pubDate, author: author, pagination: pagination, content: content }

                }();
                function displayPage() {
                    $("#pageContent").html(
                        '<figure>' +
                        loadComic.image() +
                        '<figcaption class="is-collapsed"><div class="collapse-container"><a role="button" class="collapse-button">&#x25BC;</a></div><div class="inner-figcaption">' +
                        '<h5>Page ' + page.No() + ' ' + loadComic.author() + '</h5>' + loadComic.content() + '</div></figcaption>'
                        + '</figure>'
                    )
                    function scrollComicTop() {
                        //If the top of the webcomic is not visible scroll to the top of the view port
                        var viewportHeight = $(window).height(),
                            viewportPosition = $(window).scrollTop(),
                            elementPosition = $(".webcomic").offset().top;

                        elementScrollPosition = elementPosition - viewportPosition;
                        if (elementScrollPosition < 0 || elementScrollPosition > viewportHeight) {
                            $(document).scrollTop(0);
                        }
                    }

                    //wait until the comics image a copy is loaded and display then excute scrollComicTop function
                    $(loadComic.image()).load(scrollComicTop)
                    $(loadComic.content(), loadComic.author(), page.No(), loadComic.image()).ready(scrollComicTop)

                }
                var page = function () {
                    var No = function () {
                        var hashNo = window.location.hash.match(/\d+/) | 0,
                            No = settings.pageNo !== "undefined" ? settings.pageNo : hashNo > 0 ? hashNo : 1;
                        return No;
                    }
                    var i = function () {
                        i = page.No() > 0 ? page.No() - 1 : 0;
                        return i;
                    }
                    var next = function () {
                        var nextPage = $(".webcomic .next").attr("href");
                        if (nextPage !== undefined) {
                            window.location = nextPage;
                        }
                    }
                    var previous = function () {
                        var previousPage = $(".webcomic .previous").attr("href");
                        if (previousPage !== undefined) {
                            window.location = previousPage;
                        }

                    }

                    return { No: No, i: i, next: next, previous: previous }
                }();

                $(window).on("hashchange", function () {
                    displayPage()
                    loadComic.pagination()
                    $(".webcomic img").click(function () {
                        $container = $(this).closest(".webcomic");
                        $("figcaption", $container).toggleClass("is-collapsed is-expanded")
                    });
                    $(".webcomic .collapse-button").click(function () {
                        $container = $(this).closest(".webcomic");
                        $("figcaption", $container).toggleClass("is-collapsed is-expanded")
                    });

                    //change any hashes to hashbang
                    var url = window.location.toString();

                    if (url.split('#!').length == 1) {
                        if (url.split('#').length == 2) {
                            url = '#!/page/' + page.No();
                            window.location = url;
                        }
                    }

                });
                $(window).trigger("hashchange");
                $("#page-nav").on("change", function () {
                    var e = this;
                    gotoUrl = "#!/page/" + e.options[e.selectedIndex].value;
                    window.location = gotoUrl;
                    i = e.selectedIndex;
                });
                $("#chapter-nav").on("change", function () {
                    var e = this;
                    var gotoUrl = "/comic/read/" + e.options[e.selectedIndex].value + "/";
                    window.location = gotoUrl;
                    i = e.selectedIndex;
                });
                function checkKey(e) {
                    e = e || window.event;
                    if (e.keyCode == 37) {
                        page.previous();
                    }
                    if (e.keyCode == 39) {
                        page.next();
                    }
                }

                document.onkeydown = checkKey;

            }
        });

    }
})(jQuery);
