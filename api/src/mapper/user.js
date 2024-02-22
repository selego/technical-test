function mapUserDtoToModel(userDto) {
    return {
        ...userDto,
        name: userDto.username
    }
}

module.exports = {
    mapUserDtoToModel,
};