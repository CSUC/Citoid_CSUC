
{
	"translatorID": "dd2d7c63-0c4b-4da4-b1d8-e72c7445c1e0",
	"label": "Tesis Doctorals en Xarxa",
	"creator": "CSUC",
	"target": "^https?://(www\.)?(tdx\.cat|tesisenred\.net)",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsb",
	"lastUpdated": "2016-09-22 15:33:33"
}


function detectWeb(doc, url) {
	var type = ZU.xpath(doc, '//meta[@name="DC.type"]/@content');
	if (type.length>0) {
		if (mappingTable[type[0].textContent]) {
			return mappingTable[type[0].textContent];
		} else {
			return "thesis";
		}
	}else{
		return "multiple";
	}
}

var mappingTable = {
	"info:eu-repo/semantics/doctoralThesis":"thesis",
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
					item.date = date[0].content
			}
			
			//add abstract
			var abstract = ZU.xpath(doc, '//meta[@name="citation_abstract"]');
			if (abstract.length>0) {
					item.abstractNote = abstract[0].content
			}
			
			if ( ! item.abstract ) {
				var abstract = ZU.xpath(doc, '//meta[contains(@name, "DCTERMS.abstract")]');
				if (abstract.length>0) {
						item.abstractNote = abstract[0].content
				}			
			}
			
			//add URL
			var identfiers = ZU.xpath(doc, '//meta[contains(@scheme, "DCTERMS.URI")]');
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
					item.university = publisher[i].content;

				}
				
			}
			
			//add tags -> from subjects
			var tags = ZU.xpath(doc, '//meta[contains(@name, "DC.subject")]');
			if (tags.length>0) {
					item.tags = [];
					for (var t=0; t<tags.length; t++) {
						item.tags.push( tags[t].content );
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
			if (pages.length>0) {
					var cleanpages= pages[0].textContent.split('p.')[0];
					// item.pages="p. 1-"+cleanpages;
					item.numPages = parseInt( cleanpages, 10 );
			}
			//add type
			item.thesisType="Ph.D. Thesis";
			
		item.complete();

}

/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "http://tdx.cat/handle/10803/393947",
		"items": [
			{
				"itemType": "thesis",
				"title": "El deporte en la vida y en la obra de Manuel Vázquez Montalbán: 1939-2003",
				"creators": [
					{
						"lastName": "Osúa Quintana",
						"firstName": "Jordi",
						"creatorType": "creator"
					}
				],
				"date": "2013-10-29",
				"language": "spa",
				"libraryCatalog": "Tesis Doctorals en Xarxa",
				"shortTitle": "El deporte en la vida y en la obra de Manuel Vázquez Montalbán",
				"thesisType": "Ph.D. Thesis",
				"university": "Universitat de Barcelona",
				"url": "http://hdl.handle.net/10803/393947",
				"attachments": [],
				"tags": [
					"070",
					"79",
					"Ciències de l'Educació",
					"Deportes",
					"Esports",
					"Periodisme esportiu",
					"Periodismo deportivo",
					"Sports",
					"Sports journalism",
					"Vázquez Montalbán, Manuel, 1939-2003"
				],
				"notes": [],
				"seeAlso": []
			}
		]
	},
	{
		"type": "web",
		"url": "http://tdx.cat/handle/10803/393946",
		"items": [
			{
				"itemType": "thesis",
				"title": "Valoración nutricional de jóvenes nadadoras de natación sincronizada",
				"creators": [
					{
						"lastName": "Carrasco Marginet",
						"firstName": "Marta",
						"creatorType": "creator"
					}
				],
				"date": "2015-05-13",
				"language": "spa",
				"libraryCatalog": "Tesis Doctorals en Xarxa",
				"thesisType": "Ph.D. Thesis",
				"university": "Universitat de Barcelona",
				"url": "http://hdl.handle.net/10803/393946",
				"attachments": [],
				"tags": [
					"79",
					"Body composition",
					"Ciències de l'Educació",
					"Composició corporal",
					"Composición corporal",
					"Hematologia",
					"Hematology",
					"Hematología",
					"Natació sincronitzada",
					"Natación sincronizada",
					"Nutrició",
					"Nutrición",
					"Nutrition",
					"Synchronized swimming"
				],
				"notes": [],
				"seeAlso": []
			}
		]
	}
]
/** END TEST CASES **/