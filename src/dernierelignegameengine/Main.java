/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dernierelignegameengine;
import java.util.Scanner;
/**
 *
 * @author gaussreload
 */
public class Main {
    public static void main(String[] Args) {
        Player[] players = new Player[8];
        for (int i=0; i <8; i++)
            players[i] = new Player("Joueur " + i, null, null, i);
        
        //players[0] = new Player("Joueur " + 0, null, null, 0);
        
        players[0].playTurn(players);
        players[0].playTurn(players);
        players[2].playTurn(players);
        players[1].playTurn(players);
        
        //partie à 1 joueur
        
        Board plateau = new Board("standard_board");
        Square currentSquare = plateau.getSquare(0, 8);
        currentSquare.setAsOccupied();
        boolean isOver=false;
        boolean isPossible;
        boolean isEmpty;
        Card chosenCard;
        char carte;
        char couleur;
        int x;
        int y;
       	
	Scanner sc=new Scanner(System.in);
            while (isOver==false){
                isPossible=false;
                isEmpty=true;           
                chosenCard=null;
                x=32;
                y=9;
                while(isEmpty){
                    carte=' ';
                    couleur=' ';
                    while(carte != 'K' && carte != 'Q' && carte != 'A' && carte != 'B' && carte != 'W' && carte != 'M' && carte != 'R'){
                        System.out.println("Quelle carte voulez-vous jouer? (roi: K, reine: Q, assassin: A, fou: B, guerrier: W, magicien: M, cavalier: R)");
                        carte = sc.nextLine().charAt(0);                    
                    }
                    while(couleur != 'R' && couleur != 'B' && couleur != 'N' && couleur != 'J'){
                        System.out.println("Quelle couleur choisissez-vous pour votre carte? (rouge: R, bleu: B, noir: N, jaune: J)");
                        couleur = sc.nextLine().charAt(0);
                    }    
                    if(carte=='K'){
                        if(couleur=='N'){chosenCard = new KingCard(plateau,Color.BLACK);}
                        if(couleur=='R'){chosenCard = new KingCard(plateau,Color.RED);}
                        if(couleur=='B'){chosenCard = new KingCard(plateau,Color.BLUE);}     
                        else{chosenCard = new KingCard(plateau,Color.YELLOW);}
                    }
                    if(carte=='Q'){
                        if(couleur=='N'){chosenCard = new QueenCard(plateau,Color.BLACK);}
                        if(couleur=='R'){chosenCard = new QueenCard(plateau,Color.RED);}
                        if(couleur=='B'){chosenCard = new QueenCard(plateau,Color.BLUE);}     
                        else{chosenCard = new QueenCard(plateau,Color.YELLOW);}
                    }
                    if(carte=='A'){
                        if(couleur=='N'){chosenCard = new AssassinCard(plateau,Color.BLACK);}
                        if(couleur=='R'){chosenCard = new AssassinCard(plateau,Color.RED);}
                        if(couleur=='B'){chosenCard = new AssassinCard(plateau,Color.BLUE);}     
                        else{chosenCard = new AssassinCard(plateau,Color.YELLOW);}
                    }
                    if(carte=='B'){
                        if(couleur=='N'){chosenCard = new BishopCard(plateau,Color.BLACK);}
                        if(couleur=='R'){chosenCard = new BishopCard(plateau,Color.RED);}
                        if(couleur=='B'){chosenCard = new BishopCard(plateau,Color.BLUE);}     
                        else{chosenCard = new BishopCard(plateau,Color.YELLOW);}
                    }
                    if(carte=='W'){
                        if(couleur=='N'){chosenCard = new WarriorCard(plateau,Color.BLACK);}
                        if(couleur=='R'){chosenCard = new WarriorCard(plateau,Color.RED);}
                        if(couleur=='B'){chosenCard = new WarriorCard(plateau,Color.BLUE);}     
                        else{chosenCard = new WarriorCard(plateau,Color.YELLOW);}
                    }
                    if(carte=='M'){
                        if(couleur=='N'){chosenCard = new WizardCard(plateau,Color.BLACK);}
                        if(couleur=='R'){chosenCard = new WizardCard(plateau,Color.RED);}
                        if(couleur=='B'){chosenCard = new WizardCard(plateau,Color.BLUE);}     
                        else{chosenCard = new WizardCard(plateau,Color.YELLOW);}
                    }
                    if(carte=='R'){
                        if(couleur=='N'){chosenCard = new RiderCard(plateau,Color.BLACK);}
                        if(couleur=='R'){chosenCard = new RiderCard(plateau,Color.RED);}
                        if(couleur=='B'){chosenCard = new RiderCard(plateau,Color.BLUE);}     
                        else{chosenCard = new RiderCard(plateau,Color.YELLOW);}
                    }
                    if(chosenCard.getPossibleMovements(currentSquare).isEmpty()){
                        System.out.println("Pas de mouvements possibles. Rechoisissez.");
                    }
                    else{
                        isEmpty=false;
                    }
                }
                System.out.println("Vous pouvez aller sur les cases suivantes :");
                System.out.println(chosenCard.getPossibleMovements(currentSquare));
                while(isPossible==false){
                    System.out.println("Rentrez les coordonnées de la case où vous voulez aller.");
                    while(x>31){
                        System.out.println("x:");
                        x=sc.nextInt();
                    }                    
                    while(y>8){
                        System.out.println("y:");
                        y=sc.nextInt();
                    }
                    if (chosenCard.getPossibleMovements(currentSquare).contains(plateau.getSquare(x, y))){
                        isPossible=true;
                        currentSquare=plateau.getSquare(x, y);
                        currentSquare.setAsOccupied();
                    }
                }
                if(y==0){
                    isOver=true;
                }
                else{
                    System.out.println("Vous êtes maintenant sur la case:");
                    System.out.println(currentSquare);
                }
            }
            System.out.println("Partie finie !");
                        
             
            
                
                    
        
    }
}
