const makeUser = ({ id, friends = [] } = {}) => ({
  id,
  friends,
  getFriends() {
    return this.friends;
  },
});

export default makeUser;
