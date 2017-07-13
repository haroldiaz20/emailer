
const userStore = {
  fullName: '',
  emailAddress: '',

  setFullName(name) {
  	this.fullName = name;
  },
  setEmailAddress(email) {
    this.emailAddress = email;
  }
}


export default userStore;