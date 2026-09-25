export const POINTS = {
  exactScore: 3,
  goalDifference: 2,
  result: 1,
  homeGoals: 1,
  awayGoals: 1,
};

export function scoreBreakdown(prediction, match) {
  const empty = { exactScore: 0, goalDifference: 0, result: 0, homeGoals: 0, awayGoals: 0, total: 0 };
  if (match.polandScore == null || match.opponentScore == null) return empty;

  const predHome = match.isHome ? prediction.polandScore : prediction.opponentScore;
  const predAway = match.isHome ? prediction.opponentScore : prediction.polandScore;
  const actualHome = match.isHome ? match.polandScore : match.opponentScore;
  const actualAway = match.isHome ? match.opponentScore : match.polandScore;

  const exact = prediction.polandScore === match.polandScore && prediction.opponentScore === match.opponentScore;
  const predDiff = prediction.polandScore - prediction.opponentScore;
  const actualDiff = match.polandScore - match.opponentScore;

  const b = {
    exactScore: exact ? POINTS.exactScore : 0,
    goalDifference: predDiff === actualDiff ? POINTS.goalDifference : 0,
    result: Math.sign(predDiff) === Math.sign(actualDiff) ? POINTS.result : 0,
    homeGoals: predHome === actualHome ? POINTS.homeGoals : 0,
    awayGoals: predAway === actualAway ? POINTS.awayGoals : 0,
  };
  b.total = b.exactScore + b.goalDifference + b.result + b.homeGoals + b.awayGoals;
  return b;
}

export function pointsFor(prediction, match) {
  return scoreBreakdown(prediction, match).total;
}

export function hasKickedOff(match) {
  const kickoff = match.kickoff?.toDate ? match.kickoff.toDate() : new Date(match.kickoff);
  return Date.now() >= kickoff.getTime();
}