package com.derniereligne.engine;

import com.derniereligne.engine.board.Board;
import com.derniereligne.engine.board.Square;
import java.util.Set;

/**
 * <b>Class representating a match.</b>
 * <div>
 * A match caracteristics are :
 * <ul>
 *  <li>the players in this match,</li>
 *  <li>the current player playing.</li>
 * </ul>
 * </div>
 *
 * @author "Dernière Ligne" first development team
 * @version 1.0
 */
public class Match {
    /**
     * The list of players in this match.
     *
     * @see Match#getPlayers()
     *
     * @since 1.0
     */
    private Player[] players;
    /**
     * The player currently playing.
     *
     * @see Match#getActivePlayer() 
     *
     * @since 1.0
     */
    private Player activePlayer;
    /**
     * The board these players play on.
     *
     * @since 1.0
     */
    private Board board;
    /**
     * Next available rank for winner.
     *
     * @since 1.0
     */
    private Integer nextRankAvailable = 1;

    /**
     * <b>Constructor initializing a match with the given parameters.</b>
     * <div>
     *  By default, the active player is the first player in the list of players.
     * </div>
     *
     * @param players
     *          The list of players in this match.
     * @param board
     *          The board this match is played on.
     *
     * @see Board
     * @see Player
     * @see Player#newGameForPlayer(int, com.derniereligne.engine.board.Board)
     *
     * @since 1.0
     */
    public Match(Player[] players, Board board) {
        this.players = players;
        this.board = board;
        for (int i = 0; i <= 7; i++) {
            this.players[i].newGameForPlayer(i, board);
        }
        this.activePlayer = players[0];
    }

    /**
     * <b>Get the x coordinate of the active player.</b>
     *
     * @return
     *          The x coordinate of the square the active player is on.
     *
     * @see Match#activePlayer
     *
     * @see Player#getCurrentSquare()
     * @see Square#getX()
     *
     * @since 1.0
     */
    public int getActivePlayerX() {
        return activePlayer.getCurrentSquare().getX();
    }

    /**
     * <b>Get the y coordinate of the active player.</b>
     *
     * @return
     *          The y coordinate of the square the active player is on.
     *
     * @see Match#activePlayer
     *
     * @see Player#getCurrentSquare()
     * @see Square#getY()
     *
     * @since 1.0
     */
    public int getActivePlayerY() {
        return activePlayer.getCurrentSquare().getY();
    }

    /**
     * <b>Get the index of the active player.</b>
     *
     * @return
     *          The index of the active player.
     *
     * @see Match#activePlayer
     *
     * @see Player#getCurrentSquare()
     * @see Player#getIndex()
     *
     * @since 1.0
     */
    public int getActivePlayerIndex() {
        return activePlayer.getIndex();
    }

    /**
     * <b>Method to update the match once a player has selected where to go.</b>
     * <div>
     *  If the next player is the same than the one playing, the game will end.<br/>
     *  If the active player is on its last line and has not move since last turn, he wins and the rank is updated.<br/>
     *  If everybody minus 1 player won, the game will end.<br/>
     *  Else, the active player moves and the next player becomes active.
     * </div>
     *
     * @param targetedX
     *          The x coordinate to move to.
     * @param targetedY
     *          The y coordinate to move to.
     *
     * @return
     *          The next player to play.
     *
     * @see Board#getSquare(int, int)
     *
     * @see Match#activePlayer
     * @see Match#board
     * @see Match#nextRankAvailable
     * @see Match#getNextPlayer()
     *
     * @see Player
     * @see Player#aim()
     * @see Player#canPlay()
     * @see Player#getCurrentSquare()
     * @see Player#getIndex()
     * @see Player#moveTo(com.derniereligne.engine.board.Square)
     * @see Player#wins(int)
     *
     * @since 1.0
     */
    public Player playTurn(int targetedX, int targetedY) {
        Player nextPlayer = getNextPlayer();
        if (nextPlayer.getIndex() == activePlayer.getIndex()) {
            return null;
        }
        else {
            Set<Integer> aims = activePlayer.aim();
            Square activeSquare = activePlayer.getCurrentSquare();
            boolean aimsContainTargetedX = aims.contains(targetedX);
            if (aimsContainTargetedX && targetedY == 8 && activeSquare.getX() == targetedX && activeSquare.getY() == targetedY) {
                activePlayer.wins(nextRankAvailable);
                nextRankAvailable ++;
            }
            int numberOfPlayersNotWinner = 0;
            for (Player player : players) {
                if (player != null && player.isWinnerInMatch()) {
                    numberOfPlayersNotWinner++;
                }
            }
            if (numberOfPlayersNotWinner == 1) {
                return null;
            } else {
                activePlayer.moveTo(board.getSquare(targetedX, targetedY));
                activePlayer = nextPlayer;
            }
            return activePlayer;
        }
    }

    /**
     * <b>Return the list of players in game.</b>
     *
     * @return
     *          List of players in game
     *
     * @see Match#players
     *
     * @see Player
     *
     * @since 1.0
     */
    public Player[] getPlayers() {
        return players;
    }

    /**
     * <b>Return the active player.</b>
     *
     * @return
     *          The active player
     *
     * @see Match#activePlayer
     *
     * @see Player
     *
     * @since 1.0
     */
    public Player getActivePlayer() {
        return activePlayer;
    }

    /**
     * <b>Method to find the next player in this match.</b>
     * <div>
     *  <ul>
     *   <li>First, it will skip all null players until it gets to a player or the end of the list of players,</li>
     *   <li>if the end is reached, the first step will start again.</li>
     *  </ul>
     * Either a null player
     * </div>
     * This algorithm will reach either a non-null player in the game or the same player as the active one.
     *
     * @return
     *          The next active player.
     *
     * @see Match#activePlayer
     * @see Match#players
     *
     * @see Player#getIndex()
     *
     * @since 1.0
     */
    private Player getNextPlayer() {
        int activeIndex = activePlayer.getIndex();
        int testingIndex = activeIndex +1;
        while (testingIndex <= 7) {
            if (players[testingIndex] != null)
                break;
            else if (players[testingIndex] == null || !players[testingIndex].canPlay())
                testingIndex ++;
        }
        if (testingIndex == 8) {
            testingIndex = 0;
            while (testingIndex <= activeIndex)
                if (players[testingIndex] != null)
                    break;
                else if (players[testingIndex] == null || !players[testingIndex].canPlay())
                    testingIndex ++;
        }
        return players[testingIndex];
    }
}
