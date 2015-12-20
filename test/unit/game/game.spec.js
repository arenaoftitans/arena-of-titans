import { Game } from '../../../app/game/game';


class Popup {
}


describe('the Game module', () => {
    var sut;

    beforeEach(() => {
        sut = new Game();
    });

    it('creates a popup', () => {
        sut.popup('test', {test: true});
        expect(sut.type).toBe('test');
        expect(sut.data.test).toBe(true);
    });

    it('close the popup on resolve', done => {
        sut.popup('test', {test: true}).then(data => {
            expect(data.test).toBe(true);
            expect(sut.type).toBe(null);
            expect(sut.data).toBe(null);
            done();
        });

        sut.popupDefered.resolve({test: true});
    });
});
