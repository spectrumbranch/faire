test:
	./node_modules/.bin/mocha --reporter list
install:
	npm install .
.PHONY: test
