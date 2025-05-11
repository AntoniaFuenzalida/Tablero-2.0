class TableroCadenasTexto {
  constructor(id, tableroId, texto) {
    this.id = id; // ID único del mensaje
    this.tableroId = tableroId; // ID del tablero al que pertenece el mensaje
    this.texto = texto; // Contenido del mensaje
  }

  // Método para convertir un objeto JSON en una instancia de TableroCadenasTexto
  static fromJSON(json) {
    return new TableroCadenasTexto(json.id, json.tablero_id, json.texto);
  }

  // Método para convertir una instancia de TableroCadenasTexto en un objeto JSON
  toJSON() {
    return {
      id: this.id,
      tablero_id: this.tableroId,
      texto: this.texto,
    };
  }
}

export default TableroCadenasTexto;