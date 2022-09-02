export const getDisplayName = user => {
	if (!(user.first_name || user.last_name)) return user.email.split('@')[0]
	return user.first_name + ' ' + user.last_name
}
