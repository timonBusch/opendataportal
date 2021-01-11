/* This is NOT a SWAC component yet. TODO: rewrite */
let translations = new Object();
translations.de = new Object();
translations.de.articles = "Artikel";
translations.de.news = "Nachrichten";
translations.de.exercises = "Aufgaben";
translations.de.projects = "Projekte";
translations.de.newarticle = "Neuen Artikel anlegen";
translations.de.readfurther = "Weiterlesen";
translations.de.articleheadline = "Artikelüberschrift";
translations.de.save = "Speichern";
translations.de.username = "Benutzername";
translations.de.password = "Passwort";
translations.de.login = "Anmelden";
translations.de.disclaimer = "Haftungsausschluss";
translations.de.dataprotectionstatement = "Datenschutzerklärung";
translations.de.imprint = "Impressum";
translations.de.noarticles = "Derzeit sind keine Artikel verfügbar";
translations.de.artnotfound = "Der Artikel wurde nicht gefunden";
translations.de.submit = "Absenden";
translations.de.comment = "Kommentar";
translations.de.rating = "Bewertung";
translations.de.file = "Datei";
translations.de.nocomments = "Bisher wurden keine Kommentare abgegeben";

translations.en = new Object();
translations.en.article = "article";
translations.en.news = "news";
translations.en.exercises = "exercises";
translations.en.project = "project";
translations.en.readfurther = "read more";
translations.en.articleheadline = "article headline";
translations.en.save = "save";
translations.en.username = "username";
translations.en.password = "password";
translations.en.login = "login";
translations.en.disclaimer = "disclaimer";
translations.en.dataprotectionstatement = "data protection statement";
translations.en.imprint = "imprint";
translations.en.noarticles = "Currently there are no articles";
translations.en.artnotfound = "The article was not found";
translations.en.submit = "submit";
translations.en.comment = "Comment";
translations.en.rating = "rating";
translations.en.file = "file";
translations.en.nocomments = "Currently there are no comments";

let translator = {};
translator.language = '';
translator.defaultlanguate = 'de';

translator.translate = function(language) {
	if(typeof language === 'undefined' || language === '') {
		language = translator.language;
	} else {
		translator.language = language;
	}
	
	if(typeof translations[language] === 'undefined') {
		language = translator.defaultlanguage;
	}
	
	// Translate in placeholders
	let allplaceh = document.querySelectorAll("[placeholder]");
	for(var placeh of allplaceh) {
		let langWordId = placeh.attributes.getNamedItem('placeholder').value;
		let translation = translations[language][langWordId];		
		if(typeof translation != 'undefined') {
			placeh.attributes.getNamedItem('placeholder').value = translation;
		}
	}
	
	// Translate all buttons
	let allbuttons = document.querySelectorAll("input[type=submit]");
	for(var button of allbuttons) {
		let langWordId = button.value;
		let translation = translations[language][langWordId];
		if(typeof translation != 'undefined') {
			button.value = translation;
		}
	}
	
	// Translate all links
	let alllinks = document.querySelectorAll("a");
	for(var link of alllinks) {
		let langWordId = link.innerHTML;
		let translation = translations[language][langWordId];
		if(typeof translation != 'undefined') {
			link.innerHTML = translation;
		}
	}
	
	// Translate all labels
	let alllabels = document.querySelectorAll("label");
	for(var label of alllabels) {
		let langWordId = label.innerHTML;
		let translation = translations[language][langWordId];
		if(typeof translation != 'undefined') {
			label.innerHTML = translation;
		}
	}
}