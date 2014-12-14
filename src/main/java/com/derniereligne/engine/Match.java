package com.derniereligne.engine;

import com.derniereligne.engine.board.Board;
import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.cards.movements.MovementsCard;
import com.derniereligne.engine.cards.trumps.Trump;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * <b>Class representating a match.</b>
 * <div>
 * A match caracteristics are :
 * <ul>
 * <li>the players in this match,</li>
 * <li>the current player playing.</li>
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
    private final List<Player> players;
    /**
     * The list of players who won the game.
     */
    private List<Player> winners;
    /**
     * True when the game is over.
     */
    private boolean gameOver;
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
    private final Board board;
    /**
     * Next available rank for winner.
     *
     * @since 1.0
     */
    private Integer nextRankAvailable = 1;

    /**
     * <b>Constructor initializing a match with the given parameters.</b>
     * <div>
     * By default, the active player is the first player in the list of players.
     * </div>
     *
     * @param players The list of players in this match.
     * @param board The board this match is played on.
     * @param deckCreator To create an new deck for each player.
     *
     * @see Board
     * @see Player
     * @see Player#newGameForPlayer(int, com.derniereligne.engine.board.Board,
     * com.derniereligne.engine.cards.Deck)
     *
     * @since 1.0
     */
    public Match(Player[] players, Board board, DeckCreator deckCreator) {
        this(Arrays.asList(players), board, deckCreator);
    }

    public Match(List<Player> players, Board board, DeckCreator deckCreator) {
        this.players = players;
        this.board = board;
        this.players.parallelStream().forEach(player
                -> player.initGame(board, deckCreator)
        );
        this.activePlayer = players.get(0);
        this.gameOver = false;
        this.winners = new ArrayList<>();
    }

    /**
     * Returns the current square of the active player.
     *
     * @return Square
     */
    public Square getActivePlayerCurrentSquare() {
        return activePlayer.getCurrentSquare();
    }

    /**
     * <b>Get the x coordinate of the active player.</b>
     *
     * @return The x coordinate of the square the active player is on.
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
     * @return The y coordinate of the square the active player is on.
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
     * @return The index of the active player.
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

    public void playTrumpCard(Player caster, Player target, Trump trumpCard) {
        if (caster.canPlayTrumpCard(trumpCard) && activePlayer.equals(caster)) {
            caster.playTrumpCard(trumpCard, target);
        }
    }

    /**
     * <b>Method to update the match once a player has selected where to go.</b>
     * <div>
     * If the next player is the same than the one playing, the game will end.<br/>
     * If the active player is on its last line and has not move since last turn, he wins and the
     * rank is updated.<br/>
     * If everybody minus 1 player won, the game will end.<br/>
     * Else, the active player moves and the next player becomes active.
     * </div>
     *
     * @param targetedX The x coordinate to move to.
     * @param targetedY The y coordinate to move to.
     * @param cardPlayed The card played to get there
     *
     * @return The next player to play.
     *
     * @see Board#getSquare(int, int)
     *
     * @see #activePlayer
     * @see #board
     * @see #continueGameIfEnoughPlayers(com.derniereligne.engine.Player, int, int)
     * @see #nextRankAvailable
     * @see #getNextPlayerInList()
     * @see #playerWinner()
     *
     * @see Player
     * @see Player#aim()
     * @see Player#hasWon()
     * @see Player#getCurrentSquare()
     * @see Player#getIndex()
     * @see Player#moveTo(com.derniereligne.engine.board.Square)
     * @see Player#wins(int)
     *
     * @since 1.0
     */
    public Player playTurn(int targetedX, int targetedY, MovementsCard cardPlayed) {
        activePlayer.play(board, cardPlayed, targetedX, targetedY);

        return continueGameIfEnoughPlayers();
    }

    /**
     * <b>Continues the game if there are enough players in game.</b>
     * If there are more than 1 non winner player, the active player moves and the active player
     * changes.
     *
     * @param nextPlayer Next active player
     * @param targetedX X where to go
     * @param targetedY Y where to go
     *
     * @return The next active player.
     *
     * @see Board#getSquare(int, int)
     *
     * @see #activePlayer
     * @see #board
     * @see #players
     *
     * @see Player#moveTo(com.derniereligne.engine.board.Square)
     */
    private Player continueGameIfEnoughPlayers() {
        setNextPlayer();
        if (gameHasEnoughPlayersToContinue()) {
            return activePlayer;
        } else {
            gameOver = true;
            return null;
        }
    }

    /**
     * Check if the number of players who can still play is greater than 1.
     *
     * @return True if the of players that can still play is greater than 1.
     */
    private boolean gameHasEnoughPlayersToContinue() {
        return getNumberOfPlayersNotWinner() > 1;
    }

    /**
     * Return the number of players who can still play.
     *
     * @return the number of players who can still play.
     */
    private int getNumberOfPlayersNotWinner() {
        return players.parallelStream()
                .filter(player -> player != null && !player.isWinnerInMatch())
                .collect(Collectors.toList())
                .size();
    }

    /**
     * Change the value of the current player to the player that will play next (it can be the
     * same).
     *
     * @see Match#activePlayer
     */
    private void setNextPlayer() {
        if (!activePlayer.canPlay()) {
            activePlayer = getNextPlayer();
        }
    }

    private Player getNextPlayer() {
        Player nextPlayer;
        do {
            nextPlayer = getNextPlayerInList();
            nextPlayer.initTurn();

            if (nextPlayer.hasReachedItsAim()) {
                playerWinner(nextPlayer);
            }
        } while (nextPlayer.hasWon());

        return nextPlayer;
    }

    /**
     * <b>Makes the active player a winner.</b>
     * <ul>
     * <li>active player wins,</li>
     * <li>the next available rank is higher.</li>
     * </ul>
     *
     * @see #activePlayer
     * @see #nextRankAvailable
     *
     * @since 1.
     */
    private void playerWinner(Player player) {
        player.wins(nextRankAvailable);
        winners.add(player);
        nextRankAvailable++;

        if (!gameHasEnoughPlayersToContinue()) {
            gameOver = true;
            winners.add(players.parallelStream()
                    .filter(pl -> pl != null && !pl.hasWon())
                    .findFirst()
                    .get());
        }
    }

    /**
     * <b>Method to find the next player in this match.</b>
     * <div>
     * <ul>
     * <li>First, it will skip all null players until it gets to a player or the end of the list of
     * players,</li>
     * <li>if the end is reached, the first step will start again.</li>
     * </ul>
     * Either a null player
     * </div>
     * This algorithm will reach either a non-null player in the game or the same player as the
     * active one.
     *
     * @return The next active player.
     *
     * @see Match#activePlayer
     * @see Match#players
     *
     * @see Player#getIndex()
     *
     * @since 1.0
     */
    private Player getNextPlayerInList() {
        int indexNextPlayer = getNextPlayerIndex(activePlayer.getIndex() + 1);

        if (indexNextPlayer == players.size()) {
            indexNextPlayer = getNextPlayerIndex(0);
        }
        return players.get(indexNextPlayer);
    }

    /**
     * Returns the index of the next player who has an index >= to the index of the player passed as
     * a parameter.
     *
     * @param indexNextPlayerStartValue Index from which to start the search.
     *
     * @return The index of the next player.
     */
    private int getNextPlayerIndex(int indexNextPlayerStartValue) {
        int indexNextPlayer = indexNextPlayerStartValue;
        while (indexNextPlayer < players.size()) {
            if (players.get(indexNextPlayer) != null && !players.get(indexNextPlayer).hasWon()) {
                break;
            } else {
                indexNextPlayer++;
            }
        }

        return indexNextPlayer;
    }

    /**
     * Pass the turn of the current player.
     *
     * @return the next active player.
     */
    public Player passThisTurn() {
        activePlayer.pass();
        return continueGameIfEnoughPlayers();
    }

    /**
     * <b>Return the list of players in game.</b>
     *
     * @return List of players in game
     *
     * @see Match#players
     *
     * @see Player
     *
     * @since 1.0
     */
    public List<Player> getPlayers() {
        return players;
    }

    /**
     * <b>Return the active player.</b>
     *
     * @return The active player
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

    public String getActivePlayerName() {
        return activePlayer.getName();
    }

    public List<Map<String, String>> getActivePlayerHandForJsonExport() {
        return activePlayer.getDeck().getHandForJsonExport();
    }

    public boolean getGameOver() {
        return gameOver;
    }

    public List<String> getWinnerNames() {
        return winners.parallelStream()
                .map(player -> player.getName())
                .collect(Collectors.toList());
    }

}
