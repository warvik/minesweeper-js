document.addEventListener('DOMContentLoaded', () => {

	// Reference main board
	const board = document.getElementById('board');
	const boardSize = 400
	let bricksPerRow = 10
	let numberOfBombsOnBoard =5
	let bricks = [];
	let isGameOver = false
	let placedFlagsCount = 0

	board.style.width = board.style.height = boardSize + 'px'

	const createBoard = () => {

		const bombsArray = Array(numberOfBombsOnBoard).fill('bomb')
		const emptyArray = Array(bricksPerRow*bricksPerRow-numberOfBombsOnBoard).fill('valid')
		const gameArray = emptyArray.concat(bombsArray)
		const shuffleArray = gameArray.sort(() => Math.random() - 0.5)

		for (let i=0; i<bricksPerRow*bricksPerRow; i++) {
			
			const square = document.createElement('div');

			square.style.width = square.style.height = ((boardSize / bricksPerRow) - 2) + 'px'
			
			square.setAttribute('id', i);
			
			square.classList.add(shuffleArray[i])

			board.appendChild(square);
			bricks.push(square)

			square.addEventListener('click', (e) => {
				squareHandler(square)
			})

			square.oncontextmenu = (e) => { e.preventDefault(); return flagHandler(square); }
		}

		let squareContainBomb = (i) => bricks[i].classList.contains('bomb')


		for (let i=0; i<bricks.length; i++) {
			const isLeftEdge = i % bricksPerRow === 0
			const isRightEdge = i % bricksPerRow === bricksPerRow - 1
			let total = 0

			if (bricks[i].classList.contains('valid')) {

				// North
				// If not on first row, check if square directly above is a bomb
				if (i > (bricksPerRow - 1) && squareContainBomb(i - bricksPerRow)) total++

				// North East
				// If not on right edge, and first row, check if square top
				// right is a bomb
				if (!isRightEdge && i > (bricksPerRow - 1) && squareContainBomb(i - bricksPerRow + 1)) total++

				// East
				// If not on right edge, check if the next square is a bomb
				if (!isRightEdge && squareContainBomb(i+1)) total++

				// South East
				// If not on last row, and not on right edge, check if square
				// below to the right is a bomb
				if (i < ((bricksPerRow * bricksPerRow) - bricksPerRow) && !isRightEdge && squareContainBomb(i + bricksPerRow + 1)) total++

				// South
				// If not on last row, check if square directly below is a bomb
				if (i < ((bricksPerRow * bricksPerRow) - bricksPerRow) && squareContainBomb(i + bricksPerRow)) total++

				// South West
				// If not on last row, and not on left edge, check if square
				// below to the left is a bomb.
				if (i < ((bricksPerRow * bricksPerRow) - bricksPerRow) && !isLeftEdge && squareContainBomb(i + bricksPerRow - 1)) total++

				// West
				// If not on left edge, check if the previous square is a bomb
				if (!isLeftEdge && squareContainBomb(i-1)) total++

				// North West
				// If not on first row, and no on left edge, check is square 
				// above to the left is a bomb.
				if (i > (bricksPerRow - 1) && !isLeftEdge && squareContainBomb(i - bricksPerRow - 1)) total++

				bricks[i].setAttribute('data-adjacent-bombs', total)
			}


		}
	}

	const flagHandler = (square) => {

		placedFlagsCount += square.classList.contains('flag') ? -1 : 1
		console.log(placedFlagsCount)
		square.classList.toggle('flag')
	}

	const squareHandler = (square) => {

		if (isGameOver) return
	
		if (square.classList.contains('checked') || square.classList.contains('flag')) return

		const currentId = parseInt(square.id)

		if (square.classList.contains('bomb')) {
			console.log('Game Over')
		} else {
			let total = parseInt(square.getAttribute('data-adjacent-bombs'));

			if (total != 0) {
				
				if (total === 1) square.classList.add('one')
				if (total === 2) square.classList.add('two')
				if (total === 3) square.classList.add('three')
				if (total === 4) square.classList.add('four')

				square.innerHTML = total
			}
			

			if (total === 0) checkSquare(square, currentId)
		}

		square.classList.add('checked')
	}

	const checkSquare = (square, currentId) => {
		const isLeftEdge = currentId % bricksPerRow === 0
		const isRightEdge = currentId % bricksPerRow === bricksPerRow - 1

		const callSquareHandler = (square) => {
			if (!square.classList.contains('bomb')) {
				squareHandler(square)
			}
		}
		
		setTimeout(() => {
			if (currentId > 0 && !isLeftEdge) {
				callSquareHandler(bricks[currentId - 1])
			}

			if (currentId > (bricksPerRow - 1) && !isRightEdge) {
				callSquareHandler(bricks[currentId + 1 - bricksPerRow])
			}
			
			if (currentId > bricksPerRow) {
				callSquareHandler(bricks[currentId - bricksPerRow])
			}

			if (currentId > bricksPerRow && !isLeftEdge) {
				callSquareHandler(bricks[currentId - 1 - bricksPerRow])
			}
			if (currentId < ((bricksPerRow * bricksPerRow) - 2) && !isRightEdge) {
				callSquareHandler(bricks[currentId + 1])
			}
			if (currentId < ((bricksPerRow * bricksPerRow) - bricksPerRow) && !isLeftEdge) {
				callSquareHandler(bricks[currentId - 1 + bricksPerRow])
			}
			if (currentId < ((bricksPerRow * bricksPerRow) - bricksPerRow - 2) && !isRightEdge) {
				callSquareHandler(bricks[currentId + 1 + bricksPerRow])
			}
			if (currentId < ((bricksPerRow * bricksPerRow) - bricksPerRow - 1)) {
				callSquareHandler(bricks[currentId + bricksPerRow])
			}
		}, 10)

	}

	createBoard();

})