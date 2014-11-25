package com.derniereligne.engine;

import com.derniereligne.engine.board.Square;
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
    private static final int boardArmWidth = 4;
    private static final int boardArmLength = 8;
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

    /**
     * <b>Returns if this player is winner in the current match.</b>
     *
     * @return
     *          If the player is winner in the current match.
     *
     * @see Player#isWinnerInCurrentMatch
     *
     * @since 1.0
     */
    public boolean isWinnerInMatch() {
        return isWinnerInCurrentMatch;
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
        if (currentSquare != null) {
            currentSquare.empty();
        }
        currentSquare = square;
        currentSquare.setAsOccupied();
    }

    /**
     * <b>Returns the square this player is on.</b>
     *
     * @return
     *          The square this player is on.
     *
     * @see Player#currentSquare
     *
     * @since 1.0
     */
    public Square getCurrentSquare() {
        return currentSquare;
    }

    /**
     * <b>Make this player a winner with a given rank.</b>
     * <div>
     *  This player will be stated as a winner but unable to play.
     * </div>
     *
     * @param rank
     *          Rank given to this player in the game.
     *
     * @see Player#canPlay
     * @see Player#isWinnerInCurrentMatch
     * @see Player#rank
     *
     * @since 1.0
     */
    public void wins(int rank) {
        canPlay = false;
        isWinnerInCurrentMatch = true;
        this.rank = rank;
    }

    /**
     * <b>Initialize a game with the given board.</b>
     * <div>
     *  The player will be on a current square depending on its index.
     * </div>
     *
     * @param board
     *          Board where the game initialized will be played.
     *
     * @see Player#currentSquare
     * @see Player#index
     * @see Player#isWinnerInCurrentMatch
     * @see Player#rank
     */
    public void initGame(Board board) {
        currentSquare = board.getSquare(index * boardArmWidth, boardArmLength);
        currentSquare.setAsOccupied();
        isWinnerInCurrentMatch = false;
        rank = -1;
    }

    /**
     * <b>Returns the goals of this player.</b>
     * <div>
     *  Returns the set of X coordinates that can make this player a winner.
     * </div>
     *
     * @return
     *          The goals of this player.
     *
     * @see Player#index
     *
     * @since 1.0
     */
    public Set<Integer> aim() {
        int oppositeIndex = index + boardArmWidth * ((index >= boardArmWidth) ? -1 : 1);
        Set<Integer> toReturn = new HashSet<>();
        for (int i = 0; i < boardArmWidth; i++) {
            toReturn.add(4 * oppositeIndex + i);
        }
        return toReturn;
    }

    /**
     * <b>Returns if this player can play or not.</b>
     *
     * @return
     *          If this player can play or not.
     *
     * @see Player#canPlay
     *
     * @since 1.0
     */
    public boolean canPlay() {
        return canPlay;
    }

    /**
     * <b>Returns the index of this player in its current game.</b>
     *
     * @return
     *          The index of this player in its current game.
     *
     * @see Player#index
     *
     * @since 1.0
     */
    public int getIndex() {
        return index;
    }

    /**
     * <b>Returns if a player is the same as this one.</b>
     * <div>
     *  Returns true if the player in parameter as the same name as this player.
     * </div>
     *
     * @param player
     *          Player to compare with.
     *
     * @return
     *          If the parameter and this player are the same.
     *
     * @see #name
     *
     * @since 1.0
     */
    @Override
    public boolean equals(Object player) {
        return player != null
                && player.getClass() == Player.class
                && name.equals(((Player)player).name);
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
