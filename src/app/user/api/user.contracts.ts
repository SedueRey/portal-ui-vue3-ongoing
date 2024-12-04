import { type Afiliacion } from '../user.types';

export interface WhoamiUserDataResponse {
  afiliacion: Afiliacion;
  identificador: string;
  letra: string;
  tipoIdentificador: string;
  nombre: string;
  apellido1: string;
  dni: string;
  email: string;
  extensionsLocations: Array<{ [key: string]: string }>;
  isAdmin?: boolean;
  newUser: string;
  profile: string[];
  roleName: {
    description: string[];
    type: string[];
  };
  unitDescriptions: string[];
  unitsByUser: string[];
  uuid: string;
}
