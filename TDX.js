function detectWeb(doc, url) {
	var type = ZU.xpath(doc, '//meta[@name="DC.type"]/@content');
	if (type.length>0) {
		if (mappingTable[type[0].textContent]) {
			return mappingTable[type[0].textContent];
		} else {
			return "doctoralThesis";
		}
	}else{
		return "multiple";
	}
}

var mappingTable = {
	"info:eu-repo/semantics/doctoralThesis":"doctoralThesis",
}




function doWeb(doc, url) {
	if (detectWeb(doc, url) == "multiple") {
		
				var hits=[];
	var urls=[];
	var results=ZU.xpath(doc,'//div[@class="artifact-title"]/a');
	for (var i in results) {
		hits.push(results[i].href);

			}
			
		Zotero.selectItems(hits, function (items) {
			if (!items) {
				return true;
			}
			var items = new Array();
			for (var j in items) {
				urls.push(j);
				
			}
			ZU.processDocuments(urls, scrape);
		});
	} else {
		scrape(doc, url);
	}
}

function scrape(doc, url) {
			var item = new Zotero.Item("thesis");
			//title
			var titles = ZU.xpath(doc, '//meta[@name="citation_title"]');
			if (titles) {
					item.title = titles[0].content
			}
			
			//add isbn
			var isbn = ZU.xpath(doc, '//meta[@name="citation_isbn"]');
			if (isbn.length>0) {
					item.isbn = isbn[0].content
			}
			
			//add issn
			var issn = ZU.xpath(doc, '//meta[@name="citation_issn"]');
			if (issn.length>0) {
					item.issn = issn[0].content
			}
			
			//add DATE
			var date = ZU.xpath(doc, '//meta[@name="citation_date"]');
			if (date.length>0) {
					item.Date = date[0].content
			}
			
			//add abstract
			var abstract = ZU.xpath(doc, '//meta[@name="citation_abstract"]');
			if (abstract.length>0) {
					item.abstract = abstract[0].content
			}
			
			//add DOI
			var identfiers = ZU.xpath(doc, '//meta[contains(@name, "DC.identifier")]');
			if (identfiers.length>0) {
					item.url=identfiers[0].content;
			}
			
			//add language
			var language = ZU.xpath(doc, '//meta[@name="citation_language"]');
			if (language.length>0) {
					item.language=language[0].content;
			}

			//add publisher 
			var publisher = ZU.xpath(doc, '//meta[@name="citation_publisher"]');
			if (publisher.length>0) {
				for (var i=0; i<publisher.length; i++) {
					item.publisher = publisher[i].content;
				}
				
			}
			
			var authors = ZU.xpath(doc, '//meta[@name="citation_author"]');
			if (authors) {
				item.creators = [];
				for (var a=0; a<authors.length; a++) {
					var authorsText = authors[a].content;
				var authorsType = authors[a].name.substr(3);//either creator or contributer
				var authorParts = authorsText.split(',');
				//distinguish between lastName (every letter is in uppercase) from firstName
				//but there might also be just initials (e.g. "D.") from the firstName
				var firstName = "";
				var lastName = "";
				var splitPos=0;
				
				if (authorParts.length>1){
				firstName=authorParts[1];
				lastName= authorParts[0];
				}else{
					firstName=authorParts[0];
				}
				item.creators.push( {lastName:lastName.trim(), firstName:firstName.trim(), creatorType:"creator" });
			}
		}
		
			//add pages
			var pages =ZU.xpath(doc, '//*[@element="format" and @qualifier="extent"]');
			var cleanpages= pages[0].textContent.split('p.')[0];
			if (pages.length>0) {
					item.pages="p. 1-"+cleanpages;
			}
			//add type
			item.type="Ph.D. Thesis";
			
		item.complete();

}