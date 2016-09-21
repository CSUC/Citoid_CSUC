{
	"translatorID": "",
	"label": "TDX",
	"creator": "CSUC",
	"target": "^http://www\\.tdx\\.cat/",
	"minVersion": "3",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsv",
	"lastUpdated": "2016-09-21 12:10:00"
}


function detectWeb(doc, url) {
	var type = ZU.xpath(doc, '//meta[contains(@name, "DC.type")]/@content');
	if (type.length>0) {
		if (mappingTable[type[0].textContent]) {
			return mappingTable[type[0].textContent];
		} else {
			return "doctoralThesis";
		}
	}
	
	if ( getSearchResults(doc).length>0 ) {
		return "multiple";
	}
}

var mappingTable = {
	"monograph" : "book",
	"article" : "journalArticle",
	"collection" : "book",
	"incollection" : "bookSection",
	"recension" : "journalArticle",
	"techreport" : "report",//not yet used
	"inproceeding" : "conferencePaper",//not yet used
}

function getSearchResults(doc, checkOnly) {
	var items = {};
	var found = false;
	// TO DO
	return found ? items : false;
}

function doWeb(doc, url) {
	if (detectWeb(doc, url) == "multiple") {
		Zotero.selectItems(getSearchResults(doc, false), function (items) {
			if (!items) {
				return true;
			}
			var items = new Array();
			for (var i in items) {
				items;
			}
			ZU.processDocuments(items, scrape);
		});
	} else {
		scrape(doc, url);
	}
}

function scrape(doc, url) {
	ZU.doGet(url, function(text) {

		var trans = Zotero.loadTranslator('import');
		trans.setTranslator('9cb70025-a888-4a29-a210-93ec52da40d4');//https://github.com/zotero/translators/blob/master/BibTeX.js
		trans.setString(bibTexContent);

		trans.setHandler('itemDone', function (obj, item) {
			
			//title
			var titles = ZU.xpath(doc, '//meta[contains(@name, "DC.title")]');
			if (!item.DOI) {
				for (var i=0; i<titles.length; i++) {
					item.title = item.title[0] + item.title.substr(1).toLowerCase();
				}
			}
			
			//add DOI
			var identfiers = ZU.xpath(doc, '//meta[contains(@name, "DC.identifier")]');
			if (!item.DOI) {
				for (var i=0; i<identfiers.length; i++) {
					item.DOI = identfiers[i].getAttribute("content");
				}
			}
			
			//add language
			item.language = ZU.xpathText(doc, '//meta[contains(@name, "DC.language")]/@content');
			
			
			var authors = ZU.xpath(doc, '//meta[@name="DC.creator" and @content]|//meta[@name="DC.contributor" and @content]');
			if (authors) {
				item.creators = [];
				for (var a=0; a<authors.length; a++) {
					var authorsText = authors[a].content;
				var authorsType = authors[a].name.substr(3);//either creator or contributer
				var authorParts = authorsText.split(' ');
				//distinguish between lastName (every letter is in uppercase) from firstName
				//but there might also be just initials (e.g. "D.") from the firstName
				var firstName = "";
				var lastName = "";
				var splitPos=0;
				while (splitPos<authorParts.length && authorParts[splitPos].toUpperCase() == authorParts[splitPos] && authorParts[splitPos].indexOf('.') == -1 && authorParts[splitPos].length>1) {
					authorParts[splitPos] = ZU.capitalizeTitle(authorParts[splitPos], true);
					splitPos++;
				}
				if (splitPos == authorParts.length && splitPos>1) {//guess: last part is firstName
					firstName = authorParts[splitPos-1];
					lastName = authorParts.slice(0,splitPos-1).join(' ')
				} else {
					firstName = authorParts.slice(splitPos).join(' ');
					lastName= authorParts.slice(0,splitPos).join(' ');
				}
				if (authorsType == "creator") {
					item.creators.push( {lastName:lastName.trim(), firstName:firstName.trim(), creatorType:"author" });
				} else {
					item.creators.push( {lastName:lastName.trim(), firstName:firstName.trim(), creatorType:"contributor" });
				}
				
			}
		}

		item.complete();
	});

trans.translate();
});

}
