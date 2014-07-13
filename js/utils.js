var RANDOM = new MersenneTwister();

function random_index (choices) {
  return Math.floor(RANDOM.random() * choices.length);
}
