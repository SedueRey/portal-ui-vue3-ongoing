export interface UserExtension {
  extNumero?: string;
  extExtension?: string;
  extDesc?: string;
  extEsMovil?: string;
  extPrincipal?: string;
  extRpt?: string;
}

export interface UserLocations {
  espacioTipo?: string;
  espacioTipoNombre?: string;
  espacioCodigo?: string;
  espacioNombre?: string;
  bloque?: string;
  planta?: string;
  plantaNombre?: string;
  dependencia?: string;
  dependenciaNombre?: string;
  codigoPatrimonial?: string;
  extensiones?: UserExtension[];
}

export interface Afiliacion {
  apellido1: string;
  apellido2: string;
  centros: string[];
  direccion: {
    via: string;
    domicilio: string;
    numero?: number;
    ampliacion: string;
    codigoPostal: string;
  };
  emailNotificaciones: string;
  emails: string[];
  fechaNacimiento: string;
  identificador: string;
  letra: string;
  nacionalidad: string;
  nombre: string;
  sexo: string;
  telefonoNotificaciones: string;
  telefonos: string[];
  tipoIdentificador: string;
}
