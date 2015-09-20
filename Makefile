.PHONY: help
help:
	@echo "Usage. make <target>"
	@echo
	@echo "Possible targets:"
	@echo "- deploy: deploy a new version of AoT to the server"


.PHONY: deploy
deploy:
	gulp clean && gulp prod && rsync -a --delete "public/" "aot:app/"
