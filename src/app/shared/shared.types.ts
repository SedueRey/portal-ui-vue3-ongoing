export interface WidgetService {
  url: string;
  icon: string;
  name: string;
  category: string[];
  id: string;
}

export interface Notificacion {
  aplicacion: string;
  categoria: string;
  personal: boolean;
  titulo: string;
  descripcion: string;
  estado: string;
  codigo_alerta: number;
  codigo_aplicacion: number;
  codigo_servicio_hijo: number | null;
  servicio_hijo: string | null;
  codigo_categoria: number;
  fecha_creacion: string;
  fecha_envio: string;
  correo_emisor: string | null;
  referencia_web: string | null;
}
