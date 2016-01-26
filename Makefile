.PHONY: help
help:
	@echo "Usage. make <target>"
	@echo
	@echo "Possible targets:"
	@echo "- deploy: deploy a new version of AoT to the server"
	@echo "- sprites: build all sprites"


.PHONY: deploy
deploy:
	gulp clean && gulp prod && rsync -a --delete "public/" "aot:app/"


.PHONY: sprites
sprites:
	glue -s assets/game/cards/movement -o style/sprites --img assets/sprites
