package com.derniereligne.engine;

import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.cards.Card;
import com.derniereligne.engine.board.Board;
import java.util.Set;

/**
 * <b>Class representating a player.</b>
 * <div>
 *  A player is representated by its name, the board its playing on,
 * the square it is on, if it is its turn to play and its number
 * (from 0 to 7, indeed there are between 1 and 8 players on the
 * same board).
 * </div>
 *
 * @author "Dernière Ligne" first development team
 * @version 1.0
 */
public class Player {
    /**
     * The name of the player.<br/>
     * Once initialized, it cannot be modified.
     *
     * @since 1.0
     */
    private final String name;
    /**
     * The board this player is currently playing on.
     *
     * @see Board
     *
     * @since 1.0
     */
    private Board board;
    /**
     * The square this player is on.
     *
     * @see Square
     *
     * @since 1.0
     */
    private Square currentSquare;
    /**
     * To know if it is this player's turn to play.
     *
     * @see Player#choose()
     *
     * @since 1.0
     */
    private boolean canPlay;
    /**
     * The index of this player in the game.<br/>
     * This index is between 0 and 7, indeed there are between 1 and 8 players in a game.
     *
     * @since 1.0
     */
    private int index;

    /**
     * <b>Constructor initiating the name, the board, the current square,
     * the index with the given parameters.</b>
     * <div>
     *  By default, it will be this player's turn to play if
     * its index is 0.
     * </div>
     *
     * @param name
     *          The name of the player.
     * @param board
     *          The board the player is playing on.
     * @param currentSquare
     *          The square the player is on.
     * @param index
     *          The index of the player for the current game it is playing.
     *
     * @see Board
     *
     * @see Player#board
     * @see Player#canPlay
     * @see Player#currentSquare
     * @see Player#index
     * @see Player#name
     *
     * @see Square
     *
     * @since 1.0
     */
    public Player(String name, Board board, Square currentSquare, int index) {
        this.name = name;
        this.board = board;
        this.currentSquare = currentSquare;
        this.canPlay = (index == 0);
        this.index = index;
    }

    /**
     * <b>Prints the possible movements for this player.</b>
     *
     * @param card
     *          The card used to find the possible movements.
     *
     * @see Card
     * @see Card#getPossibleMovements(com.derniereligne.engine.board.Square)
     * @see Square
     *
     * @since 1.0
     */
    public void play(Card card) {
        Set<Square> possibleMovements = card.getPossibleMovements(currentSquare);
        System.out.println("Size: " + possibleMovements.size());
        System.out.println(possibleMovements.toString());
    }

    /**
     * <b>Method to move this player to the given square.</b>
     * <div>
     *  First, we will empty the square the player is on then replace
     * it by the given square and set this last one occupied.
     * </div>
     *
     * @param square
     *          The square to move this player to.
     *
     * @see Square
     * @see Square#empty()
     * @see Square#setAsOccupied()
     *
     * @since 1.0
     */
    public void moveTo(Square square) {
        currentSquare.empty();
        currentSquare = square;
        currentSquare.setAsOccupied();
    }

    /**
     * <b>Choose this player to play.</b>
     * <div>
     *  This method will set the can play argument to true.
     * </div>
     *
     * @see Player#canPlay
     *
     * @since 1.0
     */
    private void choose() {
        canPlay=true;
    }

    /**
     * <b>This method makes the player play.</b>
     * <div>
     *  If the player can't play, nothin happens.
     * If it's indeed the player's turn, its can play argument will be set to false
     * then it will play and finally it will be the next non null player's turn to play.
     * </div>
     *
     * @param players
     *          All the players participating in this game.
     *
     * @see Player#canPlay
     * @see Player#index
     * @see Player#name
     * @see Player#choose()
     *
     * @since 1.0
     */
    public void playTurn(Player[] players) {
        if (!canPlay) {
            System.out.println("Not " + name + "'s turn");
        }
        else {
            System.out.println("Player " + name + " is currently playing.");

            canPlay=false;

            //Thing to do while player playing

            /*if (index == 7)
                players[0].choose();
            else
                players[index + 1].choose();*/

            int testingIndex = index +1;
            while (testingIndex <= 7) {
                if (players[testingIndex] != null)
                    break;
                else
                    testingIndex ++;
            }
            if (testingIndex == 8) {
                testingIndex = 0;
                while (testingIndex <= index)
                    if (players[testingIndex] != null)
                        break;
                    else
                        testingIndex ++;
            }
            if (testingIndex == index)
                System.out.println("Player " + name + " is currently the only player in game");
            else {
                System.out.println("Choosing : " + testingIndex + " and index is " + index);
                players[testingIndex].choose();
            }

        }
    }
}
