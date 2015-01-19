package com.derniereligne.engine;

import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.board.Board;
import com.derniereligne.engine.cards.Deck;
import com.derniereligne.engine.cards.movements.MovementsCard;
import com.derniereligne.engine.trumps.Trump;
import com.derniereligne.engine.trumps.json.JsonTrump;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * <b>Class representating a player.</b>
 * <div>
 * A player is representated by its name, the board its playing on, the square it is on, if it is
 * its turn to play and its number (from 0 to 7, indeed there are between 1 and 8 players on the
 * same board).
 * </div>
 *
 * @author "Dernière Ligne" first development team
 * @version 1.0
 */
public class Player {

    private static final int BOARD_ARM_WIDTH_AND_MODULO = 4;
    public static final int BOARD_ARM_LENGTH_AND_MAX_Y = 8;
    private static final int HASH_BEGIN = 7;
    private static final int HASH_MULTIPLIER = 89;
    private static final int MAX_NUMBER_MOVE_TO_PLAY = 2;

    private int numberMoveToPlay = 2;
    private List<Trump> affectingTrumps;
    private List<Trump> playableTrumps;
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
     * The square on which the player was at the end of the turn before the current one.
     */
    private Square lastSquareOnLastTurn;
    /**
     * To know if this player has won.
     *
     * @see Player#choose()
     *
     * @since 1.0
     */
    private boolean hasWon;
    /**
     * The set of x coordinates in the aim of the player.
     */
    private Set<Integer> aim;
    /**
     * The index of this player in the game.<br/>
     * This index is between 0 and 7, indeed there are between 1 and 8 players in a game.
     *
     * @since 1.0
     */
    private final int index;
    /**
     * The deck of this player.
     */
    private Deck deck;
    private boolean isWinnerInCurrentMatch;
    private int rank;
    /**
     * True if this player can still play (eg still has a move)
     */
    private boolean canPlay;
    /**
     * Store the number of moves done in the current turn.
     */
    private int numberMovesPlayed;

    /**
     * <b>Constructor initiating the name with the given parameter.</b>
     *
     * @param name The name of the player.
     * @param index The index of the player.
     *
     * @see Player#board
     * @see Player#hasWon
     * @see Player#currentSquare
     * @see Player#index
     * @see Player#name
     *
     * @since 1.0
     */
    public Player(String name, int index) {
        this.name = name;
        this.currentSquare = null;
        this.hasWon = false;
        this.index = index;
        this.canPlay = true;
        numberMovesPlayed = 0;
        affectingTrumps = new ArrayList<>();
    }

    /**
     * <b>Returns if this player is winner in the current match.</b>
     *
     * @return If the player is winner in the current match.
     *
     * @see Player#isWinnerInCurrentMatch
     *
     * @since 1.0
     */
    public boolean isWinnerInMatch() {
        return isWinnerInCurrentMatch;
    }

    public void addTrumpToAffecting(Trump toAdd) {
        affectingTrumps.add(toAdd);
    }

    /**
     * <b>Returns the square this player is on.</b>
     *
     * @return The square this player is on.
     *
     * @see Player#currentSquare
     *
     * @since 1.0
     */
    public Square getCurrentSquare() {
        return currentSquare;
    }

    public Square getLastSquare() {
        return lastSquareOnLastTurn;
    }

    /**
     * <b>Make this player a winner with a given rank.</b>
     * <div>
     * This player will be stated as a winner but unable to play.
     * </div>
     *
     * @param rank Rank given to this player in the game.
     *
     * @see Player#hasWon
     * @see Player#isWinnerInCurrentMatch
     * @see Player#rank
     *
     * @since 1.0
     */
    public void wins(int rank) {
        hasWon = true;
        isWinnerInCurrentMatch = true;
        this.rank = rank;
    }

    /**
     * <b>Initialize a game with the given board.</b>
     * <div>
     * The player will be on a current square depending on its index.
     * </div>
     *
     * @param board Board where the game initialized will be played.
     * @param deckCreator To create the deck.
     *
     * @see Player#currentSquare
     * @see Player#index
     * @see Player#isWinnerInCurrentMatch
     * @see Player#rank
     */
    public void initGame(Board board, DeckCreator deckCreator, List<Trump> trumps) {
        currentSquare = board.getSquare(index * BOARD_ARM_WIDTH_AND_MODULO, BOARD_ARM_LENGTH_AND_MAX_Y);
        currentSquare.setAsOccupied();
        deck = deckCreator.create();
        isWinnerInCurrentMatch = false;
        rank = -1;
        aim = aim();
        playableTrumps = trumps;
    }

    /**
     * <b>Returns the goals of this player.</b>
     * <div>
     * Returns the set of X coordinates that can make this player a winner.
     * </div>
     *
     * @return The goals of this player.
     *
     * @see Player#index
     *
     * @since 1.0
     */
    private Set<Integer> aim() {
        int oppositeIndex = index + BOARD_ARM_WIDTH_AND_MODULO * ((index >= BOARD_ARM_WIDTH_AND_MODULO) ? -1 : 1);
        Set<Integer> toReturn = new HashSet<>();
        for (int i = 0; i < BOARD_ARM_WIDTH_AND_MODULO; i++) {
            toReturn.add(BOARD_ARM_WIDTH_AND_MODULO * oppositeIndex + i);
        }
        return toReturn;
    }

    /**
     * Initialize a new turn for this player.
     */
    public void initTurn() {
        lastSquareOnLastTurn = currentSquare;
        numberMovesPlayed = 0;
        canPlay = true;
        deck.initForTurn();
        makeAffectedByTrumps();
    }

    /**
     * Returns true if the active player stayed on the good last line for one turn.
     *
     * @return True if the active player has reached its aim.
     */
    public boolean hasReachedItsAim() {
        return isPlayerOnGoodArm(currentSquare.getX())
                && isPlayerOnLastLine(currentSquare.getY())
                && onLastLineSinceOneTurn();
    }

    /**
     * Returns true if the active player is in the good arm.
     *
     * @param targetedX The X coordinate of the square on which the player wants to move.
     *
     * @return True if the active player is in the good arm.
     */
    private boolean isPlayerOnGoodArm(int targetedX) {
        return aim.contains(targetedX);
    }

    /**
     * Is the active player is on the last line?
     *
     * @param targetedY The Y coordinate of the square on which the player wants to move.
     *
     * @return True if the active player is on the last line.
     */
    private boolean isPlayerOnLastLine(int targetedY) {
        return targetedY == Player.BOARD_ARM_LENGTH_AND_MAX_Y;
    }

    /**
     * Is the active player on the last line for one turn?
     *
     * @param targetedX The X coordinate of the square on which the player wants to move.
     * @param targetedY The Y coordinate of the square on which the player wants to move.
     *
     * @return True if the active player is on the last line for one turn.
     */
    private boolean onLastLineSinceOneTurn() {
        return isPlayerOnGoodArm(lastSquareOnLastTurn.getX()) && isPlayerOnLastLine(lastSquareOnLastTurn.getY());
    }

    /**
     * Play the current move.
     *
     * @param board The game board.
     *
     * @param cardPlayed The MovementsCard the player played.
     *
     * @param targetedX The x coordinate on which he/she will move.
     *
     * @param targetedY The y coordinate on which he/she will move.
     */
    public void play(Board board, MovementsCard cardPlayed, int targetedX, int targetedY) {
        makeAffectedByTrumps();
        playThisTurn(board, cardPlayed, targetedX, targetedY);

        consumeAffectingTrumpsAtEndOfTurn();

        revertToDefault();
    }

    public void makeAffectedByTrumps() {
        affectingTrumps.parallelStream()
                .filter(tc -> tc.isEnabled())
                .forEach(tc -> tc.affect(this));
    }

    public void playThisTurn(Board board, MovementsCard cardPlayed, int targetedX, int targetedY) {
        numberMovesPlayed++;
        deck.playCard(cardPlayed);
        moveTo(board, targetedX, targetedY);
    }

    private void moveTo(Board board, int targetedX, int targetedY) {
        if (board == null) {
            return;
        }

        Square square = board.getSquare(targetedX, targetedY);
        moveTo(square);
    }

    /**
     * <b>Method to move this player to the given square.</b>
     * <div>
     * First, we will empty the square the player is on then replace it by the given square and set
     * this last one occupied.
     * </div>
     *
     * @param square The square to move this player to.
     *
     * @see Square
     * @see Square#empty()
     * @see Square#setAsOccupied()
     *
     * @since 1.0
     */
    public void moveTo(Square square) {
        if (square == null) {
            return;
        }

        if (currentSquare != null) {
            currentSquare.empty();
        }

        currentSquare = square;
        currentSquare.setAsOccupied();
    }

    private void consumeAffectingTrumpsAtEndOfTurn() {
        if (numberMovesPlayed == numberMoveToPlay) {
            consumeAffectingTrumps();
        }
    }

    private void consumeAffectingTrumps() {
        affectingTrumps.parallelStream()
                .forEach(tc -> tc.consume());

        affectingTrumps = affectingTrumps.parallelStream()
                .filter(tc -> tc.getDuration() > 0)
                .collect(Collectors.toList());

        canPlay = false;
    }

    /**
     * Revert all the cards to their default behavior.
     */
    private void revertToDefault() {
        numberMoveToPlay = MAX_NUMBER_MOVE_TO_PLAY;
        deck.revertToDefault();
    }

    /**
     * Play a trump card.
     *
     * @param playedTrump The trump card to play.
     *
     * @param target The targeted player.
     */
    public void playTrump(Trump playedTrump, Player target) {
        playableTrumps.remove(playedTrump);
        target.addTrumpToAffecting(playedTrump);
    }

    /**
     * Play the trump card on this player.
     *
     * @param playedTrump The trump card you want to play.
     */
    public void playTrump(Trump playedTrump) {
        playableTrumps.remove(playedTrump);
        addTrumpToAffecting(playedTrump);
    }

    /**
     * Check whether you can play this trump.
     *
     * @param trump The trump the player wants to play.
     *
     * @return true if the card can be played.
     */
    public boolean canPlayTrump(Trump trump) {
        return playableTrumps.contains(trump);
    }

    /**
     * Check whether you can play this trump.
     *
     * @param trumpName The name of the trump the player wants to play.
     *
     * @return true if the card can be played.
     */
    public boolean canPlayTrump(String trumpName) {
        return playableTrumps.parallelStream()
                .map(trump -> trump.getName())
                .collect(Collectors.toList())
                .contains(trumpName);
    }

    public void addTrumpToPlayable(Trump playableTrump) {
        playableTrumps.add(playableTrump);
    }

    public void addToNumberMoveToPlay(int numberToAdd) {
        numberMoveToPlay += numberToAdd;
    }

    /**
     * Pass this turn.
     */
    public void pass() {
        canPlay = false;
        consumeAffectingTrumps();
    }

    /**
     * Discard a card.
     *
     * @param card Card to discard.
     */
    public void discard(MovementsCard card) {
        play(null, card, -1, -1);
    }

    /**
     * <b>Returns if this player can play or not.</b>
     *
     * @return If this player can play or not.
     *
     * @see Player#canPlay
     *
     * @since 1.0
     */
    public boolean canPlay() {
        return canPlay;
    }

    public void canPlay(boolean canPlay) {
        this.canPlay = canPlay;
    }

    /**
     * Returns if this play has won or not.
     *
     * @see Player#hasWon
     *
     * @return if this play has won or not.
     */
    public boolean hasWon() {
        return hasWon;
    }

    /**
     * <b>Returns the index of this player in its current game.</b>
     *
     * @return The index of this player in its current game.
     *
     * @see Player#index
     *
     * @since 1.0
     */
    public int getIndex() {
        return index;
    }

    public Deck getDeck() {
        return deck;
    }

    public List<Map<String, String>> getHandForJsonExport() {
        return deck.getHandForJsonExport();
    }

    public List<JsonTrump> getTrumpsForJsonExport() {
        return playableTrumps.parallelStream()
                .map(trump -> {
                    JsonTrump jsonTrump = new JsonTrump();
                    jsonTrump.setName(trump.getName());
                    jsonTrump.setDescription(trump.getDescription());
                    jsonTrump.setMusteTargetPlayer(trump.mustTargetPlayer());
                    return jsonTrump;
                })
                .collect(Collectors.toList());
    }

    public List<String> getActiveTrumpNames() {
        return affectingTrumps.parallelStream()
                .map(trump -> trump.getName())
                .collect(Collectors.toList());
    }

    public String getName() {
        return name;
    }

    public int getRank() {
        return rank;
    }

    public Set<Integer> getAim() {
        return aim;
    }

    /**
     * Get a trump by its name. You must check that this name is valid.
     *
     * @see Player#canPlayTrump(java.lang.String)
     *
     * @param trumpName The name of the trump to get.
     *
     * @return the wanted trump.
     */
    public Trump getTrumpByName(String trumpName) {
        return playableTrumps.parallelStream()
                .filter(trump -> trumpName.equals(trump.getName()))
                .findFirst()
                .get();
    }

    /**
     * <b>Returns if a player is the same as this one.</b>
     * <div>
     * Returns true if the player in parameter as the same name as this player.
     * </div>
     *
     * @param player Player to compare with.
     *
     * @return If the parameter and this player are the same.
     *
     * @see #name
     *
     * @since 1.0
     */
    @Override
    public boolean equals(Object player) {
        return player != null
                && player.getClass() == Player.class
                && name.equals(((Player) player).name);
    }

    @Override
    public int hashCode() {
        int hash = HASH_BEGIN;
        int hashMultiplier = HASH_MULTIPLIER;
        hash = hashMultiplier * hash + Objects.hashCode(this.name);
        hash = hashMultiplier * hash + Objects.hashCode(this.currentSquare);
        hash = hashMultiplier * hash + (this.hasWon ? 1 : 0);
        hash = hashMultiplier * hash + this.index;
        return hash;
    }

}
