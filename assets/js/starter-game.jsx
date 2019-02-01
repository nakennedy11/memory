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
    let tileList = this.initiateTiles();

    this.state = { tiles: tileList, 
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
	let tileList = []; // empty list to be added to 

	for (ii = 0; ii < 4; ii++) {
		tileList[ii] = [];
		for (jj = 0; jj < 4; jj++) {
			var letter = _.sample(letter_list); // sample a random letter from the list 
			letter_list.splice(letter_list.indexOf(letter), 1); // remove it to stop duplicates
			tileList[ii].push(<Tile onClick={this.tileClick.bind(this, ii, jj, letter)} 
				ii={ii} jj={jj} hidden={true} tileletter={letter}/>); 
		}
	}
	
	return tileList;
  }
 
  tileClick(ii, jj, letter) {
	// increment clicks
	this.setState({clicks : this.state.clicks + 1});
	
	// get a copy of the tile matrix  
	let tempTiles = this.state.tiles.slice();

	if (this.state.first === "") { //this is the first button clicked of a pair
		console.log("this is the first tile clicked, ii = " + ii + " jj = " + jj + " val = " + letter);
		// set the state to know what the first letter clicked was	
		tempTiles[ii][jj] = <Tile onClick={this.tileClick.bind(this, ii, jj, letter)}
				ii={ii} jj={jj} hidden={false} tileletter={letter}/>;

		this.setState({first: letter, firstx : ii, firsty : jj, tiles : tempTiles});
		// show the hidden letter
	} else if (this.state.first != "" && this.state.sec === "") { // one button clicked, this is the attempted match
	console.log("this is the second tile clicked, ii = " + ii + " jj = " + jj + " val = " + letter);
		console.log("testing out what first might be, first = " + this.state.first);
		// set the state with the second clicks info	
			tempTiles[ii][jj] = <Tile onClick={this.tileClick.bind(this, ii, jj, letter)}
				ii={ii} jj={jj} hidden={false} tileletter={letter}/>;
		console.log("post setting temp, second = " + this.state.sec);
		this.setState({sec : letter, secondx : ii, secondy : jj, tiles : tempTiles});
		
	console.log("after setting state. second = " + this.state.sec);
		// check if it is a match and handle appropiately
	this.checkMatch(letter, ii, jj);
		console.log("just check match and got back, second = " + letter);
	}
  }
	
  checkMatch(letter, x, y){
	console.log("in checkMatch, sceond = " + this.state.sec + " first = " + this.state.first);
	  console.log("what is tester?: " + letter);
	  // setting variables for cleaner code
		
	let tileList = this.state.tiles.slice();
 
	let first = this.state.first;
	let firstx = this.state.firstx;
	let firsty = this.state.firsty;

//	let second = tileList[this.state.secondx][this.state.secondy].tileLetter;
//	let secondx = this.state.secondx;
//	let secondy = this.state.secondy;

//	console.log("in check match, first = " + first + " second = " + second);
	// if it is a match
	if (first === letter) {
		// let them stay not hidden, and reset the values of the states buttons
	console.log("its a match");
		
		this.resetClickedTiles();
	} 
	  else {  // not a match
		// want to delay, hide the buttons, and reset what was remembered as clicked
	console.log("not a match");
		setTimeout(() => {
			tileList[firstx][firsty] = <Tile onClick={this.tileClick.bind(this, firstx, firsty, first)}
				ii={firstx} jj={firsty} hidden={true} tileletter={first}/>;
	console.log("just initiated first boy as being hidden");	
			tileList[x][y] = <Tile onClick={this.tileClick.bind(this, x, y, letter)}
				ii={x} jj={y} hidden={true} tileletter={letter}/>;
			console.log("just initiated the second boy as hidden");
			this.setState({tiles : tileList});
			console.log("just set the state of the hidden boys");
			
			console.log("just reset the clicked tiles");
	     		}, 1000);
		  this.setState({tiles : tileList});
		  this.resetClickedTiles();		
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
	
	let tiles = this.state.tiles.slice();
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
		return <button className="tile" onClick={() => props.onClick(this, ii, jj, props.tileletter)}>???</button>
	}
	else {
		return <button className="tile">{props.tileletter}</button>
	}
}


