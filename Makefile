.PHONY: help
help:
	@echo "Usage. make <target>"
	@echo
	@echo "Possible targets:"
	@echo "- deploy: deploy a new version of AoT to the server"
	@echo "- sprites: build all sprites"
	@echo "- translate: fetch translations and update the JSON files used to translate the site"


.PHONY: deploy
deploy:
	gulp clean && gulp prod && rsync -a --delete "public/" "aot:app/"


.PHONY: sprites
sprites:
	glue -s assets/game/cards/movement -o style/sprites --img assets/sprites


.PHONY: translate
translate:
	python3 scripts/translate.py
