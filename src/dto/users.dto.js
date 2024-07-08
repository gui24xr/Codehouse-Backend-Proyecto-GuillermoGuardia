
/*
Para construir un UserDTO se requiere un objeto con las propiedads
    userId: id del user en la BD
    email: email del user
    password: pasword del user
    firstName: firstname user
    lastName: 
    age: 
    role: 
    cartId: cartId corrsespondiente al user enl la BD
    createdAt: fecha de creacion del user
    recoveryPasswordCode : codigo para recuperar password
    recoveryPasswordExpiration : expiracion del codigo para recuperar passwqord
    lastConnection: info ultima conexion
    documents: arrayn de objetos [{docname, docRef}]
*/

export class UserDTO{
    constructor(receivedUser){
        console.log('en user dto: ', receivedUser.avatar)
        this.userId = receivedUser.userId;
        this.email = receivedUser.email;
        this.password = receivedUser.password;
        this.firstName = receivedUser.firstName;
        this.lastName = receivedUser.lastName;
        this.age = receivedUser.age;
        this.role = receivedUser.role;
        this.cartId = receivedUser.cartId;
        this.createdAt = receivedUser.createdAt;
        this.enabled = receivedUser.enabled;
        this.recoveryPasswordCode = receivedUser.recoveryPasswordCode;
        this.recoveryPasswordExpiration = receivedUser.recoveryPasswordExpiration;
        this.lastConnection= receivedUser.lastConnection;
        this.documents=receivedUser.documents; // Una lista de objetos...
        this.avatar= receivedUser.avatar || '/img/avatars/defaultavatar2.png'
    }
}