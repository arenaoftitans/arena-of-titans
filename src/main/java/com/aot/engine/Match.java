package com.aot.engine;

import com.aot.engine.api.json.JsonExportable;
import com.aot.engine.board.Board;
import com.aot.engine.board.Square;
import com.aot.engine.cards.movements.MovementsCard;
import com.aot.engine.trumps.Trump;
import com.aot.engine.trumps.json.JsonTrump;
import com.aot.engine.api.json.JsonPlayer;
import com.aot.engine.api.json.TrumpPlayedJsonResponse;
import com.aot.engine.cards.Deck;
import com.google.gson.Gson;
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
 * @author "Arena of Titans" first development team
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
    private List<Player> players;
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
     * By default, the active player is the first player in the list of players.
     * </div>
     *
     * @param players The list of players in this match.
     * @param board The board this match is played on.
     * @param deckCreator To create an new deck for each player.
     * @param trumps The list of this player trumps.
     *
     * @see Board
     * @see Player
     * @see Player#newGameForPlayer(int, com.aot.engine.board.Board, com.aot.engine.cards.Deck)
     *
     * @since 1.0
     */
    public Match(Player[] players, Board board, DeckCreator deckCreator, List<Trump> trumps) {
        this(Arrays.asList(players), board, deckCreator, trumps);
    }

    public Match(List<Player> players, Board board, DeckCreator deckCreator, List<Trump> trumps) {
        this.players = players;
        this.board = board;
        this.players.parallelStream().forEach(player
                -> player.initGame(board, deckCreator, trumps)
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

    public Deck getActivePlayerDeck() {
        return activePlayer.getDeck();
    }

    /**
     * Play the trump.
     *
     * @param trump The trump.
     *
     * @param targetIndex The index of the targeted player.
     */
    public void playTrump(Trump trump, int targetIndex) {
        Player target = players.get(targetIndex);
        Match.this.playTrump(target, trump);
    }

    /**
     * Play a trump card that does not require a target player.
     *
     * You must check that the trump doesn't need a target player.
     *
     * @param trump The trump you want to play.
     */
    public void playTrump(Trump trump) {
        activePlayer.playTrump(trump);
    }

    /**
     * Play a trump.
     *
     * @param target The targeted player.
     *
     * @param trump The trump.
     */
    public void playTrump(Player target, Trump trump) {
        activePlayer.playTrump(trump, target);
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
     * @see #continueGameIfEnoughPlayers(com.aot.engine.Player, int, int)
     * @see #nextRankAvailable
     * @see #getNextPlayerInList()
     * @see #playerWinner()
     *
     * @see Player
     * @see Player#aim()
     * @see Player#hasWon()
     * @see Player#getCurrentSquare()
     * @see Player#getIndex()
     * @see Player#moveTo(com.aot.engine.board.Square)
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
     * @see Player#moveTo(com.aot.engine.board.Square)
     */
    private Player continueGameIfEnoughPlayers() {
        if (gameHasEnoughPlayersToContinue()) {
            activePlayer.revertToDefault();
            setNextPlayer();
            activePlayer.makeAffectedByTrumps();
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
        } while (nextPlayer.hasWon() && !gameOver);

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
            // If we are here, there is only one or zero player left. If the laste remaining players
            // won during the same turn, there is no more player who has not won. This is the easiest
            // way to add the potential non winner.
            winners.addAll(players.parallelStream()
                    .filter(pl -> pl != null && !pl.hasWon())
                    .collect(Collectors.toList()));
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
     * Discard a card for the current player.
     *
     * @param card Card to discard.
     */
    public void discard(MovementsCard card) {
        activePlayer.discard(card);
        continueGameIfEnoughPlayers();
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
        return activePlayer.getHandForJsonExport();
    }

    public List<JsonTrump> getActivePlayerTrumpsForJsonExport() {
        return activePlayer.getTrumpsForJsonExport();
    }

    public List<JsonPlayer> getPlayersForJsonExport() {
        return players.parallelStream()
                .map(player -> {
                    JsonPlayer jsonPlayer = new JsonPlayer();
                    jsonPlayer.setName(player.getName());
                    jsonPlayer.setId(Integer.toString(player.getIndex()));
                    jsonPlayer.setIndex(player.getIndex());
                    return jsonPlayer;
                })
                .collect(Collectors.toList());
    }

    public List<TrumpPlayedJsonResponse> getActiveTrumpsForJsonExport() {
        return players.parallelStream()
                .map(player -> {
                    TrumpPlayedJsonResponse trumpPlayedJsonResponse = new TrumpPlayedJsonResponse();
                    trumpPlayedJsonResponse.setPlayerName(player.getName());
                    trumpPlayedJsonResponse.setPlayerIndex(player.getIndex());
                    trumpPlayedJsonResponse.setTrumpNames(player.getActiveTrumpNames());
                    return trumpPlayedJsonResponse;
                })
                .collect(Collectors.toList());
    }

    public boolean getGameOver() {
        return gameOver;
    }

    public List<String> getWinnerNames() {
        return winners.parallelStream()
                .map(player -> player.getName())
                .collect(Collectors.toList());
    }

    /**
     * Check whether the active player can play this trump on the targeted player.
     *
     * @param trump The trump.
     *
     * @param targetIndex The index of the targeted player.
     *
     * @return true if the trump can be played.
     */
    public boolean canActivePlayerPlayTrump(Trump trump, int targetIndex) {
        return 0 <= targetIndex && targetIndex < players.size() && activePlayer.canPlayTrump(trump);
    }

    /**
     * Check whether the active player can play this trump and that it does not require a target
     * player.
     *
     * @param trump The trump the player wants to play.
     *
     * @return True if the player can play this trump.
     */
    public boolean canActivePlayerPlayTrump(Trump trump) {
        return activePlayer.canPlayTrump(trump) && !trump.mustTargetPlayer();
    }

    /**
     * Get the trump by its name.
     *
     * @param trumpName The name of the trump.
     *
     * @return The trump or null.
     */
    public Trump getTrumpForActivePlayer(String trumpName) {
        return activePlayer.getTrumpByName(trumpName);
    }

    public String toJson() {
        prepareForJsonExport();
        Gson gson = new Gson();
        return gson.toJson(this);
    }

    private void prepareForJsonExport() {
        players.parallelStream().map((player) -> player.getDeck()).forEach((deck) -> {
            deck.prepareForJsonExport();
        });
    }

    public static Match fromJson(String json) {
        Gson gson = new Gson();
        Match match = gson.fromJson(json, Match.class);
        match.resetAfterJsonImport();

        return match;
    }

    private void resetAfterJsonImport() {
        players.parallelStream().map((player) -> player.getDeck()).forEach((deck) -> {
            deck.resetAfterJsonImport(board);
        });
    }

}
