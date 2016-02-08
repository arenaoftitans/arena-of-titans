import { bindable, inject, ObserverLocator } from 'aurelia-framework';


@inject(ObserverLocator)
export class AotInfosCustomElement {
    @bindable type = null;
    @bindable infos = null;

    constructor(observerLocator) {
        observerLocator
            .getObserver(this, 'infos')
            .subscribe(() => {
                if (!this.infos.event) {
                    return;
                } else if (this.type === 'trumps') {
                    let trumpsContainer = document.getElementById('player-trumps');
                    let infosElement = document.getElementById('trumps-element-infos');
                    let target = this.infos.event.target;

                    let infosHeight = 150;
                    let top = 0;
                    let element = target;
                    do {
                        top += element.offsetTop  || 0;
                        element = element.offsetParent;
                    } while (element);

                    infosElement.style.top = top - infosHeight + 'px';
                    infosElement.style.left = trumpsContainer.getBoundingClientRect().right + 'px';
                } else if (this.type === 'cards') {
                    let cardsContainer = document.getElementById('cards-container');
                    let infosElement = document.getElementById('cards-element-infos');
                    let target = this.infos.event.target;

                    let halfCardWidth = 69 / 2;
                    let halfInfosWidth = 150 / 2;

                    infosElement.style.bottom = cardsContainer.getBoundingClientRect().bottom -
                        cardsContainer.getBoundingClientRect().top +
                        40 +
                        'px';
                    infosElement.style.left = target.getBoundingClientRect().left -
                        halfInfosWidth +
                        halfCardWidth +
                        'px';
                }
            });
    }
}
