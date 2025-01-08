export interface HistoricoGuiasTitulacionItem {
  codTitu: string;
  descTitu: string;
  plan: string;
}

export type HistoricoGuiasTipoAsignatura = 'M' | 'G';
export type HistoricoGuiasIdiomas = 'Español' | 'English';

export interface HistoricoGuiasSearchSyllabusResponse {
  titulaciones: HistoricoGuiasTitulacionItem[];
  codAsig: string;
  desAsi: string;
  tipoAsig: HistoricoGuiasTipoAsignatura;
}

export interface HistoricoGuiasItemGuia {
  codAsig: string;
  desAsi: string;
  cursoAca: string;
  tipoAsig: HistoricoGuiasTipoAsignatura;
  idioma: HistoricoGuiasIdiomas;
  namePdf: string;
  urlPdf: string;
}

export interface HistoricoGuiasSelectResponse {
  titulaciones: HistoricoGuiasTitulacionItem[];
  guias: HistoricoGuiasItemGuia[];
}
