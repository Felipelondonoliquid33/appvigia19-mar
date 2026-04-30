/*
* Ferney Duran 02/2020
* URL base externalizada a variable de entorno (RNF DevOps)
* Dev:  .env.development  → EXPO_PUBLIC_API_BASE_URL=https://modoseguro.catedra.edu.co
* Prod: .env.production   → EXPO_PUBLIC_API_BASE_URL=https://app1-prod.icbf.gov.co
*/
const urlBase = process.env.EXPO_PUBLIC_API_BASE_URL || "https://modoseguro.catedra.edu.co";
const ApiBase = {
    apiLogin: urlBase + "/Home/LoginReact",
    apiOlvido: urlBase + "/Home/OlvidoReact",
    apiRegistro: urlBase + "/Home/Registro",
    apiAceptar: urlBase + "/Home/Terminos",
    apiCatalogos: urlBase + "/Home/Catalogos",
    apiParametros: urlBase + "/Home/Parametros",
    apiEnviar: urlBase + "/Diligenciar/DiligenciarRecibir",
    apiRecibir: urlBase + "/Diligenciar/DiligenciarPorUsuario",
    // RNF-1.3: endpoint de auditoría para eventos de seguridad del móvil (C-7)
    apiAudit: urlBase + "/Auditoria/EventosMovil",
}

export default ApiBase;    