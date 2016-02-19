.PHONY: help
help:
	@echo "Usage. make <target>"
	@echo
	@echo "Possible targets:"
	@echo "- deploy: deploy a new version of AoT to the server"
	@echo "- devdeploy: deploy a new version of AoT to the dev server"
	@echo "- sprites: build all sprites"
	@echo "- translate: fetch translations and update the JSON files used to translate the site"


.PHONY: deploy
deploy:
	gulp clean-prod && \
	    gulp prod && \
	    rsync -a --delete "public/" "aot:app/"


.PHONY: devdeploy
devdeploy:
	gulp clean-prod && \
	    gulp prod --mock && \
	    rsync -a --delete "public/" "aot:devapp/"


.PHONY: sprites
sprites:
	glue -s assets/game/cards/movement -o style/sprites --img assets/sprites


.PHONY: translate
translate:
	python3 scripts/translate.py
