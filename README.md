Remote Chess Engine
===================

[![Build Status](https://travis-ci.org/Scorpibear/remote-chess-engine.svg?branch=master)](https://travis-ci.org/Scorpibear/remote-chess-engine)
[![Coverage Status](https://codecov.io/gh/Scorpibear/remote-chess-engine/branch/master/graph/badge.svg)](https://codecov.io/gh/Scorpibear/remote-chess-engine)
[![npm version](https://badge.fury.io/js/remote-chess-engine.svg)](https://www.npmjs.com/package/remote-chess-engine)

Remote Chess Engine, ready to process position analysis tasks via Remote Interface for Chess Positions Analysis (RICPA)

API
--

**GET /fen**: input - **fen**, **depth**. Returns **bestMove** for this fen and **depth** or **placeInQueue** and **estimatedTime** when answer could be provided. If fen is not analyzed and is not in queue, returns {bestMove: underfined, placeInQueue: undefined, estimatedTime: underfined}

**POST /fen** - posts fen for analysis with specified depth at the end of a queue, triggers analysis from the top of queue if nothing is being analyzed now
  - fen - FEN of chess position
  - depth - depth to analyze
  - pingUrl - url to execute post call when analysis finished
  - returns place in queue starting from 0 and estimated time to analyze ({placeInQueue, estimatedTime})

**DELETE /fen** - delete specified fen from the queue. Input - **fen**.

**GET /queue** - gets queue as [{fen, depth, estimatedTime}, ...]
