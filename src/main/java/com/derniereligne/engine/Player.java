package com.derniereligne.engine;

import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.cards.movements.MovementsCard;
import com.derniereligne.engine.board.Board;
import java.util.HashSet;
import java.util.Objects;
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
    private boolean isWinnerInCurrentMatch;
    private int rank;

    /**
     * <b>Constructor initiating the name with the given parameter.</b>
     *
     * @param name
     *          The name of the player.
     * @param index The index of the player.
     *
     * @see Player#board
     * @see Player#canPlay
     * @see Player#currentSquare
     * @see Player#index
     * @see Player#name
     *
     * @since 1.0
     */
    public Player(String name, int index) {
        this.name = name;
        this.currentSquare = null;
        this.canPlay = false;
        this.index = index;
    }

    public boolean isWinnerInMatch() {
        return isWinnerInCurrentMatch;
    }

    /**
     * <b>Prints the possible movements for this player.</b>
     *
     * @param card
     *          The card used to find the possible movements.
     *
     * @see MovementsCard
     * @see Card#getPossibleMovements(com.derniereligne.engine.board.Square)
     * @see Square
     *
     * @since 1.0
     */
    public void play(MovementsCard card) {
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
        if (currentSquare != null)
            currentSquare.empty();
        currentSquare = square;
        currentSquare.setAsOccupied();
    }

    public Square getCurrentSquare() {
        return currentSquare;
    }

    public void wins(int rank) {
        canPlay = false;
        isWinnerInCurrentMatch = true;
        this.rank = rank;
    }

    public void initGame(Board board) {
        currentSquare = board.getSquare(index * 4, 8);
        isWinnerInCurrentMatch = false;
    }

    public Set<Integer> aim() {
        int oppositeIndex = index + 4 * ((index >= 4) ? -1 : 1);
        Set<Integer> toReturn = new HashSet<>();
        for (int i = 0; i < 3; i++)
            toReturn.add(4 * oppositeIndex + i);
        return toReturn;
    }

    public boolean canPlay() {
        return canPlay;
    }

    public int getIndex() {
        return index;
    }

    @Override
    public boolean equals(Object player) {
        return (player != null && player.getClass() == Player.class && name.equals(((Player)player).name));
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 89 * hash + Objects.hashCode(this.name);
        hash = 89 * hash + Objects.hashCode(this.currentSquare);
        hash = 89 * hash + (this.canPlay ? 1 : 0);
        hash = 89 * hash + this.index;
        return hash;
    }
}
