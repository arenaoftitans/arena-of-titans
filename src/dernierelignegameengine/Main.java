/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dernierelignegameengine;

/**
 *
 * @author gaussreload
 */
public class Main {
    public static void main(String[] Args) {
        Player[] players = new Player[8];
        //for (int i=0; i <8; i++)
            //players[i] = new TurnPlayer("Joueur " + i, i);
        
        players[0] = new Player("Joueur " + 0, null, null, 0);
        
        players[0].play(players);
        
    }
}
