/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dernierelignegameengine;

/**
 * Class to test the turn by turn system
 * 
 * @author gaussreload
 */
public class TurnPlayer {
    private String name;
    private boolean canPlay;
    private int index;
    
    public TurnPlayer(String name, int index) {
        this.name = name;
        this.canPlay = (index == 0);
        this.index = index;
    }
    
    private void choose() {
        canPlay=true;
    }
    
    public void play(TurnPlayer[] players) {
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
                System.out.println("Choosing : " + testingIndex + "and index is " + index);
                players[testingIndex].choose();
            }
            
        }
    }
    
}
