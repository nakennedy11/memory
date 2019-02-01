import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<MysteryMatch />, root);
}

class MysteryMatch extends React.Component {
  constructor(props) {
    super(props);
 
    // initiate the buttons randomly
    let tiles = this.initiateTiles();

    this.state = { tiles: tiles, 
	    clicks: 0, 
	    first: "", 
	    sec: "",
    	    firstx: 0,
	    firsty: 0,
	    secondx: 0,
	    secondy: 0};
  }

  initiateTiles() {
	let ii;
	let jj;

	
	let letter_list = ["a", "b", "c", "d", "e", "f", "g", "h", "a", "b", "c", "d", "e", "f", "g", "h"]; // enough for 8 matches
	let tiles = []; // empty list to be added to 

	for (ii = 0; ii < 4; ii++) {
		tiles[ii] = [];
		for (jj = 0; jj < 4; jj++) {
			var letter = _.sample(letter_list); // sample a random letter from the list 
			letter_list.splice(letter_list.indexOf(letter), 1); // remove it to stop duplicates
			tiles[ii].push(<Tile onClick={this.tileClick.bind(this, ii, jj, letter)} 
				ii={ii} jj={jj} hidden={true} tileletter={letter}/>); 
		}
	}
	
	return tiles;
  }
 
  tileClick(ii, jj, letter) {
	  console.log("in tileClick ii  = " + ii + " jj = " + jj + " letter =  " + letter);
	// increment clicks
	this.setState({clicks : this.state.clicks + 1});
	let tempTiles = this.state.tiles;

	if (this.state.first == "") { //this is the first button clicked of a pair
		console.log("this is the first tile clicked, ii = " + ii + " jj = " + jj + " val = " + letter);
		// set the state to know what the first letter clicked was	
		tempTiles[ii][jj] = <Tile onClick={this.tileClick.bind(this, ii, jj, letter)}
				ii={ii} jj={jj} hidden={false} tileletter={letter}/>;

		this.setState({first: letter, firstx : ii, firsty : jj, tiles : tempTiles});
		// show the hidden letter
	} else if (this.state.first != "" && this.state.sec == "") { // one button clicked, this is the attempted match
	console.log("this is the second tile clicked, ii = " + ii + " jj = " + jj + " val = " + letter);
		console.log("testing out what first might be, first = " + this.state.first);
		// set the state with the second clicks info	
			tempTiles[ii][jj] = <Tile onClick={this.tileClick.bind(this, ii, jj, letter)}
				ii={ii} jj={jj} hidden={false} tileletter={letter}/>;
		console.log("post setting temp, second = " + this.state.sec);
		this.setState({tiles : tempTiles, sec : letter, secondx : ii, secondy : jj});
		
	console.log("after setting state. second = " + this.state.sec);
		// check if it is a match and handle appropiately
	this.checkMatch(letter);
		console.log("just check match and got back, second = " + letter);
	}
  }
	
  checkMatch(stile) {
	console.log("in checkMatch, sceond = " + this.state.sec);
	  
	  // setting variables for cleaner code
	 
	let first = this.state.first;
	let firstx = this.state.firstx;
	let firsty = this.state.firsty;

	let second = this.state.sec;
	let secondx = this.state.secondx;
	let secondy = this.state.secondy;

	let tileList = this.state.tiles;


	console.log("in check match, first = " + first + " second = " + this.state.sec);
	// if it is a match
	if (first == second) {
		// let them stay not hidden, and reset the values of the states buttons
	console.log("its a match");
		this.setState({tiles : tileList});
		this.resetClickedTiles();
	} 
	  else {  // not a match
		// want to delay, hide the buttons, and reset what was remembered as clicked
	console.log("not a match");
		setTimeout(() => {
			tileList[firstx][firsty] = <Tile onClick={this.tileClick.bind(this, firstx, firsty, first)}
				ii={firstx} jj={firsty} hidden={true} tileletter={first}/>;
	console.log("just initiated first boy as being hidden");	
			tileList[secondx][secondy] = <Tile onClick={this.tileClick.bind(this, secondx, secondy, second)}
				ii={secondx} jj={secondy} hidden={true} tileletter={second}/>;
			console.log("just initiated the second boy as hidden");
			this.setState({tiles : tileList});
			console.log("just set the state of the hidden boys");
			this.resetClickedTiles();
			console.log("just reset the clicked tiles");
	     		}, 1000);	
		tileList[secondx][secondy] = <Tile onClick={this.tileClick.bind(this, secondx, secondy, second)}
				ii={secondx} jj={secondy} hidden={true} tileletter={second}/>;
		console.log("trying to double set this bad boy");
		this.setState({tiles : tileList});
			
	}
  }

  // sets the state back to no tiles having been clicked	
  resetClickedTiles() {
	console.log("in reset tiles first = " + this.state.first + " second = " + this.state.sec);
	this.setState({first : "", firstx : 0, firsty : 0, sec : "", secondx : 0, secondy : 0});
	console.log("in reset tiles post setstate first = " + this.state.first + " second = " + this.state.sec);
  }

  // sets the game back to a starting state with a new set of random tiles
  restartGame() {
	this.setState({tiles : this.initiateTiles(), clicks : 0});
	this.resetClickedTiles();
  }

  render() {
	
	let tiles = this.state.tiles;
	let restartbutton = <button className="restart" onClick={this.restartGame.bind(this)}> Restart Game </button>;

	return (  
		<div>
    	  	  <h1> Memory Matching </h1>
	  	  <div className="row">
	    	  <div className="column">Clicks: {this.state.clicks}</div>
	    	  <div className="column">{restartbutton}</div>
	  	</div>
	 	  <div className="row">
	    	  <div className="column"> {tiles[0][0]} </div>
	    	  <div className="column"> {tiles[0][1]} </div>
	    	  <div className="column"> {tiles[0][2]} </div>
	   	  <div className="column"> {tiles[0][3]} </div>
	  	</div>
	  	  <div className="row">
	    	  <div className="column"> {tiles[1][0]} </div>
	    	  <div className="column"> {tiles[1][1]} </div>
	    	  <div className="column"> {tiles[1][2]} </div>
	    	  <div className="column"> {tiles[1][3]} </div>
	  	</div>
	  	  <div className="row">
	    	  <div className="column"> {tiles[2][0]} </div>
	    	  <div className="column"> {tiles[2][1]} </div>
	    	  <div className="column"> {tiles[2][2]} </div>
	    	  <div className="column"> {tiles[2][3]} </div>
	  	</div>
	  	  <div className="row">
	   	  <div className="column"> {tiles[3][0]} </div>
	    	  <div className="column"> {tiles[3][1]} </div>
	    	  <div className="column"> {tiles[3][2]} </div>
	    	  <div className="column"> {tiles[3][3]} </div>
	  	</div>
		</div>
	);
  }
}
  
function Tile(props) {
	let ii = props.ii;
	let jj = props.jj;
	if (props.hidden) {
		return <button className="tile" onClick={() => props.onClick(this, ii, jj, props.letter)}>???</button>
	}
	else {
		return <button className="tile">{props.tileletter}</button>
	}
}


