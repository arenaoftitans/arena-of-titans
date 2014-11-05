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
     * @since 1.0
     */
    Player[] players;
    /**
     * The player currently playing.
     *
     * @since 1.0
     */
    Player activePlayer;
    Board board;
    Integer nextRankAvailable = 1;

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
     *
     * @since 1.0
     */
    public Match(Player[] players, Board board) {
        this.players = players;
        this.board = board;
        for (int i =0; i <=7; i++) {
            this.players[i].newGameForPlayer(i, board);
        }
        this.activePlayer = players[0];
    }

    public int getActivePlayerX() {
        return activePlayer.getCurrentSquare().getX();
    }

    public int getActivePlayerY() {
        return activePlayer.getCurrentSquare().getY();
    }

    public int getActivePlayerId() {
        return activePlayer.getIndex();
    }

    public Player playTurn(int targetedX, int targetedY) {
        Player nextPlayer = getNextPlayer();
        if (nextPlayer.getIndex() == activePlayer.getIndex()) {
            //TODO add what to do when can't play
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
            for (Player player : players)
                if (player.canPlay())
                    numberOfPlayersNotWinner++;
            if (numberOfPlayersNotWinner == 0 || numberOfPlayersNotWinner == 1) {
                //What to do when win ?
            }
            activePlayer.moveTo(board.getSquare(targetedX, targetedY));
            activePlayer = nextPlayer;
        }
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
