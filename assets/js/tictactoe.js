var tictactoe = angular.module('tictactoe', []);

tictactoe.controller('tictactoeCtrl', function($scope, $filter){
	gameStarted = false;
	player = "circle";
	AI = "times";
	boxLeft = 9;
	$scope.btnStart = "START GAME";
	$scope.score = 0;
	$scope.win = false;
	$scope.lose = false;
	$scope.draw = false;
	$scope.gamePlayed = 0;
	generateBox();

	$scope.changePlayer = function(playerType){
		player = playerType;
	}

	$scope.startGame = function(){
		generateBox();
		gameStarted = true;
		AI = (player == 'circle')?'times':'circle';
		$(".navigation").slideUp();
		$(".tictac-board").slideDown();
		setTimeout(function(){
			$scope.win = false;
			$scope.lose = false;
			$scope.draw = false;
		},300);
	}

	$scope.fillBox = function(box){
		if (!gameStarted) {return false;}; // Do nothing if game is not started yet
		if (!box.content){ //if box not empty
			fillBoxWith(player, "#box" + box.x + box.y); // Add player Chosen element to the box
			$scope.boxes[box.x][box.y].content = player; // Change the scope data of the box
			boxLeft--;
			if (isWin(box, player)) {
				endGame("win");
				return false;
			}else if (boxLeft > 0) {
				AITurn(box.x, box.y);
			}else if (boxLeft == 0){
				endGame("draw");
			}
		}
		
	}

	function generateBox(){
		$scope.boxes = [];
		for (var i = 0; i < 3; i++) {
			var temp = [];
				for (var j = 0; j < 3; j++) {
					type = getBoxType(i,j); 
					a = {content : false, x : i, y : j, type : type};
					temp.push(a);
				}
			$scope.boxes.push(temp);
		};
	}

	function endGame(winlose){
		if (winlose == "win") {
			$scope.win = true;
			$scope.btnStart = "PLAY AGAIN";
			$scope.score += 10;
		}else if(winlose == "lose") {
			$scope.lose = true;
			$scope.btnStart = "TRY AGAIN";
			$scope.score -= 10;
		}else if(winlose == "draw"){
			$scope.draw = true;
			$scope.btnStart = "PLAY AGAIN"
		}
		$scope.gamePlayed++;
		gameStarted = false;
		boxLeft = 9;
		//generateBox();
		//$(".tictac-board").slideUp();
		setTimeout(function(){
			$(".navigation").slideDown();
		},200)
	}

	function AITurn(x,y){
		var selectedBoxes = TheChosenOneByAI(x,y); //emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
		fillBoxWith(AI, "#box" + selectedBoxes.x + selectedBoxes.y); // Add AI Chosen element to the box
		$scope.boxes[selectedBoxes.x][selectedBoxes.y].content = AI; // Change the scope data of the box
		boxLeft--;
		if (isWin($scope.boxes[selectedBoxes.x][selectedBoxes.y], AI)) {
				endGame("lose");
		}
	}

	function isWin(box, currentPlayer){
		var friends = getBoxFriend(box.x,box.y);
		loop = true;
		r = false;
		angular.forEach(friends, function(val, index){
			if (loop) {
				win = true;
				loop2 = true;
				angular.forEach(val,function(v,i){
					if (loop2) {
						b = $scope.boxes[v.x][v.y];
						if (b.content !== currentPlayer) {
							win = false;
							loop2 = false;
						}
					};
				})
				if (win == true) {
					r =  true;
					loop = false
				};
			};
		})

		return r;
	}


	function fillBoxWith(player, selector){
		$(selector).addClass(player); 
		if (player == "circle") {
			$(selector).append('<i class="fa fa-circle-o fa-fw fa-5x"></i>');
		}else if(player = "times"){
			$(selector).append('<i class="fa fa-times fa-fw fa-5x"></i>');
		}
	}

	
	function getBoxFriend(x,y){
		selectedBox = $scope.boxes[x][y];
		friends = [];
		if (selectedBox.type == "side") {
			friends.push(getVerticalFriend(x,y));
			friends.push(getHorizontalFriend(x,y));
		}else if (selectedBox.type == "corner") {
			friends.push(getVerticalFriend(x,y));
			friends.push(getHorizontalFriend(x,y));
			if (x==0&&y==0 || x==2&&y==2) {
				friends.push(getLeftDiagonalFriend(x,y));
			}else if(x==0&&y==2 || x==2&&y==0){
				friends.push(getRightDiagonalFriend(x,y));
			}
		}else if (selectedBox.type == "center"){
			friends.push(getVerticalFriend(x,y));
			friends.push(getHorizontalFriend(x,y));
			friends.push(getLeftDiagonalFriend(x,y));
			friends.push(getRightDiagonalFriend(x,y));
		}
		return friends;
	}


	function getBoxType(x,y){
		if ( x==0&&y==0||x==0&&y==2||x==2&&y==0||x==2&&y==2) {
			return "corner";
		}else if (x==0&&y==1||x==1&&y==0||x==1&&y==2||x==2&&y==1){
			return "side";
		}else if(x==1&&y==1){
			return "center";
		}
	}

	function getAllEmptyBoxes(){
		var empty = [];
		angular.forEach($scope.boxes, function(value, index){
			angular.forEach(value, function(val, ind){
				if (!val.content) {
					empty.push(val)
				};
			})
		})
		return empty;
	}


	function getVerticalFriend(x,y){
		friend = [];
		for (var i=0;i<3; i++) {
			if (i !== y) {
				friend.push({x:x,y:i});
			};
		};
		return friend;
	}
	function getHorizontalFriend(x,y){
		friend = [];
		for (var i=0;i<3; i++) {
			if (i !== x) {
				friend.push({x:i,y:y});
			};
		};
		return friend;
	}
	function getRightDiagonalFriend(x,y){
		friend = [{x:0,y:2},{x:1,y:1},{x:2,y:0}];
		newFriend = [];
			angular.forEach(friend,function(val, ind){
				if (val.x !== x && val.y !== y) {
					newFriend.push(val);
				};
			})
		return newFriend;
	}

	function getLeftDiagonalFriend(x,y){
		friend = [];
		for (var i=0;i<3; i++) {
			if (i !== x) {
				friend.push({x:i,y:i});
			};
		};
		return friend;
	}


	function TheChosenOneByAI(x,y){
		allPlayerFriends = getBoxFriend(x,y);
		return FilterPlayerFriendsForAI(allPlayerFriends);
	}

	function FilterPlayerFriendsForAI(playerFriends){
		var AvailableBox = [];
		var importantBox = [];
		var veryImportantBox = null;
		angular.forEach(playerFriends, function(val, index){
				if ($scope.boxes[1][1].content == player && boxLeft == 8) { // jika user milih tengah ambil pojok (prtama jalan)
					importantBox = getAllCornerBox();
					console.log(getAllCornerBox());
				}else if ($scope.boxes[1][1].content == false && boxLeft == 8) { //jika user milih selain tengah, ambil tengah (prtama jalan)
					veryImportantBox = $scope.boxes[1][1]; 
				}else if ($scope.boxes[val[0].x][val[0].y].content == player && $scope.boxes[val[1].x][val[1].y].content == false) { //blocking
					importantBox.push($scope.boxes[val[1].x][val[1].y]);
				}else if( $scope.boxes[val[1].x][val[1].y].content == player && $scope.boxes[val[0].x][val[0].y].content == false){ //blocking
					importantBox.push($scope.boxes[val[0].x][val[0].y]);
				}else if($scope.boxes[val[0].x][val[0].y].content == false &&  $scope.boxes[val[1].x][val[1].y].content == false){ //klo ga ada yg diblock, isi salah satu temen box yg dipilih user
					AvailableBox.push($scope.boxes[val[0].x][val[0].y]);
					AvailableBox.push($scope.boxes[val[1].x][val[1].y]);
				}else if ($scope.boxes[val[0].x][val[0].y].content == AI &&  $scope.boxes[val[1].x][val[1].y].content == false) { //ga ada yg di block
					AvailableBox.push($scope.boxes[val[1].x][val[1].y]);
				}else if( $scope.boxes[val[1].x][val[1].y].content == AI && $scope.boxes[val[0].x][val[0].y].content == false){ // ga ada yg diblock
					AvailableBox.push($scope.boxes[val[0].x][val[0].y]);
				}
		})
		if(veryImportantBox !== null){
			return veryImportantBox;
		}else if (importantBox.length > 0) {
			return importantBox[Math.floor(Math.random() * importantBox.length)];
		}else if (AvailableBox.length > 0){
			return AvailableBox[Math.floor(Math.random() * AvailableBox.length)];
		}else{
			var emptyBoxes = getAllEmptyBoxes();
			return emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
		}
	}

	function getAllCornerBox(){
		cornerBoxes = [];
		angular.forEach($scope.boxes, function(v,i){
			angular.forEach(v, function(val, index){
				if (val.type == "corner" && val.content == false) {
					cornerBoxes.push(val);
				};
			})
		})
		return cornerBoxes;
	}

})