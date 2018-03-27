const data = new Map();

exports.get = ({ fen }) => data.get(fen);

exports.save = ({
  fen, depth, bestMove, score
}) => {
  data.set(fen, { depth, bestMove, score });
};
