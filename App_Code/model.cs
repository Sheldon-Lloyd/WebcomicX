using System;
using System.Collections.Generic;
using System.Web;
using System.Xml.Linq;
using System.Xml;
using System;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Web;
using System.Web.SessionState;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.IO;
using System.Web;
using System.Web.Mvc;
using System.Linq;
using  System.Web.Helpers;
using WebMatrix;
/// <summary>
/// Summary description for ClassName
/// </summary>
public class Comic{
    public XDocument LoadComic(string filename){//load xml file if it exists
        XDocument doc = new XDocument();
            if (File.Exists(HttpContext.Current.Server.MapPath(filename))){
                doc = XDocument.Load(HttpContext.Current.Server.MapPath(filename));
            }
            return doc;
        }
    public string next(int currentComic){//go to the next comic page
        //intiliize variables
        int comicCount = 0;
        var nextComic = "/comic/read/"+currentComic+"/";

        //load comic list and setting xml
        var load = new Comic();
        var doc = load.LoadComic("/content/xml/comics/comic-list.xml");
        var settings = load.LoadComic("/App_Data/WebcomicX.xml");

        //get total number of comics
        comicCount = doc.Descendants("Comic").Count();        

        if(currentComic < comicCount){
        //if their are more comics after the curent comic 
        //set the next comic varible to the next comic to be read
            //go to the next comic in sequence
            nextComic = "/comic/read/"+(currentComic+1)+"/";
        }
        return nextComic;

    }
    public string previous(int currentComic,bool hompage = false){//go to the previous comic
        //intialize variables
        var previousComic = "/comic/read/"+currentComic+"/";
        int pageCount = 0;

        //load for settings xml
        var load = new Comic();
        var settings = load.LoadComic("/App_Data/WebcomicX.xml");

        if(currentComic > 1){//if reader is past the first comic
            //set previous comic variable
            previousComic = "/comic/read/"+(currentComic-1)+"/";
        }
        return previousComic;

    }
    public string viewComic(int currentComic){
        //view a specific comic
        var viewComic = "/comic/read/"+currentComic+"/";

        return viewComic;
    }
    public string comicImg(int currentComic, int pageNo = -1){
        //intialize variables
        var comicImg = "";

        //load xml for settings, comic list, and comics pages
        var load = new Comic();
        var doc = load.LoadComic("/content/xml/comics/comic-list.xml");
        var settings = load.LoadComic("/App_Data/WebcomicX.xml");
        var pages = load.LoadComic("/content/xml/comics/comic-"+(currentComic)+".xml");
               
                if(pageNo==-1){//count the pages in the current comic
                    pageNo = pages.Descendants("Page").Count();
                }
                try{//set the comic image to the image stored in the comic pages xml
                    comicImg = pages.Descendants("Page").Descendants("Image").ElementAt(pageNo-1).Value;
                }
                catch{//set the comic image to the image for this comics title page
                    comicImg = "";
                }                
        return comicImg;

    }
    public string comicAuthor(int currentComic){
        //initialize variables
        var comicAuthor = "";
        int pageCount = 0;

        //load xml for settings, comic list, and comics pages
        var load = new Comic();
        var doc = load.LoadComic("/content/xml/comics/comic-list.xml");
        var settings = load.LoadComic("/App_Data/WebcomicX.xml");
        var pages = load.LoadComic("/content/xml/comics/comic-"+(currentComic)+".xml");

           

        try{//set variable to author of page (person that published it)
            comicAuthor = pages.Descendants("ComicCopy").Descendants("Author").ElementAt(0).Value;
        }
        catch{}                
        return comicAuthor;

    }
    public HtmlString comicTitle(int currentComic){//get title of comic
        //intialize variables
        var comicTitle = "My Webcomic";
        int pageCount = 0;

        //load comic-list xml
        var load = new Comic();
        var doc = load.LoadComic("/content/xml/comics/comic-list.xml");

        //set title of comic
        try{
        comicTitle = doc.Descendants("Comic").Descendants("Title").ElementAt(currentComic-1).Value;
        }
        catch{
            
        }
        
        return new HtmlString(comicTitle);

    }
    public HtmlString ComicCopy(int currentComic){//display content of comic
        //intialize variable
        var comicContent = @"You have not published your fisrt this is just a place holder until then";

        //load comic-list xml
        var load = new Comic();
        var doc = load.LoadComic("/content/xml/comics/comic-"+currentComic+".xml");

        //get content of comic and replace /n new lines with <br> new lines
        try{
        comicContent = doc.Descendants("ComicCopy").Descendants("Content").ElementAt(0).Value.Replace("\n", "<br>");
        }catch{}
        return new HtmlString(comicContent);

    }
    public HtmlString ComicShortDescription(int currentComic){//display content of comic
        //intialize variable
        var comicDescription = "";

        //load comic-list xml
        var load = new Comic();
        var doc = load.LoadComic("/content/xml/comics/comic-"+currentComic+".xml");

        //get content of comic and replace /n new lines with <br> new lines
        comicDescription = doc.Descendants("ComicCopy").Descendants("Description").ElementAt(0).Value.Replace("\n", "<br>");
        return new HtmlString(comicDescription);

    }
    public HtmlString WebComic(int currentComic, bool homePage = false){//render webcomic
        //initialize variable
        var webComic = "";
        var pageNo = 0;

        //load settings and comic pages xml
        var load = new Comic();
        var settings = load.LoadComic("/App_Data/WebcomicX.xml");
        var pages = load.LoadComic("/content/xml/comics/comic-"+(currentComic)+".xml");

        if(!homePage){//the webcomic is not on the home page

                foreach(var page in pages.Descendants("Page")){
                        pageNo ++;
                if(load.comicImg(currentComic,pageNo)!=""){
                    //if the image of  the comic is not empty
                    //create the image element and set its src
                    webComic = webComic+"<img id='page-"+pageNo+"' height='auto' width='auto' alt='Webcomic page' src='/content/uploads/pages/"+load.comicImg(currentComic,pageNo)+"'>";
                    }
                else{//use a title instead of a image
                    webComic = webComic +"<div id='page-"+pageNo+"' class='comic-placeholder'> <div class='inner-placeholder'> <h3 class='comic-placeholder-title'>"+load.comicTitle(currentComic)+" Page "+pageNo+"</h3> </div></div>";
                }
                }
        }
        else{//if its on the homepage
            if(load.comicImg(currentComic)!=""){
                
                //if the image of  the comic is not empty
                //create the image element and set its src
                webComic ="<img id='pageImage' height='auto' width='auto' alt='Webcomic page' src='/content/uploads/pages/"+load.comicImg(currentComic)+"'>";
            }
            else{//use a title instead of a image
                webComic = "<div class='comic-placeholder'> <div class='inner-placeholder'> <h3 class='comic-placeholder-title'>"+load.comicTitle(currentComic)+"</h3> </div></div>";
            }
        }
        return new HtmlString(webComic);
    }
    public HtmlString Widgets(string position){//create widgets
        //intialize variable
        var widgetItems = "";

        //load widgets xml
        var load = new Comic();
        var widgetXml = load.LoadComic("/App_Data/widgets.xml");
        var widgets = (from xml in widgetXml.Descendants("Container")
            where xml.Element("Position").Value == position
            orderby (string) xml.Element("Index") ascending
            select xml);

        foreach(var widget in widgets){
            //for each widget create the elements to be rendered
            widgetItems = widgetItems + "<div class='widget'>"+widget.Element("Code").Value+"</div>"  ;
        }
            return new HtmlString(widgetItems);
    }
    public string WebpageUrl(string id){//get url for webpage
        //intialize variable
        string url = "";
        //load webpages xml
        var load = new Comic();
        var webpageXml = load.LoadComic("/content/xml/content/webpages.xml");
        var webpage = (from xml in webpageXml.Descendants("Page")
            where xml.Element("Id").Value==id 
            select xml).FirstOrDefault();

        if(webpage.Element("External").Value=="True"){
            //if its a external site use only the permalink as the url
            url = webpage.Element("PermaLink").Value;
        }
        else{
            //if its not use id and permalink in url string
            url = "/p/"+id+"/"+webpage.Element("PermaLink").Value;
        }
        return url;
    }

    public IHtmlString PrimaryAuthor(bool link = false){//get primary author of webcomic
        //initialize variable
        var author =new HtmlString("");

        //load settings xml
        var load = new Comic();
        var settings = load.LoadComic("~/App_Data/WebcomicX.xml");
        var primaryAuthor = settings.Descendants("Settings").Descendants("Author").ElementAt(0).Value;

        if(primaryAuthor!=""){
            var authors = load.LoadComic("~/App_Data/account.xml");
            var user = (from xml in authors.Descendants("User")
                where xml.Element("UserName").Value==primaryAuthor 
                select xml).FirstOrDefault();
            //if their is a primary author display it
            if(link){
                if(user.Descendants("ProfilePage").ElementAt(0).Value!=""){
                    author = new HtmlString("<a href='"+user.Descendants("ProfilePage").ElementAt(0).Value+"'>By "+ user.Descendants("PenName").ElementAt(0).Value+"</a>");
                }
                else{
                    author = new HtmlString("<a>By "+ user.Descendants("PenName").ElementAt(0).Value+"</a>");
                }
            }
            else{
                author = new HtmlString("By "+ user.Descendants("PenName").ElementAt(0).Value);

            }
        }

        return author;
    }
    public HtmlString comicHeading(int comicNo){//create heading for comic page
        //intialize variables
        string edit = "";
        string publishHeading = "";
        int pageCount = 0;
        DateTime publishDate = DateTime.UtcNow;

        //load settings, comic list, and comic page xml
        var load = new Comic();
        var settings = load.LoadComic("/App_Data/WebcomicX.xml");
        var comicList = load.LoadComic("/content/xml/comics/comic-list.xml");
        var pagesDoc = load.LoadComic("/content/xml/comics/comic-"+comicNo+".xml");
        pageCount = pagesDoc.Descendants("Page").Count();        
        if(HttpContext.Current.User.Identity.IsAuthenticated){
            //if user is authenticated display edit page link
                    edit = " <a href='/webcomicx/admin/edit-comic/"+comicNo+"' class='edit'>Edit</a>";
        }
        try{
        publishDate = Convert.ToDateTime(comicList.Descendants("Comic").Descendants("Date").ElementAt(comicNo-1).Value);
        }
        catch{}
                
        //set publishHeading variable with date and author
        if(load.comicAuthor(comicNo)!=""){
            publishHeading = "<h5><span>By "+load.comicAuthor(comicNo)+" </span> on  <span id='pubDate' itemprop='datePublished'>"+publishDate.ToString("MMMM, d yyyy")+"</span></h5>";
        }
        else{
            publishHeading = "<h5><span>"+load.comicAuthor(comicNo)+"</span> <span id='pubDate' itemprop='datePublished'> "+publishDate.ToString("MMMM, d yyyy")+"</span></h5>";
        }
        //add comic title, and publishHeading to create comic heading
        string comicHeading = "<h2 itemprop='headline'>"+load.comicTitle(comicNo) +edit+"</h2>"+publishHeading;

        return new HtmlString(comicHeading);
    }
    public IHtmlString customStyles(){
        var load = new Comic();

        var styles = load.LoadComic("/App_Data/styles.xml");
        var customStyles = load.LoadComic("/content/themes/base/styles/custom-styles.xml");
        var style = "";

        //general styles
        var pageWidth = styles.Descendants("Styles").Descendants("General").Descendants("Width").ElementAt(0).Value;
        var pageBackground = styles.Descendants("Styles").Descendants("General").Descendants("Background").ElementAt(0).Value;
        var linkColor = styles.Descendants("Styles").Descendants("General").Descendants("LinkColor").ElementAt(0).Value;
        var fontSize = styles.Descendants("Styles").Descendants("General").Descendants("FontSize").ElementAt(0).Value;
        var headerLogo = styles.Descendants("Styles").Descendants("Header").Descendants("Logo").ElementAt(0).Value;
        bool include = Convert.ToBoolean(styles.Descendants("Header").Descendants("IncludeLogo").ElementAt(0).Value);

        if(headerLogo!=""&&include){
            WebImage logo = new WebImage("~/content/uploads/design/"+headerLogo);
            headerLogo = ".logo {display:inline-block;margin:auto;text-align:left;text-indent: -99999px;white-space: nowrap;height:"+logo.Height+"px;line-height:"+logo.Height+"px;width:"+logo.Width+"px;background:url(/content/uploads/design/"+headerLogo+") no-repeat;}";
        }

        if(pageWidth!=""){
            pageWidth = ".page {max-width:" +pageWidth+"px}";
        }
        if(linkColor!=""){
            linkColor = ".body a{color:"+linkColor+"}";
        }
        if(pageBackground!=""&&fontSize!=""){
            pageBackground = ".body {background:"+pageBackground+";font-size:"+fontSize +"px}";
        }

        foreach(var customStyle in customStyles.Descendants("Style")){
            var backgroundColor = "";
            var textColor = "";
            if(customStyle.Element("BackgroundSubElements").Value!=""||customStyle.Element("TextSubElements").Value!=""){
                if(customStyle.Element("BackgroundColor").Value!=""){
                backgroundColor = "."+customStyle.Element("ClassName").Value +" "+ customStyle.Element("BackgroundSubElements").Value+ 
                "{background:" +customStyle.Element("BackgroundColor").Value+";}";
                }
                if(customStyle.Element("TextColor").Value!=""){

                textColor = "."+customStyle.Element("ClassName").Value +" "+ customStyle.Element("TextSubElements").Value+ 
                "{color:" +customStyle.Element("TextColor").Value+";}";
                }
                style = style + backgroundColor+textColor;
            }
            else{
                if(customStyle.Element("BackgroundColor").Value!=""){
                backgroundColor = "background:"+customStyle.Element("BackgroundColor").Value+";";
                }
                if(customStyle.Element("TextColor").Value!=""){
                textColor = "color:"+customStyle.Element("TextColor").Value+";";
                }
                if(customStyle.Element("TextColor").Value!=""||customStyle.Element("BackgroundColor").Value!=""){
                style = style + "." + customStyle.Element("ClassName").Value +"{"+backgroundColor+textColor+"}";
                }
            }
        }

        style = "<style id='customStyles'>" + pageWidth + pageBackground + linkColor + style + headerLogo + "</style>";

        return new HtmlString(style);
    }
    public IHtmlString webcomicxVersion(){
        //version nuber for webcomicx
        //make sure this is always at the bottom of model.cs
        var verion = new HtmlString("<a href='http://webcomicx.azurewebsites.net'>WebcomicX 0.1</a>");
        return verion;
    }
}
