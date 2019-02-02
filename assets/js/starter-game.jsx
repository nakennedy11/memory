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
	    firstClicked: false,
	    secondClicked: false,
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
	let first = this.state.firstClicked;
	let second = this.state.secondClicked;

	// if this is the first tile clicked of a pair  
	if (!first) {
		// set the tile to be seen and update the state	
		tempTiles[ii][jj] = <Tile onClick={this.tileClick.bind(this, ii, jj, letter)}
				ii={ii} jj={jj} hidden={false} tileletter={letter}/>;

		this.setState({firstClicked : true, firstx : ii, firsty : jj, tiles : tempTiles});
		
	} else if (first && !second) { // one button clicked, this is the attempted match
		// set the state with the second clicks info and the letter to be visible	
		tempTiles[ii][jj] = <Tile onClick={this.tileClick.bind(this, ii, jj, letter)}
					ii={ii} jj={jj} hidden={false} tileletter={letter}/>;
		
		this.setState({secondClicked : true, secondx : ii, secondy : jj, tiles : tempTiles});
		
		// check if it is a match and handle appropiately
		this.checkMatch(letter, ii, jj);
	}
  }
	
  checkMatch(letter, x, y){
	// setting variables for cleaner code
		
	let tileList = this.state.tiles.slice();
 
	let firstx = this.state.firstx;
	let firsty = this.state.firsty;
	let first = tileList[firstx][firsty].tileletter;

	if (first != letter) {  // not a match
		// want to delay, hide the buttons, and reset what was remembered as clicked
		setTimeout(() => {
			// set the two buttons to hide their values
			tileList[firstx][firsty] = <Tile onClick={this.tileClick.bind(this, firstx, firsty, first)}
				ii={firstx} jj={firsty} hidden={true} tileletter={first}/>;
	
			tileList[x][y] = <Tile onClick={this.tileClick.bind(this, x, y, letter)}
				ii={x} jj={y} hidden={true} tileletter={letter}/>;
			this.setState({tiles : tileList});
	     		}, 1000);
		  // update the state with the new tiles and forget the old click values
		  
	}
  
	this.resetClickedTiles();		
  }
  // sets the state back to no tiles having been clicked	
  resetClickedTiles() {
	this.setState({firstClicked : false, secondClicked: false, firstx : 0, firsty : 0, secondx : 0, secondy : 0});
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

// tile item that hides value based on boolean flag, also makes itself not able to be clicked if its showing a letter already
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


