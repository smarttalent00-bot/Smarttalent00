const riskDB = new Map();

function addRisk(user, points) {
  const current = riskDB.get(user) || 0;
  const total = current + points;

  riskDB.set(user, total);
  return total;
}

function getRisk(user) {
  return riskDB.get(user) || 0;
}

function resetRisk(user) {
  riskDB.delete(user);
}

module.exports = { addRisk, getRisk, resetRisk };
