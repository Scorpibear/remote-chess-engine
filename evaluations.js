const data = new Map();

exports.get = ({ fen }) => data.get(fen);

exports.save = ({
  fen, depth, bestMove, score
}) => {
  console.log(`save evaluation for '${fen}': depth: ${depth}, bestMove: ${bestMove}, score: ${score}`);
  data.set(fen, { depth, bestMove, score });
};
