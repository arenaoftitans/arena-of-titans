
package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import static com.derniereligne.engine.cards.CardTest.cardColor;
import org.junit.Test;

public class KingCardTest extends CardTest {

    @Test
    public void testGetPossibleMovementsOnCircle() {
        setCurrentSquare(2, 1);

        expResult.add(new Square(3, 1, cardColor));
        expResult.add(new Square(4, 1, cardColor));
        expResult.add(new Square(5, 1, cardColor));
        expResult.add(new Square(2, 2, cardColor));

        test();
    }

    @Test
    public void testGetPossibleMovementsNoDiagonal() {
        setCurrentSquare(0, 8);
        currentSquare.empty();

        expResult.add(new Square(0, 7, cardColor));
        expResult.add(new Square(0, 8, cardColor)); // This square is empty, so we can move there.

        test();
    }

    @Override
    public void initCard() {
        cardColor = Color.RED;
        instance = new KingCard(board, cardColor);
    }

}
