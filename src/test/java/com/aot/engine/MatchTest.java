package com.aot.engine;

import com.aot.engine.board.Board;
import com.aot.engine.board.Square;
import com.aot.engine.cards.Deck;
import com.aot.engine.cards.movements.LineAndDiagonalMovementsCard;
import com.aot.engine.cards.movements.MovementsCard;
import com.aot.engine.cards.movements.functionnal.ProbableSquaresGetter;
import com.aot.engine.trumps.ModifyNumberOfMovesInATurnTrump;
import com.aot.engine.trumps.RemovingColorTrump;
import com.aot.engine.trumps.Trump;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.junit.After;
import org.junit.Assert;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

public class MatchTest {

    private Match match;

    private Board board;
    private final int defaultX = 0;
    private final int defaultY = 0;
    private Player player1;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Before
    public void setUp() {
        GameFactory gf = new GameFactory();
        board = gf.getBoard();
        Player[] players = new Player[8];
        for (int i = 0; i < 8; i++) {
            players[i] = new Player("player " + i, i);
        }
        List<Trump> trumpList = new ArrayList<>();
        Color[] colors = {Color.RED};
        trumpList.add(new RemovingColorTrump("my trump", 10, "test", 101, true, colors));
        match = new Match(players, board, gf.getDeckCreator(), trumpList);
        player1 = match.getPlayers().get(0);
    }

    @After
    public void tearDown() {
        match = null;
    }

    @Test
    public void testPlayTurnIfOnlyOnePlayer() {
        for (int i = 1; i <= 7; i++) {
            match.getPlayers().set(i, null);
        }
        assertEquals(match.playCard(defaultX, defaultY, null), null);
    }

    @Test
    public void testPlayTurnForWinningPlayer() {
        match.playCard(16, 8, null);
        assertFalse(match.getPlayers().get(0).hasWon());

        // Still in the same Turn
        match.playCard(16, 8, null);
        assertFalse(match.getPlayers().get(0).hasWon());

        // Play the others players
        for (int i = 0; i <= 7; i++) {
            match.playCard(0, i, null);
            match.playCard(i, 0, null);
        }

        Player winner = match.getPlayers().get(0);
        // The winner cannot be an active player
        assertNotEquals(match.getActivePlayer(), winner);
        assertFalse(match.getGameOver());
        assertTrue(winner.hasWon());
        assertEquals(1, winner.getRank());
    }

    @Test
    public void testPlayTurnForWinningPlayerPassSecondMove() {
        match.playCard(16, 8, null);
        assertFalse(match.getPlayers().get(0).hasWon());

        // Still in the same Turn
        match.passThisTurn();
        assertFalse(match.getPlayers().get(0).hasWon());

        // Play the others players
        for (int i = 0; i <= 7; i++) {
            match.playCard(0, i, null);
            match.playCard(i, 0, null);
        }

        Player winner = match.getPlayers().get(0);
        // The winner cannot be an active player
        assertNotEquals(match.getActivePlayer(), winner);
        assertTrue(winner.hasWon());
        assertEquals(1, winner.getRank());
    }

    @Test
    public void testPlayTurnForWinningPlayerMoveDifferentSquareSecondMove() {
        match.playCard(16, 8, null);
        assertFalse(match.getPlayers().get(0).hasWon());

        // Still in the same Turn
        match.playCard(17, 8, null);
        assertFalse(match.getPlayers().get(0).hasWon());

        // Play the others players
        for (int i = 0; i <= 7; i++) {
            match.playCard(0, i, null);
            match.playCard(i, 0, null);
        }

        Player winner = match.getPlayers().get(0);
        // The winner cannot be an active player
        assertNotEquals(match.getActivePlayer(), winner);
        assertTrue(winner.hasWon());
        assertEquals(1, winner.getRank());
    }

    @Test
    public void testPlayTurnForPlayerMovingBeforeWinning() {
        match.playCard(17, 8, null);

        assertFalse(match.getPlayers().get(0).isWinnerInMatch());
    }

    @Test
    public void testPlayTurnForEndOfGame() {
        for (int i = 2; i <= 7; i++) {
            match.getPlayers().set(i, null);
        }

        // We play player 1.
        match.playCard(16, 8, null);
        match.playCard(16, 8, null);

        // We play player 2 so it is back at player 1, who wins. The match ends.
        match.playCard(0, 0, null);
        match.playCard(0, 0, null);

        assertEquals(null, match.playCard(16, 8, null));
        assertTrue(match.getPlayers().get(0).hasWon());
        assertTrue(match.getGameOver());
    }

    @Test
    public void testTwoPlayersWonAtTheSameTime() {
        for (int i = 2; i <= 7; i++) {
            match.getPlayers().set(i, null);
        }

        // We play player 1.
        match.playCard(16, 8, null);
        match.playCard(16, 8, null);

        // We play player 2.
        match.playCard(20, 8, null);
        match.playCard(20, 8, null);

        assertTrue(match.getGameOver());
    }

    @Test
    public void testPlayTurnFirstPlayerPlayingInFullGame() {
        match.playCard(defaultX, defaultY, null);
        assertEquals(match.playCard(defaultX, defaultY, null), match.getPlayers().get(1));
    }

    @Test
    public void testPlayTurnForLastPlayerInFullGame() {
        // Players play twice !
        for (int i = 0; i <= 14; i++) {
            match.playCard(defaultX, defaultY, null);
        }

        assertEquals(match.playCard(defaultX, defaultY, null), match.getPlayers().get(0));
    }

    @Test
    public void testPlayTurnForFirstPlayerInPartialGame() {
        match.getPlayers().set(1, null);
        match.playCard(defaultX, defaultY, null);

        assertEquals(match.playCard(defaultX, defaultY, null), match.getPlayers().get(2));
    }

    @Test
    public void testPlayTurnForLastPlayerInPartialGame() {
        for (int i = 0; i <= 6; i++) {
            match.playCard(defaultX, defaultY, null);
        }
        for (int i = 0; i <= 5; i++) {
            match.getPlayers().set(i, null);
        }
        assertEquals(match.playCard(defaultX, defaultY, null), match.getPlayers().get(6));
    }

    @Test
    public void testGetPossibleMovementsFirstMoveFirstPlayer() {
        MovementsCard card = new LineAndDiagonalMovementsCard(board, null, 2, Color.RED);
        Set<String> possibleMovements = card.getPossibleMovements(match.getActivePlayerCurrentSquare());
        Set<String> expResult = new HashSet<>();
        expResult.add("square-0-7");
        expResult.add("square-1-6");

        assertEquals(expResult, possibleMovements);
    }

    @Test
    public void testPassThisTurn() {
        Player currentPlayer = match.getActivePlayer();
        match.passThisTurn();
        assertNotEquals(match.getActivePlayer(), currentPlayer);
    }

    @Test
    public void testDiscard() {
        Player currentPlayer = match.getActivePlayer();
        Deck deck = currentPlayer.getDeck();
        MovementsCard card = deck.getFirstCardInHand();
        match.discard(card);
        assertTrue(currentPlayer.canPlay());
        assertFalse(deck.isCardInHand(card));
    }

    @Test
    public void testPlayTrump() {
        Player player1 = match.getPlayers().get(0);
        Player player2 = match.getPlayers().get(1);
        Player player3 = match.getPlayers().get(2);

        Trump trump = new ModifyNumberOfMovesInATurnTrump(null, 1, null, 0, false, 2);
        player1.addTrumpToPlayable(trump);

        assertEquals(match.getActivePlayer(), player1);
        match.playCard(0, 0, null);
        assertEquals(match.getActivePlayer(), player1);
        match.playTrump(trump, player2.getIndex());
        match.playCard(0, 0, null);
        assertEquals(match.getActivePlayer(), player2);
        match.playCard(0, 0, null);
        assertEquals(match.getActivePlayer(), player2);
        match.playCard(0, 0, null);
        assertEquals(match.getActivePlayer(), player2);
        match.playCard(0, 0, null);
        assertEquals(match.getActivePlayer(), player2);
        match.playCard(0, 0, null);
        assertEquals(match.getActivePlayer(), player3);
        match.playCard(0, 0, null);
        assertEquals(match.getActivePlayer(), player3);
    }

    @Test
    public void testTrumpWhenPass() {
        Player player1 = match.getPlayers().get(0);

        Trump trump = new ModifyNumberOfMovesInATurnTrump(null, 1, null, 0, false, 2);
        assertTrue(player1.getActiveTrumpNames().isEmpty());
        match.playTrump(trump, null);

        assertTrue(player1.getActiveTrumpNames().contains(trump.getName()));
        player1.pass();
        assertEquals(0, trump.getDuration());
        assertTrue(player1.getActiveTrumpNames().isEmpty());
    }

    @Test
    public void testTrumpOnDrawnCards() {
        applyAllPossibleRemovingColorTrumpsOnPlayer1();
        assertEquals(4, player1.getActiveTrumpNames().size());

        playFirstCard();
        playFirstCard();

        assertNotEquals(match.getActivePlayer(), player1);
        passAllPlayersExceptPlayer1();
        assertEquals(match.getActivePlayer(), player1);

        // Test first card (already there on previous turn)
        MovementsCard card = player1.getDeck().getFirstCardInHand();
        assertTrue(card.getSquarePossibleColors().isEmpty());
        // Test last card (just drawn).
        card = player1.getDeck().getLastCardInHand();
        assertTrue(card.getSquarePossibleColors().isEmpty());
    }

    private void applyAllPossibleRemovingColorTrumpsOnPlayer1() {
        for (Color color : Color.values()) {
            if (color != Color.ALL) {
                RemovingColorTrump trump = new RemovingColorTrump("remove" + color, 2, null, 1, true, color);
                player1.playTrump(trump);
            }
        }
    }

    private void playFirstCard() {
        MovementsCard card = player1.getDeck().getFirstCardInHand();
        match.playCard(0, 0, card);
    }

    private void passAllPlayersExceptPlayer1() {
        for (int i = 1; i < 8; i++) {
            match.passThisTurn();
        }
    }

    @Test
    public void testTrumpWhenDiscardingACard() {
        applyAllPossibleRemovingColorTrumpsOnPlayer1();
        MovementsCard card = player1.getDeck().getFirstCardInHand();
        match.discard(card);
        assertFalse(card.getSquarePossibleColors().isEmpty());
        card = player1.getDeck().getFirstCardInHand();
        assertTrue(card.getSquarePossibleColors().isEmpty());
    }

    @Test
    public void testTrumpMustNotBePermanantOnCardsInHand() {
        applyAllPossibleRemovingColorTrumpsOnPlayer1();
        match.passThisTurn();
        passAllPlayersExceptPlayer1();
        match.passThisTurn();
        passAllPlayersExceptPlayer1();
        match.passThisTurn();
        MovementsCard card = player1.getDeck().getFirstCardInHand();
        card.revertToDefault();
        assertFalse(card.getSquarePossibleColors().isEmpty());
    }

    @Test
    public void testToJsonStandardType() {
        // Test that each standard field are correctly serialized.
        Gson gson = new Gson();
        JsonObject jsonMatch = getMatchAsJsonObject();

        // gameOver
        JsonElement jGameOver = jsonMatch.get("gameOver");
        Boolean gameOver = gson.fromJson(jGameOver, Boolean.class);
        assertEquals(match.getGameOver(), gameOver);

        // board
        JsonElement jBoard = jsonMatch.get("board");
        Board board = gson.fromJson(jBoard, Board.class);
        assertEquals(match.getBoardCopy(), board);

        // nextRankAvailable
        JsonElement jNextRank = jsonMatch.get("nextRankAvailable");
        Integer nextRank = gson.fromJson(jNextRank, Integer.class);
        assertEquals(match.getNextRankAvailable(), nextRank);
    }

    private JsonObject getMatchAsJsonObject() {
        String matchJson = match.toJson();
        match.resetAfterJsonImport();
        return new JsonParser().parse(matchJson).getAsJsonObject();
    }

    @Test
    public void testToJsonPlayerStandardField() {
        // Test only some fields
        Assert.assertNotNull(match.getActivePlayer());
        Gson gson = new Gson();
        JsonObject jPlayer = getActivePlayerAsJsonObject();

        // name
        JsonElement jName = jPlayer.get("name");
        String name = gson.fromJson(jName, String.class);
        assertEquals(match.getActivePlayerName(), name);

        // canPlay
        JsonElement jCanPlay = jPlayer.get("canPlay");
        Boolean canPlay = gson.fromJson(jCanPlay, Boolean.class);
        assertEquals(match.getActivePlayer().canPlay(), canPlay);

        // aim
        JsonElement jAim = jPlayer.get("aim");
        Type aimType = new TypeToken<Set<Integer>>() {}.getType();
        Set<Integer> aim = gson.fromJson(jAim, aimType);
        assertEquals(match.getActivePlayer().getAim(), aim);
    }

    private JsonObject getActivePlayerAsJsonObject() {
        return getMatchAsJsonObject().get("activePlayer").getAsJsonObject();
    }

    @Test
    public void testToJsonPlayerTrumps() {
        JsonObject jPlayer = getFirstPlayer();
        JsonArray jPlayableTrumps = jPlayer.get("playableTrumps").getAsJsonArray();
        assertEquals(match.getActivePlayer().getTrumpsForJsonExport().size(), jPlayableTrumps.size());

        JsonObject jTrump = jPlayableTrumps.get(0).getAsJsonObject();

        // java type
        assertTrue(jTrump.has("java_type"));
        assertNotEquals(Trump.class.toString(), jTrump.get("java_type").getAsString());

        // Name
        String name = jTrump.get("name").getAsString();
        assertEquals(match.getActivePlayer().getTrumpsForJsonExport().get(0).getName(), name);

        // Special fields
        assertTrue(jTrump.has("removedColors"));
        JsonArray colors = jTrump.get("removedColors").getAsJsonArray();
        assertEquals(1, colors.size());
    }

    private JsonObject getFirstPlayer() {
        return getMatchAsJsonObject().get("players").getAsJsonArray().get(0).getAsJsonObject();
    }

    @Test
    public void testToJsonPlayerDeck() {
        Gson gson = new Gson();
        // We only test the hand. The rest works exactly the same.
        JsonObject jDeck = getActivePlayerDeckAsJsonObject();
        JsonArray jHand = jDeck.get("hand").getAsJsonArray();

        // Number of cards.
        List<Map<String, String>> hand = match.getActivePlayer().getHandForJsonExport();
        assertEquals(hand.size(), jHand.size());

        MovementsCard card = match.getActivePlayer().getDeck().getFirstCardInHand();
        JsonObject jCard = jHand.get(0).getAsJsonObject();

        // javaType
        assertTrue(jCard.has("java_type"));
        assertNotEquals(MovementsCard.class.toString(), jCard.get("java_type").getAsString());

        // name
        String name = jCard.get("name").getAsString();
        assertEquals(card.getName(), name);

        // possibleSquaresColor
        Type possibleSquaresColorType = new TypeToken<Set<Color>>() {}.getType();
        Set<Color> possibleSquaresColor = gson.fromJson(jCard.get("defaultPossibleSquaresColor"),
                possibleSquaresColorType);
        assertEquals(card.getSquarePossibleColors(), possibleSquaresColor);

        // board
        Board board = gson.fromJson(jCard.get("board"), Board.class);
        assertNull(board);

        // Lambdas
        ProbableSquaresGetter probableSquaresGetter = gson.fromJson(jCard.get("probableSquaresGetter"),
                ProbableSquaresGetter.class);
        assertNull(probableSquaresGetter);

        ProbableSquaresGetter lineProbableSquaresGetter = gson.fromJson(jCard.get("lineProbableSquaresGetter"),
                ProbableSquaresGetter.class);
        assertNull(lineProbableSquaresGetter);

        ProbableSquaresGetter diagonalProbableSquaresGetter = gson.fromJson(jCard.get("diagonalProbableSquaresGetter"),
                ProbableSquaresGetter.class);
        assertNull(diagonalProbableSquaresGetter);

        ProbableSquaresGetter lineAndDiagonalProbableSquaresGetter = gson.fromJson(jCard.get("lineAndDiagonalProbableSquaresGetter"),
                ProbableSquaresGetter.class);
        assertNull(lineAndDiagonalProbableSquaresGetter);
    }

    private JsonObject getActivePlayerDeckAsJsonObject() {
        return getActivePlayerAsJsonObject().get("deck").getAsJsonObject();
    }

    @Test
    public void testFromJson() {
        // Only Movements cards and trumps must be manually tested.
        String jMatch = match.toJson();
        Match matchFromJson = Match.fromJson(jMatch);
        assertEquals(match, matchFromJson);

        // Trumps
        List<Trump> playableTrumps = match.getActivePlayer().getPlayableTrumpsCopy();
        List<Trump> playableTrumpsFromJson = matchFromJson.getActivePlayer().getPlayableTrumpsCopy();
        assertEquals(playableTrumps, playableTrumpsFromJson);

        // Deck
        Deck deck = match.getActivePlayerDeck();
        Deck deckFromJson = matchFromJson.getActivePlayerDeck();
        assertEquals(deck, deckFromJson);

        // Card : board and lambdas not null
        MovementsCard cardFromJson = matchFromJson.getActivePlayerDeck().getFirstCardInHand();
        Board boardCardFromJson = cardFromJson.getBoardCopy();
        assertEquals(board, boardCardFromJson);
        assertTrue(cardFromJson.lambdasAllNonNull());

        // currentSquare
        Square currentSquareFromJson = matchFromJson.getActivePlayerCurrentSquare();
        assertTrue(matchFromJson.isSquareInBoard(currentSquareFromJson));
    }

}
