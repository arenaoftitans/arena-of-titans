import { bindable, inject, ObserverLocator } from 'aurelia-framework';
import { Wait } from '../../services/utils';


// In milliseconds.
const POPUP_INFOS_APPEAR_TIMEOUT = 1500;


@inject(ObserverLocator)
export class AotInfosCustomElement {
    @bindable type = null;
    @bindable infos = null;
    element = null;
    height
    timeout;
    waitForElement;
    width;

    constructor(observerLocator) {
        observerLocator.getObserver(this, 'infos').subscribe(() => {
            if (this.element === null) {
                this.init();
            } else {
                this.hide();
            }

            if (this.timeout !== undefined) {
                clearTimeout(this.timeout);
            }

            if (!this.infos.event) {
                return;
            } else if (this.infos.visible) {
                let target = this.infos.event.target;
                this.timeout = setTimeout(() => this.show(target), POPUP_INFOS_APPEAR_TIMEOUT);
            }
        });
    }

    init() {
        let infosId = this.getInfosId();
        Wait.forId(infosId).then(element => {
            this.element = element;
            let boundingBox = element.getBoundingClientRect();
            this.width = boundingBox.width;
            this.height = boundingBox.height;
            this.hide();
        });
    }

    getInfosId() {
        switch (this.type) {
            case 'cards':
                return 'cards-element-infos';
            case 'trumps':
                return 'trumps-element-infos';
            default:
                throw new Error('Unsuported typein aot-info: ' + this.type);
        }
    }

    show(target) {
        if (this.type === 'trumps') {
            let trumpsContainer = document.getElementById('player-trumps');

            let top = 0;
            let element = target;
            do {
                top += element.offsetTop || 0;
                element = element.offsetParent;
            } while (element);

            this.element.style.top = top -
                this.height -
                target.getBoundingClientRect().height +
                'px';
            this.element.style.left = trumpsContainer.getBoundingClientRect().width + 'px';
        } else if (this.type === 'cards') {
            let targetBoundingClientRect = target.getBoundingClientRect();

            let halfCardWidth = targetBoundingClientRect.width / 2;
            let halfInfosWidth = this.width / 2;

            this.element.style.top = targetBoundingClientRect.top -
                this.height -
                10 +
                'px';
            this.element.style.left = target.getBoundingClientRect().left -
                halfInfosWidth +
                halfCardWidth +
                'px';
        }
    }

    hide() {
        if (this.element) {
            this.element.style.top = '-500px';
        }
    }
}
