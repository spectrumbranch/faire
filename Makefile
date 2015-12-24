test:
	@if [ "$(NODE_ENV)" = "" ]; then NODE_ENV=test ./node_modules/.bin/mocha --reporter list -t 5000; else ./node_modules/.bin/mocha --reporter list -t 5000; fi
install:
	npm install .
.PHONY: test
