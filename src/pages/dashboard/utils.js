const swapKeysWithValues = obj =>
	Object.fromEntries(Object.entries(obj).map(a => a.reverse()))

export const gameTypes = {
  1: "World",
  2: "North America",
  3: "South America",
  4: "Europe",
  5: "Africa",
  6: "Asia",
  7: "Oceania",
}

export const getGameTypeId = gameType => (swapKeysWithValues(gameTypes)[gameType])
export const getDisplayName = (user, separator = ' ') => {
	if (!(user.first_name || user.last_name)) return user.email.split('@')[0]
	return user.first_name + separator + user.last_name
}
