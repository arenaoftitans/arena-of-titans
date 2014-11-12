package com.derniereligne.engine.cards;

import com.derniereligne.engine.Color;
import com.derniereligne.engine.board.Square;
import static com.derniereligne.engine.cards.CardTest.instance;
import org.junit.Test;

public class WizardCardTest extends CardTest {

    @Test
    public void getPossibleMovementsLeftEdgeFromBottom() {
        setCurrentSquare(0, 8);
        expResult.add(new Square(0, 7, Color.RED));
        expResult.add(new Square(1, 7, Color.BLUE));
        expResult.add(new Square(1, 8, Color.BLUE));

        test();
    }

    @Override
    public void initCard() {
        cardColor = Color.RED;
        instance = new WizardCard(board, cardColor);
    }

}
