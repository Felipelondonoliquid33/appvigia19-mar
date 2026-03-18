/*
* Ferney Duran 02/2020
*/

//const urlBase = "https://nonenteric-chau-turbidly.ngrok-free.dev";
const urlBase = "https://modoseguro.catedra.edu.co";
const ApiBase = {
    apiLogin: urlBase + "/Home/LoginReact",
    apiOlvido: urlBase + "/Home/OlvidoReact",
    apiRegistro: urlBase + "/Home/Registro",
    apiAceptar: urlBase + "/Home/Terminos",
    apiCatalogos: urlBase + "/Home/Catalogos",
    apiParametros: urlBase + "/Home/Parametros",
    apiEnviar: urlBase + "/Diligenciar/DiligenciarRecibir",
    apiRecibir: urlBase + "/Diligenciar/DiligenciarPorUsuario",
}

export default ApiBase;    