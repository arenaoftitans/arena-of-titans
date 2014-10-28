package com.derniereligne.engine;

import com.derniereligne.engine.board.Square;
import com.derniereligne.engine.cards.Card;
import com.derniereligne.engine.board.Board;
import java.util.Set;

public class Player {
    private final String name;
    private Board board;
    private Square currentSquare;
    //For turn by turn
    private boolean canPlay;
    private int index;
    

    public Player(String name, Board board, Square currentSquare, int index) {
        this.name = name;
        this.board = board;
        this.currentSquare = currentSquare;
        this.canPlay = (index == 0);
        this.index = index;
    }

    public void play(Card card) {
        Set<Square> possibleMovements = card.getPossibleMovements(currentSquare);
        System.out.println("Size: " + possibleMovements.size());
        System.out.println(possibleMovements.toString());
    }

    public void moveTo(Square square) {
        currentSquare.empty();
        currentSquare = square;
        currentSquare.setAsOccupied();
    }

    private void choose() {
        canPlay=true;
    }
    
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
