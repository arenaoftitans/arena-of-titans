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
        /*Player[] players = new Player[8];
        for (int i=0; i <8; i++)
            players[i] = new Player("Joueur " + i, null, null, i);

        //players[0] = new Player("Joueur " + 0, null, null, 0);

        players[0].playTurn(players);
        players[0].playTurn(players);
        players[2].playTurn(players);
        players[1].playTurn(players);*/
        gameForOnePlayer();

    }
    public static void gameForOnePlayer(){
        Board board = new Board("standard_board");
        Square currentSquare = board.getSquare(0, 8);
        currentSquare.setAsOccupied();
        boolean isOver=false;
        boolean isPossible;
        boolean isEmpty;
        Card chosenCard;
        char card;
        char color;
        int x;
        int y=9;

        Scanner sc=new Scanner(System.in);
            while (isOver==false){
                isPossible=false;
                isEmpty=true;
                chosenCard=null;
                while(isEmpty){
                    card=' ';
                    color=' ';
                    while(wrongTypeCard(card)){
                        System.out.println("Quelle carte voulez-vous jouer?\nroi: K\nreine: Q\nassassin: A\nfou: B\nguerrier: W\nmagicien: M\ncavalier: R");
                        card = sc.nextLine().charAt(0);
                    }
                    while(wrongTypeColor(color)){
                        System.out.println("Quelle couleur choisissez-vous pour votre carte?\nrouge: R\nbleu: B\nnoir: N\njaune: J");
                        color = sc.nextLine().charAt(0);
                    }
                    chosenCard=getChosenCard(card, color, board);
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
                    x=32;
                    y=9;
                    System.out.println("Rentrez les coordonnées de la case où vous voulez aller.");
                    while(x>31){
                        System.out.println("x:");
                        x=sc.nextInt();
                    }
                    while(y>8){
                        System.out.println("y:");
                        y=sc.nextInt();
                    }
                    sc.nextLine();
                    if (chosenCard.getPossibleMovements(currentSquare).contains(board.getSquare(x, y))){
                        isPossible=true;
                        currentSquare.empty();
                        currentSquare=board.getSquare(x, y);
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
        };
    public static boolean wrongTypeCard(char card){
        return card != 'K' && card != 'Q' && card != 'A' && card != 'B' && card != 'W' && card != 'M' && card != 'R';
    }

    public static boolean wrongTypeColor(char color){
        return color != 'R' && color != 'B' && color != 'N' && color != 'J';
    }

    public static Card getChosenCard(char card, char color, Board board){
        if(card=='K'){
            return getColoredKingCard(color, board);
        }
        else if(card=='Q'){
            return getColoredQueenCard(color, board);
        }
        else if(card=='A'){
            return getColoredAssassinCard(color, board);
        }
        else if(card=='B'){
            return getColoredBishopCard(color, board);
        }
        else if(card=='W'){
            return getColoredWarriorCard(color, board);
        }
        else if(card=='M'){
            return getColoredWizardCard(color, board);
        }
        else{
            return getColoredRiderCard(color, board);
        }
    }

    public static Card getColoredKingCard(char color, Board board){
        Card chosenCard;
        if(color=='N'){chosenCard = new KingCard(board,Color.BLACK);}
        else if(color=='R'){chosenCard = new KingCard(board,Color.RED);}
        else if(color=='B'){chosenCard = new KingCard(board,Color.BLUE);}
        else{chosenCard = new KingCard(board,Color.YELLOW);}
        return chosenCard;
    }

    public static Card getColoredQueenCard(char color, Board board){
        Card chosenCard;
        if(color=='N'){chosenCard = new QueenCard(board,Color.BLACK);}
        else if(color=='R'){chosenCard = new QueenCard(board,Color.RED);}
        else if(color=='B'){chosenCard = new QueenCard(board,Color.BLUE);}
        else{chosenCard = new QueenCard(board,Color.YELLOW);}
        return chosenCard;
    }

    public static Card getColoredAssassinCard(char color, Board board){
        Card chosenCard;
        if(color=='N'){chosenCard = new AssassinCard(board,Color.BLACK);}
        else if(color=='R'){chosenCard = new AssassinCard(board,Color.RED);}
        else if(color=='B'){chosenCard = new AssassinCard(board,Color.BLUE);}
        else{chosenCard = new AssassinCard(board,Color.YELLOW);}
        return chosenCard;
    }

    public static Card getColoredBishopCard(char color, Board board){
        Card chosenCard;
        if(color=='N'){chosenCard = new BishopCard(board,Color.BLACK);}
        else if(color=='R'){chosenCard = new BishopCard(board,Color.RED);}
        else if(color=='B'){chosenCard = new BishopCard(board,Color.BLUE);}
        else{chosenCard = new BishopCard(board,Color.YELLOW);}
        return chosenCard;
    }

    public static Card getColoredWarriorCard(char color, Board board){
        Card chosenCard;
        if(color=='N'){chosenCard = new WarriorCard(board,Color.BLACK);}
        else if(color=='R'){chosenCard = new WarriorCard(board,Color.RED);}
        else if(color=='B'){chosenCard = new WarriorCard(board,Color.BLUE);}
        else{chosenCard = new WarriorCard(board,Color.YELLOW);}
        return chosenCard;
    }

    public static Card getColoredWizardCard(char color, Board board){
        Card chosenCard;
        if(color=='N'){chosenCard = new WizardCard(board,Color.BLACK);}
        else if(color=='R'){chosenCard = new WizardCard(board,Color.RED);}
        else if(color=='B'){chosenCard = new WizardCard(board,Color.BLUE);}
        else{chosenCard = new WizardCard(board,Color.YELLOW);}
        return chosenCard;
    }

    public static Card getColoredRiderCard(char color, Board board){
        Card chosenCard;
        if(color=='N'){chosenCard = new RiderCard(board,Color.BLACK);}
        else if(color=='R'){chosenCard = new RiderCard(board,Color.RED);}
        else if(color=='B'){chosenCard = new RiderCard(board,Color.BLUE);}
        else{chosenCard = new RiderCard(board,Color.YELLOW);}
        return chosenCard;
    }


}
