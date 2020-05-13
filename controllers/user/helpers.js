const updateThisUser = async (user, email, name, active, userRole, phone) => {
    user.email = email;
    user.fullName = name;
    user.isActive = active;
    user.role = userRole;
    user.phoneNumber = phone;
    await user.save()
}

module.exports = { updateThisUser }