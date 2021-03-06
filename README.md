# Blog for "Archer Software" Application

## Blog for "Archer Software" Requirements

Требования:
1. HTML5
2. CSS3 Media Queries, Flexbox.
3. Максимальная ширина сайта 1200 пикселей. На больших мониторах (от 1200 пикселей по ширине) сайт центрируется.
4. Минимальная ширина 320 пикселей. Как должны пересыпаться блоки показано в двух дополнительных макетах ...-640рх.psd.
5. Кроссбраузерность "-2 поколения назад". (IE11, Google Chrome49). 
6. Оптимизация графики.

## Workings of the Application

### Running the Application during Development with Browser-Sync

- From folder `C:\Users\User\Documents\GitHub\archer\archer-blog-app`
- Run `browser-sync start --server --files "*.*"`

### Running the Sass Watch during Development

- From folder `C:\Users\User\Documents\GitHub\archer\archer-blog-app\css`
- Run `sass --watch scss:scss/.`

## Connection new article to blog-homepage! 

### MUST ACTIONS!

1. In the '...\archer-blog-app\articles' folder create new article: "jps-vehicle.html". 
	('article.html' take as example)

2. Create next article's pictures for "Blog Homepage":
	2.0 "jps-vehicle.hd.jpg" (Main article picture. Also used in sharing on facebook and other social nets. Set manualy in "jps-vehicle.html".)
	2.1 "jps-vehicle.desktop.jpg", size 280*170. ( Will be used in 'desktop' version  and as 'big' pictures in 'mobile' version of Blog Homepage "index.html". Also will be used in mobile version of article page "jps-vehicle.html". Set automatically after changes in "articles.json".)
	2.2 "jps-vehicle.mobile.jpg", size 100*100. ( Will be used in 'mobile' version of Blog Homepage "index.html".  Set automatically after changes in "articles.json".)
	
	Name before ".hd.jpg", ".mobile.jpg" and ".desktop.jpg" MUST BE THE SAME!!!!
	
3. Put "jps-vehicle.mobile.jpg" and "jps-vehicle.desktop.jpg" to "...\archer-blog-app\articles\images" folder.

4. Add to "articles.json" next:

					{
						"id"			: "0016",
						"date"			: "June 15, 2017",
						"atclRef"		: "jps-vehicle.html",
						"mobView"		: "",
						"imgName"		: "jps-vehicle", 
						"head"			: "How To Build Your Own GPS Vehicle Tracking System",
						"txt"			: "Today global market starts to experience a real GPS yechnology boom. The use of satellites for navigation becomes more and more popular among car owners, and those who have big automobile busineses. What are the features of this technology? What benefits it can propose to the transportation industry? ",
						"relatedAtclsId" : ["0001", "0002", "0003", "0004", "0005"]
					},
	where: 
	
			"id"			- articles id number ( +1 after previous article),
			"date"			- article adding date,
			"atclRef" 		- article's HTML file name (reference),
			"mobView"		- article's view in "Blog Homepage" mobile version. Can be:
								* "" - standard 'small' view
								* "attn-mobile" - 'big' view
			"imgName"		 - image name before ".mobile.jpg" and before ".desktop.jpg",
			"head"			 - Header of your article in "Blog Homepage",
			"txt"			 - Article's text in 'desctop' version of "Blog Homepage",
			"relatedAtclsId" - related article's ID numbers which will be reflected in 
							   "Related Posts" in "Article Page".

5. Save "articles.json" in root blog catalog "...\archer-blog-app". Reload "index.html". Vualia!  Your article is published

6. Don't forget to adjust SDK of Twitter, Facebook, Linkedin and Google+.


### Recommended actions

To increase efficiency of article's management next is recommended:

1. All the rest pictures of article add to "...\archer-blog-app\articles\images" folder. Build name of picture as next: "gps-vehicle-wave.hd.jpg".
