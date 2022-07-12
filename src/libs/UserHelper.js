class UserHelper
{
	static ucFirstUsers(users)
	{
		users.forEach(e => {
			e.first_name = e.first_name.charAt(0).toUpperCase()
				+ e.first_name.slice(1);
			e.last_name = e.last_name.charAt(0).toUpperCase()
				+ e.last_name.slice(1);
		});
	}
}

module.exports = UserHelper;