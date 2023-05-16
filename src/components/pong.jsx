import React, { Component } from 'react';
import { useRef } from 'react';

const Pong = (props) => {

    let player,playerStyles,playerWidth,playerX,playerY,playerHeight,ball,
        ballStyles,ballX,ballY,ballWidth, ballHeight,game,gameStyles,gameWidth,gameHeight
        ,computer,computerStyles,computerX,computerY,computerWidth,computerHeight,
        Xmovement,Ymovement,clearComputer,clearBall;

    // these declarations are to make the vars global because if you define them
    // inside useeffect you won't be able to use them outside of it because useeffect
    // is a function
    const [score,setScore] = React.useState({"player":0 , "computer":0})

    const [playerPosition , setPlayerPosition] = React.useState(50);

    const [computerPosition , setComputerPosition] = React.useState(50);

    const [ballPosition , setBallPosition] = React.useState({x: playerX + playerWidth , y : playerY + playerHeight/2});

    const [gameRunning ,setGameRunning] = React.useState(false)
    const gameRunningRef = useRef();
    gameRunningRef.current = gameRunning;
    // make a refrence to gameRunning to use instead of gameRunning when gameRunning
    //doesn't return the current value (which happens sometimes in functions idk why)

    const [botSpeed , setBotSpeed] = React.useState(1);

    const [ballSpeed , setBallSpeed] = React.useState(1);

    let x = ballPosition.x;

    let y = ballPosition.y;

    function resetScore(){
        setScore({"player":0,"computer":0})
    }

    function increase(event){
        let {id} = event.target.parentElement;
        if(id === "AI"){
            if(botSpeed < 10){
            setBotSpeed(prev => prev + 1)
        }else{
            setBotSpeed(1)
        }}else{
            if(ballSpeed < 5){
                setBallSpeed(prev => prev + 1)
            }else{
                setBallSpeed(1)
            }
        }
        
    }

    function decrease(event){
        let {id} = event.target.parentElement;
        if(id === "AI"){
            if(botSpeed > 1){
                setBotSpeed(prev => prev - 1)
            }else{
                setBotSpeed(10)
            }
        }else{
            if(ballSpeed > 1){
                setBallSpeed(prev => prev - 1)
        }else{
            setBallSpeed(5)
        }
    }}

    function startGame(){
        if(!gameRunning){
            setGameRunning(true)
            gameRunningRef.current = true;
            while(true){
                let A = Math.ceil(Math.random() * 5);
                let B = Math.ceil(Math.random() * 4);
                if(A + B == 6){
                    Xmovement = A * ballSpeed;
                    Ymovement = B * ballSpeed;
                    break;
                }
            }
            moveBall();
    }}

    function moveBall(){
        if(gameRunningRef.current){
            ballX = parseFloat(ballStyles.left);
            ballY = parseFloat(ballStyles.top);
            playerX = parseInt(playerStyles.left);
            playerY = parseInt(playerStyles.top);
            computerX = parseInt(computerStyles.left);
            computerY = parseInt(computerStyles.top);
            // bot movement
            if((computerY >= 0 && computerY <= gameHeight-computerHeight) || (computerY >= gameHeight-computerHeight && ballY <= computerY + computerHeight/2) || (computerY <= 0 && ballY >= computerY+ computerHeight/2)){
                if(ballY >= computerY + computerHeight/2){
                    setComputerPosition(prev => prev + botSpeed)
                }else{
                    setComputerPosition(prev => prev - botSpeed)
                }
            }
            let futureX = ballX + Xmovement;
            let futureY = ballY + Ymovement
            //ball movement and scoring
            if(futureY <= gameHeight-ballHeight && futureY >= 0 && futureX <= computerX-ballWidth && futureX >= playerX){
                setBallPosition(prev => {return {x : prev.x + Xmovement , y : prev.y + Ymovement}})
            }else if(!(futureY <= gameHeight-ballHeight && futureY >= 0)){
                Ymovement = Ymovement * -1;
                setBallPosition(prev => {return {x : prev.x + Xmovement , y : prev.y + Ymovement}})
            }else{
                if((futureX > computerX-ballWidth && !(futureY >= computerY && futureY <= computerY+computerHeight)) || futureX >= gameWidth){
                    setScore(prev => ({...prev ,"player" : prev.player + 1}))
                    setBallPosition(prev => {return {x: playerX + playerWidth , y : playerY + playerHeight/2 - ballHeight/2}})
                    setGameRunning(false)
                }else if((futureX < playerX+ballWidth && !(futureY >= playerY && futureY <= playerY+playerHeight)) || futureX <= 0){
                    setScore(prev => ({...prev ,"computer" : prev.computer + 1}))
                    setBallPosition(prev => {return {x: playerX + playerWidth , y : playerY + playerHeight/2 - ballHeight/2}})
                    setGameRunning(false)
                }else{
                    Xmovement = Xmovement * -1;
                    setBallPosition(prev => {return {x : prev.x + Xmovement , y : prev.y + Ymovement}})        
            }}
            window.requestAnimationFrame(moveBall);
    }}

    function movePad(event){
        let {clientY} = event;  
        if(clientY <= gameHeight-playerHeight/2 && clientY >= playerHeight/2){
            setPlayerPosition(clientY-(playerHeight/2)) 
        }else if(!(clientY <= gameHeight-playerHeight/2)){
            setPlayerPosition(gameHeight-playerHeight)
        }else if(!(clientY >= playerHeight/2)){
            setPlayerPosition(0)
        }
        if(!gameRunning){
            setBallPosition({x: playerX + playerWidth , y : playerY + playerHeight/2 - ballWidth})
        }
    }

    React.useEffect(() => {
        game = document.getElementById("game");
        gameStyles = window.getComputedStyle(game);
        gameWidth = parseInt(gameStyles.width);
        gameHeight = parseInt(gameStyles.height);
        ball = document.getElementById("ball");
        // it returns null because the element
        ballStyles = window.getComputedStyle(ball);
        ballWidth = parseInt(ballStyles.width);
        ballHeight = parseInt(ballStyles.height);
        ballX = parseFloat(ballStyles.left) + ballWidth/2;
        ballY = parseFloat(ballStyles.top) + ballHeight/2;
        player = document.getElementById("player-paddle");
        playerStyles = window.getComputedStyle(player)
        playerWidth = parseInt(playerStyles.width);
        playerHeight = parseInt(playerStyles.height);
        playerX = parseInt(playerStyles.left);
        playerY = parseInt(playerStyles.top);
        computer = document.getElementById("computer-paddle");
        computerStyles = window.getComputedStyle(computer)
        computerX = parseInt(computerStyles.left);
        computerY = parseInt(computerStyles.top);
        computerWidth = parseInt(computerStyles.width);
        computerHeight = parseInt(computerStyles.height);
    })

    return ( 
        <React.Fragment>
            <div className='game row' id='game' style={{height : `${window.innerHeight - 200}px`}} onMouseMove={movePad} onClick={startGame}>
                <div className='score text-light mx-auto'>{score.player}|{score.computer}</div>
                <div className="ball" id="ball" style={{left:`${x}px` , top:`${y}px`}}></div>
                <div className="paddle-left" id='player-paddle' style={{top:`${playerPosition}px`}}></div>
                <div className="paddle-right" id='computer-paddle' style={{top:`${computerPosition}px`}}></div>
            </div>

            <div className='buttons row m-3 text-light text-center'>
                <div className='col-md-4 bg-dark d-flex justify-content-around' id='AI'>
                    <div className='btn btn-danger m-1' onClick={decrease}>-</div>
                    AI difficulty <br/>X{botSpeed}
                    <div className='btn btn-success m-1' onClick={increase}>+</div>
                </div>
                <div className='col-md-4 btn btn-danger' onClick={resetScore}>Reset Game</div>
                <div className='col-md-4 bg-dark d-flex justify-content-around' id='ball'>
                    <div className='btn btn-danger m-1' onClick={decrease}>-</div>
                    Ball speed <br/>X{ballSpeed}
                    <div className='btn btn-success m-1' onClick={increase}>+</div>
                </div>
            </div>
        </React.Fragment>
     );
}
 
export default Pong;