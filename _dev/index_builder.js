var fs = require('fs');

var builder = (function(){
	var _basePath = 'pages/';
	var _indexFile = 'index.html';

	// читаем директорию
	var _readDir = function(){
		return fs.readdirSync(_basePath);
	};

	// формируем объект путь:тайл
	var _getPagesList = function() {
		var pagesList = {};

		var files = _readDir();

		files.forEach(function (file, i, arr) {
			var
				path = _basePath + file;

			var fileContent = fs.readFileSync(path, 'utf-8');

			var
				regExp = /<title>(.*)<\/title>/gmi,
				matches = regExp.exec(fileContent),
				title = matches[1];

			pagesList[path] = title;
		});

		return pagesList;
	};

	// генерируем лишки
	var _generateMarkupForList = function(){
		var pagesList = _getPagesList();
		var linksList = "";
		var i = 1;

		for (var page in pagesList) {
			var markup = "<li>" +
								"<a href='" + page + "'>" + i + '. ' + pagesList[page] + "</a>" +
							"<li>";

			linksList += markup;
			i++;
		}

		return linksList;
	}

	// разметка для списка
	var _generateWrapMarkup = function(markup) {
		var markup = '<ul class="makeups_list">' + markup + '</ul>';

		return markup
	};

	//читаем индекс и вставляем разметку в список
	var _generateIndexHtml = function(){
		var indexMarkup = fs.readFileSync(_indexFile, 'utf-8');
		var pagesMarkups = _generateMarkupForList();
		var regExp = /<ul class="makeups_list">(.*)<\/ul>/gmi;

		return indexMarkup.replace(regExp, _generateWrapMarkup(pagesMarkups));
	}

	return {
		init: function(){
			fs.writeFile(_indexFile, _generateIndexHtml());
		}
	}
}());

builder.init();