(function ($) {
    $.fn.webcomicXreader = function (options) {
        var defaults = {
            comicNo: 1,
            pageNo: "undefined"
        },
        settings = $.extend({}, defaults, options);
        var comicList = "/content/xml/comics/comic-list.xml",
        currentComic = "/content/xml/comics/comic-" + settings.comicNo + ".xml",
        nextComic = "/content/xml/comics/comic-" + (settings.comicNo + 1) + ".xml",
        preComic = "/content/xml/comics/comic-" + (settings.comicNo - 1) + ".xml";

        var loadComic = function () {
            //load contents of xml file for comic
            var comicXml = loadXml(currentComic),
            x = comicXml.getElementsByTagName("Page");
            var image = function () {
                //get image for comic

                var image = new Image(),
                i = page.i();
                try {
                    image.src = "/content/uploads/pages/" + (x[i].getElementsByTagName("Image")[0].childNodes[0].nodeValue);
                    image = '<img src="' + image.src + '" width="auto" height="auto">'
                }
                catch (Error) {
                    image = '<div class="comic-placeholder"><div class="inner-placeholder"><h3 class="comic-placeholder-title">Page ' + page.hashNo() + '</h3></div></div>'
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
            }
            var pagination = function () {
                //page data
                var pageNo = page.hashNo(),
                $previous = $(".previous"),
                $next = $(".next");
                $(".pages select").val(pageNo);
                $("#comicHeading h2 #pageNo").remove();
                if (pageNo > 0) {
                    $("#comicHeading h2").html($("#comicHeading h2").html() + " <span id='pageNo'>&raquo; <span class='secondary-text'>Page " + pageNo) + "</span></span>";
                }
                //next comic
                if (pageNo < x.length) {

                    $next.attr("href", "#!/page/" + (pageNo + 1));
                }
                else {
                    var comicListXml = loadXml(comicList),
                    comicListX = comicXml.getElementsByTagName("Comic");
                    if (settings.comicNo == comicListX.length) {
                        $next.attr("href", "/comic/read/" + (settings.comicNo + 1) + "/#!/page/1");
                    }
                    else {
                        $next.hide()
                    }
                }

                //previous comic
                if (pageNo > 1) {
                    //if this is not the first comic page show the previvous nav and set its attr to the previous page
                    $previous.show();
                    $previous.attr("href", "#!/page/" + (pageNo + -1));
                }
                else if (pageNo < 2 && settings.comicNo !== 1) {
                    var preComicXml = loadXml(preComic),
                    preComicPage = preComicXml.getElementsByTagName("Page");
                    $previous.attr("href", "/comic/read/" + (settings.comicNo + -1) + "/#!/page/" + preComicPage.length);
                }
                else if (settings.comicNo == 1) {
                    //if this is the first comic and it is page 1 hide the navigation
                    $previous.hide();
                }
            }
            var content = function () {
                //get extra copy and content made by comic author

                i = page.i();
                try {
                    content = '<figcaption class="is-collapsed">' + (x[i].getElementsByTagName("Content")[0].childNodes[0].nodeValue) + "</figcaption>";
                }
                catch (Error) {
                    image = ''
                }


                return content
            }
            return { image: image, pubDate: pubDate, author: author, pagination: pagination, content: content }
        } ();
        function loadXml(xmlFilename) {
            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            }
            else {// code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.open("GET", xmlFilename, false);
            xmlhttp.send();
            xmlFile = xmlhttp.responseXML;
            return xmlFile;

        }
        function displayPage() {
            var viewportHeight = $(window).height(),
            viewportPosition = $('body').scrollTop(),
            elementPosition = $(".webcomic").offset().top;

            elementScrollPosition = elementPosition - viewportPosition;
            if (elementScrollPosition < 0 || elementScrollPosition > viewportHeight) {
                $(function () {
                    $(document).scrollTop(0);
                });
            }
            $("#pageContent").html(
            '<figure>' +
            loadComic.image() + loadComic.content()
            + '</figure>'
            );

        }
        var page = function () {
            var hashNo = function () {
                hashNo = settings.pageNo !== "undefined" ? settings.pageNo : window.location.hash.match(/\d+/) | 0;
                return hashNo;
            }
            var i = function () {
                i = page.hashNo() > 0 ? page.hashNo() - 1 : 0;
                return i;
            }
            return { hashNo: hashNo, i: i }
        } ();
        $(window).on("hashchange", function () {
            displayPage()
            loadComic.pagination()

        });
        $(window).trigger('hashchange');
        $(".webcomic img").on("click", function () {
            $(".webcomic figcaption").toggleClass("is-collapsed")
        });

        //$("#pageContent").html();
    }
})(jQuery);  