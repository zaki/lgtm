
COFFEE=coffeebar
COFFEEARGS=--minify -o js

all: zip

coffee: lgtm.js

lgtm.js: coffee/lgtm.coffee
	$(COFFEE) $(COFFEEARGS) coffee/lgtm.coffee

clean:
	rm js/lgtm.js
	rm lgtm.zip
	rm dist/lgtm.zip

zip: coffee
	zip -r lgtm.zip css js options res templates manifest.json
	mv lgtm.zip dist/
