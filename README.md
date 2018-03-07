Remote Chess Engine
===================

Remote Chess Engine, ready to process position analysis tasks via Remote Interface for Chess Positions Analysis (RICPA)

**GET /fen** - returns best move for this fen or estimated time when answer could be provided. {bestMove, estimatedTime}. If fen is not analyzed and is not in queue, returns {bestMove: underfined, estimatedTime: underfined}

**POST /fen** - posts fen for analysis with specified depth at the end of a queue, triggers analysis from the top of queue if nothing is being analyzed now
  - fen - FEN of chess position
  - depth - depth to analyze
  - returns place in queue starting from 0 and estimated time to analyze

**DELETE /fen** - delete specified fen from the queue

**GET /queue** - gets queue as [{fen, depth, estimatedTime}, ...]