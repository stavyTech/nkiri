// DATABASE
function getUsers(){
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(data){
  localStorage.setItem("users", JSON.stringify(data));
}

// REGISTER
function register(username,email,password){

  let users = getUsers();

  users.push({
    username,
    email,
    password,
    image:"https://i.pravatar.cc/150"
  });

  saveUsers(users);
}

// LOGIN
function login(email,password){

  let users = getUsers();

  let user = users.find(u =>
    u.email === email && u.password === password
  );

  if(user){
    localStorage.setItem("loggedUser", JSON.stringify(user));
    return true;
  }

  return false;
}

// GET CURRENT USER
function currentUser(){
  return JSON.parse(localStorage.getItem("loggedUser"));
}

// WALLET
function getWallet(){
  let user = currentUser();
  return JSON.parse(localStorage.getItem(user.email+"_wallet")) || 0;
}

function saveWallet(amount){
  let user = currentUser();
  localStorage.setItem(user.email+"_wallet", JSON.stringify(amount));
}