import '../../../setup';
import { AotBoardCustomElement } from '../../../../../app/game/play/widgets/board';
import { ApiStub } from '../../../utils';


describe('board', () => {
    let sut;
    let mockedApi;

    beforeEach(() => {
        mockedApi = new ApiStub();
        sut = new AotBoardCustomElement(mockedApi);
    });

    it('should register callbacks', () => {
        expect(mockedApi._cbs[mockedApi.requestTypes.view].length).toBe(1);
    });

    it('should move to on possible square', () => {
        spyOn(mockedApi, 'play');
        sut._possibleSquares = ['square-0-0'];
        sut.selectedCard = {name: 'King', color: 'red'};

        sut.moveTo('square-0-0', 0, 0);

        expect(mockedApi.play).toHaveBeenCalledWith({
            cardName: 'King',
            cardColor: 'red',
            x: 0,
            y: 0
        });
        expect(sut._possibleSquares.length).toBe(0);
        expect(sut.selectedCard).toBe(null);
    });

    it('should only move on possible square', () => {
        spyOn(mockedApi, 'play');
        sut._possibleSquares = ['square-0-0'];
        sut.selectedCard = {name: 'King', color: 'red'};

        sut.moveTo('square-1-0', 0, 0);

        expect(mockedApi.play).not.toHaveBeenCalled();
    });

    it('should not move if no possible squares', () => {
        spyOn(mockedApi, 'play');
        sut.selectedCard = {name: 'King', color: 'red'};

        sut.moveTo('square-1-0', 0, 0);

        expect(mockedApi.play).not.toHaveBeenCalled();
    });

    it('should not move if no selected card', () => {
        spyOn(mockedApi, 'play');
        sut._possibleSquares = ['square-0-0'];
        sut.selectedCard = null;

        sut.moveTo('square-0-0', 0, 0);

        expect(mockedApi.play).not.toHaveBeenCalled();
    });
});
