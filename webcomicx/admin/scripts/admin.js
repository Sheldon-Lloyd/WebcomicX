/*-----------------Accordion menu---------------------*/    
    function accordion(e) {

        var e = $(e).parent(),
        menuHeight = $('.accordion').height(),
        currentPosition = $('.inner-collection').position();

        if (!$(".accordion", e).is(":visible")) {
            //open targeted accordion
            $('.accordion', e).slideDown(500);

            if ($(".accordion", e).css("display")=="inline") {

                //jquery fix to set to initial instead of inline
                $(".accordion", e).css("display", "initial");
            }
            if (currentPosition != "undefined") {//check if inner-collection section is defined

            //get its current position
                currentPosition = currentPosition.top;
                //give it a new position to make room for opened menu
                var newPosition = menuHeight + currentPosition;
                $('.inner-collection').animate({ top: newPosition }, 500);
            }
        }
        else {
            $('.accordion', e).slideUp(500);
            if ($(".accordion", e).css("display")=="inline") {
                //jquery fix to set to initial instead of inline
                $(".accordion", e).css("display", "initial");
            }
            //set inner-collection to initial position
            $('.inner-collection').animate({ top: '80' }, 500);

        }
    }

/*-----------------------Ajax Image Upload--------------------------*/

    formdata = false;
    function showUploadedItem(e) {
        var i = 0, len = e.files.length, img, reader, file;
        e2 = $(e).parent();
        //$(".response", e2).html("Uploading . . .");
        //collectionNode = $(e2).closest(".collection-item").index();
        for (; i < len; i++) {
            file = e.files[i];

            if (!!file.type.match(/image.*/)) {
                if (window.FileReader) {
                    reader = new FileReader();
                    reader.onloadend = function (e) {
                        var newItem = "<img src='"+e.target.result+"' width='100%' height='auto' style='max-width:700px'>";
                        $(".image-list",e2).html(newItem);
                    };
                    reader.readAsDataURL(file);
                }
                if (formdata) {
                    formdata.append("images[]", file);
                }
            }
        }
    }

    if (window.FormData) {
        formdata = new FormData();
    }

    function uploadImage(e) {
        var i = 0, len = e.files.length, img, reader, file;
        e2 = $(e).parent();
        $(".response", e2).html("Uploading . . .");
        collectionNode = $(e2).closest(".collection-item").index();
        for (; i < len; i++) {
            file = e.files[i];

            if (!!file.type.match(/image.*/)) {
                if (window.FileReader) {
                    reader = new FileReader();
                    reader.onloadend = function (e) {
                        //showUploadedItem(e.target.result, file.fileName,e);
                        var newItem = "<img src='"+e.target.result+"' width='100%' height='auto'>";
                        $(".image-list",e2).html(newItem);
                    };
                    reader.readAsDataURL(file);
                }
                if (formdata) {
                    formdata.append("images[]", file);
                }
            }
        }

        if (formdata) {
            $.ajax({
                url: "/webcomicx/admin/controlers/edit-collection-cover/" + collectionNode,
                type: "POST",
                data: formdata,
                processData: false,
                contentType: false,
                success: function (res) {
                    //var imageSrc = $(res).find('span').text();
                    $(".response", e2).html(res);
                    $($(e2).closest(".collection-item")).css("backgroundImage", "url(/content/uploads/covers/thumbnail/" + res + ")");
                    //$('.collectionInfo input[name="cover"]',e2).val(res);
                }
            });
        }
    }

/*----------------------Manage Collections--------------------------*/

    /* attach a submit handler to the form */
    function newCollection (){
$("#newCollection").submit(function (event) {

    /* stop form from submitting normally */
    event.preventDefault();

    /* get some values from elements on the page: */
    var $form = $(this),
                          collectName = $form.find('input[name="createCollect"]').val(),
                          url = $form.attr('action');

    /* Send the data using post */
    var posting = $.post(url, { s: collectName },
                            function (result) {

                                //create new collection
                                var newItem = '<li class="item collection-item" style="background-image:url(/content/uploads/covers/thumbnail);background-size: contain;background-position:center;background-repeat: no-repeat" id="' + ($("#collections li").length + 1) + '" ondrop="dropComic(this, event)" ondragenter="return false" ondragover="return false"><a onclick="popup(this)" title="Edit Collection" class="action" style="position: initial;margin-left: 3px;">Edit</a><form id="deleteCollection" action="/webcomicx/admin/controlers/delete-collection" method="post"><button class="action" value="' + ($("#collections li").length + 1) + '" type="submit" name="collectionNo" onclick="deleteCollection(this)">&times;</button></form>' + result + '</li>';
                                
                                //append it to the collection list
                                $("#collections").append(newItem);

                                //set the focus to the newlly created collection textbox
                                $("#collection").focus();

                            });

});
}
    function deleteCollection(e) {
        var p = $(e).parent();
        $(p).submit(function (event) {

            /* stop form from submitting normally */
            event.preventDefault();

            /* get some values from elements on the page: */
            var $form = $(this),
                          collectId = $(p).parent().index() + 1,
                          url = $form.attr('action');
            var confirmation = confirm("Are you sure you want to delete this collection");
            if (confirmation == true) {
                //Send the data using post 
                var posting = $.post(url, { "collectionNo": collectId },
                            function (result) {
                                $(p).parent().remove();
                            });

            }
            else { }
        });
    }
    function nameCollection() {
        /* stop form from submitting normally */
        event.preventDefault();

        /* get some values from elements on the page: */
        var $form = $("#nameCollection"),
                          name = $form.find('input[name="collectionName"]').val(),
                          number = $form.find('input[name="collectionNo"]').val(),
                          url = $form.attr('action');

        /* Send the data using post */
        var posting = $.post(url, { "collectionName": name, "collectionNo": number },
                            function (result) {
                                var collection = $("#collection").parent().parent();
                                var collectionName = '<a onclick="popup(this)" title="Edit Collection" class="action" style="position: initial;margin-left: 3px;">Edit</a><span><a onclick="window.location=$(this).closest('+"'.collection-item'"+').index()+1">' + $("#collection").val() + '</a></span><form id="deleteCollection" action="/webcomicx/admin/controlers/delete-collection" method="post"><button class="action" value="' + ($("#collections li").length + 1) + '" type="submit" name="collectionNo" onclick="deleteCollection(this)">&times;</button></form>' + '<div class="feedback"></div> <div class="pop-up"> <div id="title"> <h2>Edit Collection</h2> <a onclick="popup(this)" id="close">&times;</a> <div class="clear-fix"></div> </div> <div id ="box"> <form class="imageUpload" method="post" enctype="multipart/form-data" action="/webcomicx/admin/controlers/edit-collection-cover/"> <input type="file" name="image" id="images" onchange="uploadImage(this)" />  <div class="response"></div> <div class="image-list"></div> </form> <form enctype="multipart/form-data" action="/webcomicx/admin/controlers/edit-collection" method="post" class="collectionInfo"> <input type="hidden" name="cover"> <label>Cover Attribution</label> <input type="text" name="attribution" value=""> <label>Collection Name</label> <input type="text" value="' + $("#collection").val() + '" name="title"> <label>Collection Description</label> <textarea name="description"></textarea> <a onclick="popup(this)" style="cursor: pointer">Cancel</a> <button onclick="updateCollection(this)" type="submit" name="collection" value="">Save</button> </form> </div> </div>';

                                collection.empty();
                                collection.html(collectionName);

                            });
    }
    function popup(e) {//open lightbox for editing the collection
        e = $(e).closest(".item");
        $('.pop-up', e).toggleClass('is-hidden');
    }
    function closePrompt() {//close prompt display
        $('.prompt').fadeOut();
    }
    function updateCollection(e) {//update collection
        var e2 = e;
        var e = $(e).parent();
        $(e).submit(function (event) {

            /* stop form from submitting normally */
            event.preventDefault();

            /* get some values from elements on the page: */
            var $form = $(this),
                          name = $form.find('input[name="title"]').val(),
                          attribution = $form.find('input[name="attribution"]').val(),
                          description = $form.find('textarea[name="description"]').val(),
                          p = $form.closest(".collection-item"),
                          number = p.index(),
            //image = $(".response", $form.closest(".collection-item")).html(),
                          url = $form.attr('action');
            //$form.html(image);
            //Send the data using post
            var posting = $.post(url, { "title": name, "attribution": attribution, "description": description, "collection": number },
                            function (result) {
                                popup(e2);
                                $(".collection-name a", p).html(name);

                                //prompt user on newlly edited and saved collection
                                $(".prompt").html("Your collection has been saved! <a onclick='closePrompt()'>&times;</a>");
                                $(".prompt").show();

                                //promt will clode if user doesnt close it after "Over 9000!" milliseconds
                                setTimeout(function () { closePrompt() }, 9001);
                            });
        });
    }
    $(document).ready(function () {
        if ('draggable' in document.createElement('span')) {
            $("#comic-list li").css("cursor","move");
        }
    });

    var comicElement;
    function dragComic(comic, event) {
        //get comic data on drag
        event.dataTransfer.setData('comic', comic.id);
        comicElement = comic;

        //highlight the collection area
        $('.collection-item').addClass('border-highlight')
    }
    function dropComic(target, event) {
        //recive comic data
        var comic = event.dataTransfer.getData('comic');

        if ($(".feedback").is(':animated')) {//resart animation
            $(".feedback").stop().animate({ opacity: '100' });
        }

        //let user now comic has been added to collection
        $(".feedback span", target).html("Comic " + comic + " added to collection!");
        $(".feedback", target).show();
        setTimeout(function () { $(".feedback", target).fadeOut(1000); }, 1000);

        //get collect to add comic to
        var collection = $(target).index()+1;

        //Send the data using post
        var posting = $.post("/webcomicx/admin/controlers/change-collection", { "comicNo": comic, "collection": collection },
                            function (result) {
                                //get current collection being viewed
                                var url = window.location.pathname;
                                url = url.split("/");

                                if (url[3] != undefined) {
                                    //remove element from current collection
                                    if (url[3] != collection) {
                                        comicElement.remove();
                                    }
                                }
                            });


    }
    /*------------------------Manage Webpages----------------------*/


    function includeAbout() {//include about page for webcomic

        e = document.getElementById("about");
        var include = $(e).val();

        if (e.checked != 1) {//if item is not checked set inclue to false
            include = "False"
        }

        //Send the data using post
        $.post("/webcomicx/admin/controlers/include-about", { "about": include })
    }
    function includeCharacters() {//include characters page for webcomic
        e = document.getElementById("characters");
        var include = $(e).val();

        if (e.checked != 1) {//if item is not checked set inclue to false
            include = "False"
        }

        //Send the data using post
        $.post("/webcomicx/admin/controlers/include-characters", { "characters": include })
    }
/*character managment-----------*/
    $(document).ready(function () {
        var oldPosition = "";
        var newPosition = "";

        $("#sortable").sortable({//sort characters
            start: function (event, ui) {
                //get current element index being sorted
                oldPosition = $(ui.item).index();
            },
            update: function (event, ui) {
                //get new element index being sorted
                newPosition = $(ui.item).index();

                //Send the data using post
                var posting = $.post("/webcomicx/admin/controlers/character-position", { "oldPosition": oldPosition, "newPosition": newPosition });
            }
        }).disableSelection();
        $(".sort").submit(function () {//send item to top of list

            /* stop form from submitting normally */
            event.preventDefault();

            //get current position and to be new position of item
            oldPosition = $(this).closest("#sortable li").index();
            newPosition = 0;

            //remove current item and prepend it to the list
            e = $(this).closest("#sortable li");
            e.clone().prependTo("#sortable");
            e.remove();

            //Send the data using post
            var posting = $.post("/webcomicx/admin/controlers/character-position", { "oldPosition": oldPosition, "newPosition": newPosition });
        });
        $("#deleteCharacter").submit(function () {//delete item

            /* stop form from submitting normally */
            event.preventDefault();

            //get node position of item
            e = $(this).closest("#sortable li");
            characterNode = e.index();

            //remove item
            e.remove();

            //Send the data using post
            var posting = $.post("/webcomicx/admin/controlers/delete-character", { "characterNode": characterNode });
        });
    });

    function deletePrompt(e){
        $(e).closest('.item-list li').children('.delete').toggle()
    }

/*-----------------Form manipulation-----------------*/
    //check box
        function checkButton(){
            if ($(this).has("#checkbox")) {
                $("label.button").toggleClass("is-checked is-unchecked");
            }
            else {
                $("label.button").removeClass("is-checked");
                $("label.button").addClass("is-unchecked");
                $(this).removeClass("is-unchecked");
                $(this).addClass("is-checked");
            }
        }
    function getLicense() {
        var licenseValue = $("#license").val();

        if (licenseValue == "Other") {
            $("#licenseValue").attr("type", "text");
            $("#license").css("max-width", "150px");
        }
        else {
            $("#licenseValue").attr("type", "hidden");
            $("#license").css("max-width", "700px");
        }
        $("#licenseValue").val("");
    }

    /*---------Manage widget layout--------------------------*/
    $(document).ready(function () {

        $(".widget").sortable({
            connectWith: ".widget",
            items: "li:not(.non-widget)",
            cancel: ".ui-state-disabled"
        }).disableSelection();
    });
    function addWidget(e) {
        var container = $(e).closest(".widget");
        var widgetPosition = container.attr("data-position");
        newWidget = '<li class="item ui-state-default" id="null"><form class="sort"><input type="hidden" name="position" value=""><input type="hidden" name="index" value=""><input type="hidden" name="id" value=""></form><form method="post" action="/webcomicx/admin/controlers/delete-widget"><button onclick="deleteWidget(this)" id="delete" value="" name="id">&times;</button></form><a id="editWidget" onclick="popup(this)">Edit widget</a><div class="pop-up"><div id="title"><h2>Edit Widget</h2><a onclick="$(this).closest('+"'.item'"+').remove()" id="close">&times;</a><div class="clear-fix"></div></div><div id ="box"><form action="/webcomicx/admin/controlers/save-widget" method="post" class="ui-state-disabled"><label>Widget Name</label><input type="hidden" name="position" value="'+widgetPosition+'"><input type="text" name="name" value=""><label>Html/JavaScript</label><textarea name="code"></textarea><br><a onclick="$(this).closest('+"'.item'"+').remove()" style="cursor: pointer">Cancel</a><button onclick="saveWidget(this)" type="submit" name="id" value="">Save</button></form></div></div></li>'
        $(e).closest(".widget-placeholder").after(newWidget);
    }

        function saveLayout() {

        $('.prompt').show();
        $('.prompt').html("Saving Layout...").show();
        $('.sort').each(function () {
            var container = $(this).closest(".widget");
            var widgetPosition = container.attr("data-position");
            var widget = $(this).closest(".item");
            var postion = widgetPosition;
            var widgetIndex = $(this).closest('.item').index();
            var widgetId = widget.attr("id");
            $.ajax({ type: "POST", async: false, url: "/webcomicx/admin/controlers/sort-widgets", data: { "position": postion, "index": widgetIndex, "id": widgetId} });
        });
        $('.prompt').html("Layout Saved! <a onclick='closePrompt()'>&times;</a>");

        //promt will clode if user doesnt close it after "Over 9000!" milliseconds
        setTimeout(function () { closePrompt() }, 9001);
    }
    function saveWidget(e) {
        event.preventDefault();
        var form = $(e).closest('form'),
          name = form.find('input[name="name"]').val(),
          code = form.find('textarea[name="code"]').val(),
          container = $(e).closest(".widget"),
          widget = $(e).closest(".item"),
          postion = container.attr("data-position"),
          widgetId = form.find('button[name="id"]').val();
        var posting = $.ajax({ type: "POST", async: false, url: "/webcomicx/admin/controlers/save-widget", data: { "position": postion, "id": widgetId, "name": name, "code": code }, success: function (result) {
        }
        });
        $("input").blur();
        $("textarea").blur();
        posting.done(function (data) {
            $("#temp-container").html(data.replace(/\s/g, ""));
            var text = $("#temp-container #text").html();
            $(e).closest(".item").find("#editWidget").html("Edit " + name + " widget");
            form.find('button[name="id"]').val(data.replace(/\s/g, ""));
            $("#delete",widget).val(data.replace(/\s/g, ""));

            widget.attr("id",data.replace(/\s/g, ""));
            popup(e);
        });
    }
    function deleteWidget(e){
        event.preventDefault();
        var widgetId = $(e).val(),
        widget = $(e).closest(".item");
        var posting = $.ajax({type: "POST", async: false, url: "/webcomicx/admin/controlers/delete-widget", data: { "id": widgetId}});
        widget.remove();
    }
    function saveComments(e) {
        event.preventDefault();
        var form = $(e).closest('form'),
          name = form.find('select[name="name"]').val();
        var posting = $.ajax({ type: "POST", async: false, url: "/webcomicx/admin/controlers/comment-plugin-selection", data: { "name": name} });
        $("#commentPluginSettings").html("Loading...")
        posting.done(function (data) {
            $("#commentPluginSettings").load("/content/plugins/comments/" + name + "/settings/settings.cshtml", function (response, status, xhr) {
                if (status == "error") {
                    $("#commentPluginSettings").html("");
                }
            });
            $("#commentPluginName").html("(" + name + ")");
        });
    }


    function blogSettings(e) {
        $(".type").hide();
        var setting = $(e).val();
        $("#" + setting).show();
    }
        function externalBlog() {
            $("#external").submit(function (event) {
                event.preventDefault();
                $("#blogFeed").html("<h3>Loading Blog Posts...</h3>")
                $(".pop-up").hide();

                var url = $("#external").find("input[name='url']").val();
                var feed = $("#external").find("input[name='feed']").val();
                
                //Send the data using post 
                var posting2 = $.ajax({ type: "POST", async: false, url: "/webcomicx/admin/controlers/external-blog", data: { "url": url,"feed":feed} });
                var posting = $.ajax({ type: "POST", async: false, url: "/webcomicx/admin/controlers/blog-settings", data: { "setting": "external"} });
                posting.done(function (data) {
                    $("#blogFeed").load("/webcomicx/views/external-blog?t=Admin")
                });

            });
        }
        function webcomicxBlog() {
            $("#webcomicx").submit(function (event) {
                event.preventDefault();
                $("#blogFeed").html("<h3>Loading Blog Posts...</h3>")
                $(".pop-up").hide();

                var description = $("#webcomicx").find("textarea[name='description']").val();
                
                //Send the data using post 
                var posting2 = $.ajax({ type: "POST", async: true, url: "/webcomicx/admin/controlers/webcomicx-blog", data: { "description": description} });
                var posting = $.ajax({ type: "POST", async: true, url: "/webcomicx/admin/controlers/blog-settings", data: { "setting": "webcomicx"} });
                posting.done(function (data) {
                    $("#blogFeed").load("/webcomicx/views/webcomicx-blog?t=Admin")
                });

            });
        }
    function welcomeDismiss() {
        $(".message-guide").remove();
        var posting = $.post("/webcomicx/admin/controlers/welcome-dismiss", { "dismiss": "dismiss" });
    }
/*------------------------------Custumize Site----------------------*/
    function pageWidth(e) {
        var width = $(e).val().replace("px", "");
        $("span.pageWidth").html(width + "px");
        $('iframe').contents().find('.page').css("max-width", width + "px");
    }
    function pageFont(e) {
        var size = $(e).val().replace("px", "");
        $('iframe').contents().find('body').css("font-size", size + "px");
    }
    function backgroundColor(e, element) {
        var container = $(e).closest(".colorpicker-container"),
        element = $(e).attr("data-element"),
        element2 = $(e).closest(".design-option").attr("data-element"),
        color = $(e).val(),
        iframeElement = $('iframe').contents().find(element);
        if (color != "") {
            if (color.substring(0, 1) != "#") {
                color = "#" + color;
            }
            iframeElement.css("background", color);
        }
        else{
            iframeElement.css("background", color);
        }
        var viewportHeight = $("#sitePreview").height(),
        framePosition = $('#sitePreview').contents().find('body').scrollTop(),
        elementPosition = iframeElement.offset().top;

        elementScrollPosition = elementPosition - framePosition;
        if(elementScrollPosition<0||elementScrollPosition>viewportHeight){
            $('iframe').contents().scrollTop($('iframe').contents().find(element2).first().offset().top);
        }
    }
    function textColor(e, element) {
        var color = $(e).val(),
        element2 = $(e).closest(".design-option").attr("data-element");
        iframeElement = $('iframe').contents().find(element2);

        if (color.substring(0, 1) != "#") {
            color = "#" + color;
        }
        $('iframe').contents().find(element).css("color", color);

        var viewportHeight = $("#sitePreview").height(),
        framePosition = $('#sitePreview').contents().find('body').scrollTop(),
        elementPosition = iframeElement.offset().top;

        elementScrollPosition = elementPosition - framePosition;
        if(elementScrollPosition<0||elementScrollPosition>viewportHeight){
            $('iframe').contents().scrollTop($('iframe').contents().find(element2).first().offset().top);
        }
    }
    function designOptions(e) {
        var option = "#" + $(e).val();
        $(".design-option").hide();
        $(option).show();
    }
    function toogleDesigner() {
        if ($(".designer").height() > $(".min-max-designer").height() + 3) {
            $(".designer-inner").hide();
            $('.designer').animate({ height: $(".min-max-designer").height() + 3 }, 250);
            $(".designer").css("overflow", "hidden");
            $('.site-preview').animate({ top: $(".min-max-designer").height() + 3 }, 250);
            $(".min-max-designer a").html("Expand Designer");
        }
        else {
            $(".designer-inner").show();
            $('.designer').animate({ height: 230 }, 0);
            $(".designer").css("overflow", "hidden");
            $('.site-preview').animate({ top: 230 }, 250);
            $(".min-max-designer a").html("Minimize Designer");
        }
    }
    function useLogo() {
        e = document.getElementById("includeLogo");
        var include = $(e).val();

        if (e.checked != 1) {
            $("#logo").hide();
            $("#logo").val("");
            $('iframe').contents().find(".logo").css("background", "none");
            $('iframe').contents().find(".logo").css("text-indent", "0");
            $('iframe').contents().find(".logo").css("height", "auto");
            $('iframe').contents().find(".logo").css("width", "auto");
        }
        else {
            $("#logo").css("display","inline-block");
            imgUrl = $("#logo").attr("data-img");
            if (imgUrl != "") {
                var imgLogo = new Image();
                imgLogo.src = "/content/uploads/design/" + imgUrl;
                $('iframe').contents().find(".logo").css("width", imgLogo.width + "px");
                $('iframe').contents().find(".logo").css("height", imgLogo.height + "px");
                $('iframe').contents().find(".logo").css("background", "url('" + imgLogo.src + "') no-repeat");
                $('iframe').contents().find(".logo").css("text-align", "left");
                $('iframe').contents().find(".logo").css("text-indent", "-999999px");
                $('iframe').contents().find(".logo").css("margin", "auto");
                $('iframe').contents().find(".logo").css("line-height", imgLogo.height + "px");
                $('iframe').contents().find(".logo").css("display", "inline-block");
                $('iframe').contents().find(".logo").css("display", "inline-block");
            }
        }
    }
    function rgb2hex(rgb) {
        rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    } $('iframe').load(function () {
        loadStyles();
    });
    function showUploadedLogo(e) {
        var i = 0, len = e.files.length, img, reader, file;
        for (; i < len; i++) {
            file = e.files[i];

            if (!!file.type.match(/image.*/)) {
                if (window.FileReader) {
                    reader = new FileReader();
                    reader.onloadend = function (e) {
                        imgUrl = e.target.result;
                        $("#logo").attr("data-img", e.target.result);
                        if (imgUrl != "") {
                            var img = new Image();
                            img.src = imgUrl;
                            $('iframe').contents().find(".logo").css("width", img.width + "px");
                            $('iframe').contents().find(".logo").css("height", img.height + "px");
                            $('iframe').contents().find(".logo").css("background", "url('" + img.src + "') no-repeat");
                            $('iframe').contents().find(".logo").css("text-align", "left");
                            $('iframe').contents().find(".logo").css("text-indent", "-999999px");
                            $('iframe').contents().find(".logo").css("margin", "auto");
                            $('iframe').contents().find(".logo").css("line-height", img.height + "px");
                            $('iframe').contents().find(".logo").css("display", "inline-block");
                            $('iframe').contents().find(".logo").css("display", "inline-block");
                        }
                    };
                    reader.readAsDataURL(file);
                }
                if (formdata) {
                    formdata.append("images[]", file);
                }
            }
        }
    }
    $(document).ready(function () {
        $(".defaultWidth").click(function () {
            var e = $(this).closest(".pageWidth-container");
            $('iframe').contents().find(".page").css("max-width", "");
            var pageWidth = $('iframe').contents().find(".page").css("max-width");
            $("input.pageWidth", e).val(pageWidth.replace("px", ""));
            $("span.pageWidth", e).html(pageWidth);

        });
        $(".defaultBackground").click(function () {

            var e = $(this).closest(".colorpicker-container"),
                            element = $(".colorpicker", e).attr("data-element");
            $('iframe').contents().find(element).css("background", "");
            var color = $('iframe').contents().find(element).css("background-color");
            $(".sp-colorpicker", e).removeClass("is-pressed");
            $(this).addClass("is-pressed")
            $(".colorpicker", e).val("");

        });
        $(".defaultTextColor").click(function () {

            var e = $(this).closest(".colorpicker-container"),
                            element = $(".colorpicker", e).attr("data-element");
            $('iframe').contents().find(element).css("color", "");
            var color = $('iframe').contents().find(element).css("background-color");
            $(".sp-colorpicker", e).removeClass("is-pressed");
            $(this).addClass("is-pressed")
            $(".colorpicker", e).val("");

        });
        $(".colorpicker").change(function () {

            var e = $(this).closest(".colorpicker-container"),
                    element = $(".colorpicker", e).attr("data-element");
            if ($(this).value != "") {
                $(".defaultBackground", e).removeClass("is-pressed");
                $(".defaultTextColor", e).removeClass("is-pressed");
                $(".sp-colorpicker", e).addClass("is-pressed");
            }
        });
    });
